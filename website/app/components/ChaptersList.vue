<template>
    <div class="w-full pt-2">
        <div class="flex min-2xl:flex-row max-2xl:flex-col gap-2 justify-around items-center mb-2">
            <div class="grow-1 basis-0 flex gap-2 flex-row max-sm:flex-wrap max-2xl:order-2 items-center">
                <p class="text-dimmed">{{ data?.totalCount }} chapters</p>
                <UFieldGroup>
                    <UInput v-model="filter.name" placeholder="Name" />
                    <UButton icon="i-lucide-rotate-ccw" variant="outline" size="xs" @click="filter.name = undefined" />
                </UFieldGroup>
            </div>
            <UPagination
                :default-page="pagination.pageIndex + 1"
                :items-per-page="pagination.pageSize"
                :total="data?.totalCount ?? 0"
                class="flex justify-center grow-1 basis-0 max-2xl:order-1"
                @update:page="(p) => (pagination.pageIndex = p - 1)" />
            <div class="grow-1 basis-0 flex gap-2 flex-row max-sm:flex-wrap max-2xl:order-3">
                <UFieldGroup>
                    <UTooltip text="Downloaded">
                        <UButton
                            :icon="
                                filter.downloaded
                                    ? 'i-lucide-cloud-check'
                                    : filter.downloaded === false
                                      ? 'i-lucide-cloud-alert'
                                      : 'i-lucide-badge-question-mark'
                            "
                            variant="outline"
                            color="neutral"
                            @click="filter.downloaded = !filter.downloaded" />
                    </UTooltip>
                    <UButton icon="i-lucide-rotate-ccw" variant="outline" size="xs" @click="filter.downloaded = undefined" />
                </UFieldGroup>
                <UFieldGroup>
                    <UInputNumber v-model="filter.volumeNumber" placeholder="Vol" class="w-30" />
                    <UButton icon="i-lucide-rotate-ccw" variant="outline" size="xs" @click="filter.volumeNumber = undefined" />
                </UFieldGroup>
                <UFieldGroup>
                    <UInput v-model="filter.chapterNumber" placeholder="Ch" class="w-30" />
                    <UButton icon="i-lucide-rotate-ccw" variant="outline" size="xs" @click="filter.chapterNumber = undefined" />
                </UFieldGroup>
            </div>
        </div>
        <UPageList class="gap-2 overflow-y-scroll px-[1px] py-[1px]">
            <UPageCard
                v-for="chapter in data?.data"
                :id="chapter.key"
                :key="chapter.key"
                orientation="horizontal"
                :ui="{ container: 'p-2 sm:p-2' }"
                :class="[$route.hash.substring(1) == chapter.key ? 'animate-[flash_0.75s_ease_0.5s]' : '']">
                <template #title>
                    <p class="text-primary">{{ chapter.title }}</p>
                    <p class="text-secondary">
                        <span v-if="chapter.volume" class="mr-1">Vol. {{ chapter.volume }}</span>
                        <span class="inline">Ch. {{ chapter.chapterNumber }}</span>
                    </p>
                </template>
                <template #description>
                    <p>{{ chapter.fileName }}</p>
                </template>
                <template #default>
                    <div class="flex flex-row gap-2 w-full items-center">
                        <UTooltip :text="chapter.downloaded ? 'Downloaded' : 'Not downloaded'">
                            <UIcon :name="chapter.downloaded ? 'i-lucide-cloud-check' : 'i-lucide-cloud-alert'" size="20" />
                        </UTooltip>
                        <div
                            v-for="mangaconnectorId in chapter.mangaConnectorIds.sort((a, b) =>
                                a.mangaConnectorName < b.mangaConnectorName ? -1 : 1
                            )"
                            :key="mangaconnectorId.key"
                            class="bg-elevated p-1 rounded-lg w-fit flex items-center justify-center gap-2">
                            <MangaconnectorIcon v-bind="mangaconnectorId" />
                            <UTooltip
                                :text="
                                    mangaconnectorId.useForDownload ? 'Stop downloading from this website' : 'Download from this website'
                                ">
                                <UButton
                                    :icon="mangaconnectorId.useForDownload ? 'i-lucide-cloud-off' : 'i-lucide-cloud-download'"
                                    variant="ghost"
                                    loading-auto
                                    @click="setDownload(mangaconnectorId.key, !mangaconnectorId.useForDownload)" />
                            </UTooltip>
                        </div>
                        <UTooltip :text="hasActiveSource(chapter) ? 'Delete and re-download this chapter' : 'No download source set for this chapter'">
                            <UButton
                                variant="outline"
                                color="secondary"
                                class="ml-auto"
                                loading-auto
                                :disabled="!hasActiveSource(chapter)"
                                @click="forceRedownload(chapter.key)">
                                Force (re)download
                            </UButton>
                        </UTooltip>
                    </div>
                </template>
            </UPageCard>
        </UPageList>
    </div>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type ChapterFilterRecord = components['schemas']['ChapterFilterRecord'];

const initialDownloadedQuery = useRoute().query.downloaded;
const initialDownloaded = initialDownloadedQuery === 'false' ? false : initialDownloadedQuery === 'true' ? true : undefined;
const filter = ref<Partial<ChapterFilterRecord>>({ downloaded: initialDownloaded });

const pagination = ref({ pageIndex: 0, pageSize: 10 });

export interface ChaptersListProps {
    mangaId: string;
}
const props = defineProps<ChaptersListProps>();
const { $api } = useNuxtApp();
const config = useRuntimeConfig();

const { data, refresh } = useAsyncData(
    FetchKeys.Chapters.All,
    () =>
        $api('/v2/Chapters/Manga/{MangaId}', {
            method: 'POST',
            query: { page: pagination.value.pageIndex + 1, pageSize: pagination.value.pageSize },
            path: { MangaId: props.mangaId },
            body: filter.value,
        }),
    { watch: [pagination.value, filter.value], lazy: true, server: false }
);

// Not in the (upstream) typed OpenAPI schema yet - see the raw $fetch calls in useDownloadProgress.ts
// and missing-chapters.vue for the same pattern. Keyed by the MangaConnectorId's own id (not by
// connector name + chapter), since a Chapter can have several MangaConnectorIds from the *same*
// connector (e.g. a stale/duplicate Mangaworld link), which a name-based lookup can't tell apart.
const setDownload = async (mangaConnectorIdId: string, requested: boolean) => {
    await $fetch(`${config.public.openFetch.api.baseURL}v2/Chapters/ConnectorId/${mangaConnectorIdId}/DownloadFrom/${requested}`, {
        method: 'PATCH',
    });
    await refresh();
};

type ChapterListItem = NonNullable<typeof data.value>['data'][number];
const hasActiveSource = (chapter: ChapterListItem) => chapter.mangaConnectorIds.some((m) => m.useForDownload);

const forceRedownload = async (chapterId: string) => {
    await $fetch(`${config.public.openFetch.api.baseURL}v2/Chapters/${chapterId}/ForceRedownload`, {
        method: 'POST',
    });
    await refresh();
};
</script>
