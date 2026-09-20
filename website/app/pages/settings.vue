<template>
    <TrangaPage>
        <UPageSection title="Settings" :ui="{ container: 'py-2 sm:py-2 lg:py-2 gap-2' }">
            <template #description>
                <div v-if="settingsStatus === 'error'">
                    <p class="text-warning">Unable to connect to api.</p>
                    <p class="">NUXT_PUBLIC_OPEN_FETCH_API_BASE_URL: {{ $config.public.openFetch.api.baseURL }}</p>
                </div>
            </template>
            <UCard v-if="settingsStatus === 'success'">
                <template #header>
                    <h1>Libraries</h1>
                </template>
                <template #footer>
                    <div class="flex flex-row gap-2">
                        <UButton icon="i-lucide-plus" class="w-fit" @click="addLibraryModal.open()">Add FileLibrary</UButton>
                        <UTooltip :text="komgaConnected ? 'Disconnect Komga' : 'Connect Komga'">
                            <UButton
                                :icon="komgaConnected ? 'i-lucide-unlink' : 'i-lucide-link'"
                                class="w-fit"
                                label="Komga"
                                @click="onKomgaClick" />
                        </UTooltip>
                        <UTooltip :text="kavitaConnected ? 'Disconnect Kavita' : 'Connect Kavita'">
                            <UButton
                                :icon="kavitaConnected ? 'i-lucide-unlink' : 'i-lucide-link'"
                                class="w-fit"
                                label="Kavita"
                                @click="onKavitaClick" />
                        </UTooltip>
                    </div>
                </template>
                <FileLibraries />
            </UCard>
            <UCard v-if="settingsStatus === 'success'">
                <template #header>
                    <h1>Notifications</h1>
                </template>
                <NotificationConnectors />
                <template #footer>
                    <div class="flex flex-row gap-2">
                        <UButton icon="i-lucide-plus" class="w-fit" @click="addGotifyModal.open()">Add Gotify</UButton>
                        <UButton icon="i-lucide-plus" class="w-fit" @click="addNtfyModal.open()">Add Ntfy</UButton>
                        <UButton icon="i-lucide-plus" class="w-fit" @click="addPushoverModal.open()">Add Pushover</UButton>
                        <UButton icon="i-lucide-plus" class="w-fit" @click="addGenericConnectorModal.open()"
                            >Add Generic Notification Connector</UButton
                        >
                    </div>
                </template>
            </UCard>
            <UCard v-if="settingsStatus === 'success'">
                <template #header>
                    <h1>Performance</h1>
                </template>
                <div class="flex flex-col gap-4 max-w-xs">
                    <UFormField
                        label="Concurrent chapter downloads"
                        description="How many chapters can download at the same time. Lower this if downloads fail with too many chapters running at once.">
                        <UInputNumber v-model="maxConcurrentDownloads" :min="1" @update:model-value="onMaxConcurrentDownloadsChange" />
                    </UFormField>
                    <UFormField
                        label="Concurrent workers"
                        description="How many background jobs (downloads, checks, refreshes, ...) can run at the same time in total.">
                        <UInputNumber v-model="maxConcurrentWorkers" :min="1" @update:model-value="onMaxConcurrentWorkersChange" />
                    </UFormField>
                </div>
            </UCard>
            <UCard v-if="settingsStatus === 'success'">
                <template #header>
                    <h1>Maintenance</h1>
                </template>
                <div class="flex gap-2">
                    <UButton icon="i-lucide-database" loading-auto class="w-fit mb-2" @click="cleanUpDatabase">Clean database</UButton>
                    <UButton icon="i-lucide-captions-off" loading-auto class="w-fit mb-2" @click="cleanUpActions">Clean actions</UButton>
                </div>
            </UCard>
            <UCard>
                <template #header>
                    <h1>Stats</h1>
                </template>
                <div class="flex flex-row flex-wrap gap-2">
                    <UButton v-if="stats" to="/missing-chapters" variant="outline" color="warning" size="sm">
                        Missing Chapters: {{ stats.missingChapters }}
                    </UButton>
                    <template v-for="(value, name) in stats" :key="name">
                        <UBadge v-if="name !== 'missingChapters'" variant="outline" color="neutral">
                            {{ deCamel(name) }}: {{ value }}
                        </UBadge>
                    </template>
                </div>
            </UCard>
        </UPageSection>
    </TrangaPage>
