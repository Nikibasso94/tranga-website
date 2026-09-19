<template>
    <UModal v-bind="$props" title="Delete Manga">
        <template #body>
            <div class="flex flex-col gap-3">
                <p>
                    <span v-if="mangaName">
                        This removes <b>{{ mangaName }}</b> from Tranga.
                    </span>
                    <span v-else>This removes this Manga from Tranga.</span>
                    Choose what happens to its already-downloaded chapters on disk.
                </p>
                <UButton icon="i-lucide-trash-2" color="error" variant="solid" loading-auto @click="remove(true)">
                    Delete Manga and downloaded chapters
                </UButton>
                <UButton icon="i-lucide-eye-off" color="warning" variant="soft" loading-auto @click="remove(false)">
                    Remove from library only (keep files on disk)
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

// deleteFiles isn't in the (upstream) typed OpenAPI schema yet, see the raw $fetch calls elsewhere
// in this app for the same pattern.
const remove = async (deleteFiles: boolean) => {
    await $fetch(`${config.public.openFetch.api.baseURL}v2/Manga/${props.mangaId}?deleteFiles=${deleteFiles}`, {
        method: 'DELETE',
    });
    await refreshNuxtData(FetchKeys.Manga.All);
    emit('close', true);
    await navigateTo('/');
};
</script>
