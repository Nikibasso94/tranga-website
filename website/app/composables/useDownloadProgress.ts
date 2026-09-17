import * as signalR from '@microsoft/signalr';

export type DownloadPhase = 'FetchingUrls' | 'DownloadingImages' | 'PackagingArchive' | 'Completed' | 'Failed';

export interface DownloadProgressData {
    workerId: string;
    chapterId: string;
    mangaId: string;
    mangaName: string;
    chapterNumber: string;
    currentImage: number;
    totalImages: number;
    progress: number;
    phase: DownloadPhase;
}

/**
 * Subscribes to the backend's "all-downloads" SignalR group for the lifetime of the
 * component that calls this, so live per-chapter download progress (including failures,
 * which used to disappear from the UI without any trace) can be shown.
 */
export const useDownloadProgress = () => {
    const config = useRuntimeConfig();
    const items = ref<Map<string, DownloadProgressData>>(new Map());
    const connected = ref(false);
    let connection: signalR.HubConnection | null = null;

    const dismiss = (workerId: string) => {
        const next = new Map(items.value);
        next.delete(workerId);
        items.value = next;
        $fetch(`${config.public.openFetch.api.baseURL}v2/Worker/${workerId}`, { method: 'DELETE' }).catch(() => {
            // Worker may already be gone / still running - nothing actionable for the user here
        });
    };

    onMounted(async () => {
        const hubUrl = `${config.public.openFetch.api.baseURL}hubs/download-progress`;
        connection = new signalR.HubConnectionBuilder().withUrl(hubUrl).withAutomaticReconnect().build();

        connection.on('DownloadProgress', (data: DownloadProgressData) => {
            const next = new Map(items.value);
            next.set(data.workerId, data);
            items.value = next;
        });

        connection.onreconnected(() => {
            connected.value = true;
            connection?.invoke('SubscribeToAll').catch(() => {});
        });
        connection.onreconnecting(() => (connected.value = false));
        connection.onclose(() => (connected.value = false));

        try {
            await connection.start();
            await connection.invoke('SubscribeToAll');
            connected.value = true;
        } catch (e) {
            console.error('Failed to connect to download-progress hub', e);
            connected.value = false;
        }
    });

    onUnmounted(async () => {
        if (connection) {
            try {
                await connection.invoke('UnsubscribeFromAll');
            } catch {
                // connection may already be closed
            }
            await connection.stop();
        }
    });

    return { items, connected, dismiss };
};