</template>

<script setup lang="ts">
import {
    LazyAddLibraryModal,
    LazyGenericNotificationConnectorModal,
    LazyGotifyModal,
    LazyKavitaModal,
    LazyKomgaModal,
    LazyNtfyModal,
    LazyPushoverModal,
} from '#components';
import FileLibraries from '~/components/FileLibraries.vue';
import { refreshNuxtData } from '#app';
const overlay = useOverlay();
const { $api } = useNuxtApp();
const config = useRuntimeConfig();

const addLibraryModal = overlay.create(LazyAddLibraryModal);
const komgaModal = overlay.create(LazyKomgaModal);
const kavitaModal = overlay.create(LazyKavitaModal);

const addGotifyModal = overlay.create(LazyGotifyModal);
const addNtfyModal = overlay.create(LazyNtfyModal);
const addPushoverModal = overlay.create(LazyPushoverModal);
const addGenericConnectorModal = overlay.create(LazyGenericNotificationConnectorModal);

const cleanUpDatabase = async () => {
    await useApi('/v2/Maintenance/CleanupNoDownloadManga', { method: 'POST' });
    await refreshNuxtData(FetchKeys.Manga.All);
};
const cleanUpActions = async () => {
    await useApi('/v2/Maintenance/CleanupActions', { method: 'POST' });
};

const { data: libraries } = useApi('/v2/LibraryConnector', { key: FetchKeys.Libraries.All });
const komgaConnected = computed(() => libraries.value?.find((l) => l.type === 'Komga'));
const onKomgaClick = async () => {
    if (!komgaConnected.value) {
        komgaModal.open();
    } else {
        await $api('/v2/LibraryConnector/{LibraryConnectorId}', {
            method: 'DELETE',
            path: { LibraryConnectorId: komgaConnected.value.key },
        });
        await refreshNuxtData(FetchKeys.Libraries.All);
    }
};
const kavitaConnected = computed(() => libraries.value?.find((l) => l.type === 'Kavita'));
const onKavitaClick = async () => {
    if (!kavitaConnected.value) {
        kavitaModal.open();
    } else {
        await $api('/v2/LibraryConnector/{LibraryConnectorId}', {
            method: 'DELETE',
            path: { LibraryConnectorId: kavitaConnected.value.key },
        });
        await refreshNuxtData(FetchKeys.Libraries.All);
    }
};

const { data: settings, status: settingsStatus } = useApi('/v2/Settings', { key: FetchKeys.Settings.All, server: false });

// MaxConcurrentDownloads/MaxConcurrentWorkers are fork-specific endpoints not present in the
// upstream OpenAPI schema the typed $api client is generated from, so they're called via raw $fetch.
const maxConcurrentDownloads = ref<number>();
const maxConcurrentWorkers = ref<number>();
watch(
    settings,
    (value) => {
        if (!value) return;
        maxConcurrentDownloads.value = value.maxConcurrentDownloads;
        maxConcurrentWorkers.value = value.maxConcurrentWorkers;
    },
    { immediate: true },
);
const onMaxConcurrentDownloadsChange = async (value: number) => {
    await $fetch(`${config.public.openFetch.api.baseURL}/v2/Settings/MaxConcurrentDownloads/${value}`, { method: 'PATCH' });
};
const onMaxConcurrentWorkersChange = async (value: number) => {
    await $fetch(`${config.public.openFetch.api.baseURL}/v2/Settings/MaxConcurrentWorkers/${value}`, { method: 'PATCH' });
};

const { data: stats } = useApi('/v2/Stats', { server: false });
const deCamel = (camel: string): string =>
    camel.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());

useHead({ title: 'Settings' });
</script>
