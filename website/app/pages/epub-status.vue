<template>
    <TrangaPage title="EPUB Conversion" rimless>
        <template #actions>
            <UTooltip text="Reload" :kbds="['meta', 'R']">
                <UButton variant="soft" color="secondary" icon="i-lucide-refresh-ccw" loading-auto @click="refresh" />
            </UTooltip>
        </template>
        <div class="w-full pt-2">
            <p class="text-dimmed pb-2">{{ data?.length ?? 0 }} manga with downloaded chapters</p>
            <UTable :data="data ?? []" :columns="columns" :loading="status === 'pending'" class="h-full">
                <template #mangaName-cell="{ row }">
                    <UButton :to="`/manga/${row.original.mangaId}?return=${$route.fullPath}`" variant="ghost" color="primary">
                        {{ row.original.mangaName }}
                        <UIcon v-if="row.original.autoConvertToEpub" name="i-lucide-tablet-smartphone" class="text-primary" />
                    </UButton>
                </template>
                <template #progress-cell="{ row }">
                    <div class="flex items-center gap-2 min-w-40">
                        <UProgress
                            :model-value="row.original.epubChapters"
                            :max="row.original.downloadedChapters"
                            :color="row.original.epubChapters === row.original.downloadedChapters ? 'success' : 'secondary'" />
                        <UBadge
                            variant="outline"
                            :color="row.original.epubChapters === row.original.downloadedChapters ? 'success' : 'neutral'">
                            {{ row.original.epubChapters }} / {{ row.original.downloadedChapters }}
                        </UBadge>
                    </div>
                </template>
            </UTable>
        </div>
    </TrangaPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '#ui/components/Table.vue';

interface EpubConversionByManga {
    mangaId: string;
    mangaName: string;
    downloadedChapters: number;
    epubChapters: number;
    autoConvertToEpub: boolean;
}

const config = useRuntimeConfig();
// Not in the (upstream) typed OpenAPI schema yet - see ChaptersList.vue for the same pattern.
const { data, refresh, status } = useFetch<EpubConversionByManga[]>(
    () => `${config.public.openFetch.api.baseURL}v2/Stats/EpubConversion`,
    { key: 'Stats/EpubConversion', server: false }
);

const columns: TableColumn<EpubConversionByManga>[] = [
    { id: 'mangaName', accessorKey: 'mangaName', header: 'Manga' },
    { id: 'progress', accessorKey: 'epubChapters', header: 'Converted' },
];

defineShortcuts({ meta_r: { usingInput: true, handler: refresh } });
useHead({ title: 'EPUB Conversion' });
</script>
