<template>
    <div
        class="relative object-contain max-sm:w-[var(--mangacover-width-sm)] max-sm:h-[var(--mangacover-height-sm)] w-(--mangacover-width) h-(--mangacover-height) rounded-lg overflow-clip">
        <div
            v-if="blur"
            class="absolute l-0 t-0 w-full h-full rounded-lg overflow-clip"
            style="
                background: linear-gradient(150deg, rgba(245, 169, 184, 0.3) 50%, rgba(91, 206, 250, 0.2));
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(2px) brightness(70%);
                -webkit-backdrop-filter: blur(2px) brightness(70%);
            ">
            <p class="p-3 max-sm:text-sm text-xl font-semibold max-h-full overflow-clip text-shadow-lg text-white">
                {{ manga?.name }}
            </p>
        </div>
        <LazyNuxtImg
            :src="`${$config.public.openFetch.api.baseURL}v2/Manga/${manga.key}/Cover/Medium`"
            class="w-full h-full object-cover" />
        <UTooltip
            v-if="chapterProgress !== null"
            :text="`${(manga as MinimalManga).downloadedChapters} / ${(manga as MinimalManga).totalChapters} chapters downloaded`">
            <div class="absolute bottom-0 left-0 w-full h-4 bg-black/60">
                <div
                    class="h-full"
                    :class="chapterProgress === 100 ? 'bg-success' : 'bg-error'"
                    :style="{ width: chapterProgress + '%' }" />
                <span class="absolute inset-0 flex items-center justify-center text-[10px] leading-none font-semibold text-white text-shadow-lg">
                    {{ (manga as MinimalManga).downloadedChapters }} / {{ (manga as MinimalManga).totalChapters }}
                </span>
            </div>
        </UTooltip>
    </div>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type Manga = components['schemas']['Manga'];
// Not in the (upstream) OpenAPI schema yet - the totals are returned by our fork's /v2/Manga endpoints
// but the typed client's schema is generated from upstream's repo, see nuxt.config.ts.
type MinimalManga = components['schemas']['MinimalManga'] & { totalChapters: number; downloadedChapters: number };

const props = defineProps<{ manga: Manga | MinimalManga; blur?: boolean }>();

const chapterProgress = computed(() => {
    if (!('totalChapters' in props.manga) || !props.manga.totalChapters) return null;
    return Math.round((props.manga.downloadedChapters / props.manga.totalChapters) * 100);
});
</script>
