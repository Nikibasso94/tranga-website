<template>
    <TrangaPage title="Missing Chapters" rimless>
        <template #actions>
            <UTooltip text="Reload" :kbds="['meta', 'R']">
                <UButton variant="soft" color="secondary" icon="i-lucide-refresh-ccw" loading-auto @click="refresh" />
            </UTooltip>
        </template>
        <div class="w-full pt-2">
            <p class="text-dimmed pb-2">{{ data?.length ?? 0 }} manga with missing chapters</p>
            <UTable :data="data ?? []" :columns="columns" :loading="status === 'pending'" class="h-full">
                <template #mangaName-cell="{ row }">
                    <UButton
                        :to="`/manga/${row.original.mangaId}?downloaded=false&return=${$route.fullPath}`"
                        variant="ghost"
                        color="primary">
                        {{ row.original.mangaName }}
                    </UButton>
                </template>
                <template #missingCount-cell="{ row }">
                    <UBadge variant="outline" color="warning">{{ row.original.missingCount }}</UBadge>
                </template>
            </UTable>
        </div>
    </TrangaPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '#ui/components/Table.vue';

interface MissingChaptersByManga {
    mangaId: string;
    mangaName: string;
    missingCount: number;
}

const config = useRuntimeConfig();
const { data, refresh, status } = useFetch<MissingChaptersByManga[]>(
    () => `${config.public.openFetch.api.baseURL}v2/Stats/MissingChapters`,
    { key: 'Stats/MissingChapters', server: false }
);

const columns: TableColumn<MissingChaptersByManga>[] = [
    { id: 'mangaName', accessorKey: 'mangaName', header: 'Manga' },
    { id: 'missingCount', accessorKey: 'missingCount', header: 'Missing Chapters' },
];

defineShortcuts({ meta_r: { usingInput: true, handler: refresh } });
useHead({ title: 'Missing Chapters' });
</script>
