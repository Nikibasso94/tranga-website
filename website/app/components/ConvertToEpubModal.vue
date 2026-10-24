<template>
    <UModal v-bind="$props" title="Convert to EPUB">
        <template #body>
            <div class="flex flex-col gap-3">
                <p>
                    Converts every downloaded chapter of
                    <span v-if="mangaName"
                        ><b>{{ mangaName }}</b></span
                    ><span v-else>this Manga</span>
                    to a Kindle-compatible .epub, and keeps converting newly-downloaded chapters automatically from now on.
                    <b>The original .cbz files are deleted</b> once each chapter is converted - this cannot be undone. Conversion runs in
                    the background and may take a while for Manga with many chapters.
                </p>
                <UButton icon="i-lucide-tablet-smartphone" color="warning" variant="solid" loading-auto @click="convert">
                    Convert all chapters
                </UButton>
                <UButton color="neutral" variant="ghost" @click="emit('close', false)">Cancel</UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{ mangaId: string; mangaName?: string }>();
const config = useRuntimeConfig();
const emit = defineEmits<{ close: [boolean] }>();

// Not in the (upstream) typed OpenAPI schema yet - see ChaptersList.vue for the same pattern.
const convert = async () => {
    await $fetch(`${config.public.openFetch.api.baseURL}v2/Manga/${props.mangaId}/ConvertToEpub`, {
        method: 'POST',
    });
    await refreshNuxtData([FetchKeys.Chapters.All, FetchKeys.Manga.Id(props.mangaId)]);
    emit('close', true);
};
</script>
