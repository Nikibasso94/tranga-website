<template>
    <LoadingPage :loading="status === 'pending'">
        <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search monitored manga"
            class="w-full max-w-sm min-md:mx-4 max-md:mx-0 mt-2"
            @keydown.esc="search = ''" />
        <div class="flex gap-2 items-start">
            <MangaCardList :manga="filteredManga" class="flex-1 min-md:mx-4 max-md:mx-0 mt-2" @click="(m) => navigateTo(`/manga/${m.key}`)" />
            <div class="hidden sm:flex flex-col items-center sticky top-20 shrink-0 pt-2">
                <button
                    v-for="letter in letters"
                    :key="letter"
                    type="button"
                    class="text-xs w-5 leading-5 text-center rounded hover:bg-elevated disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                    :disabled="!availableLetters.has(letter)"
                    @click="scrollToLetter(letter)">
                    {{ letter }}
                </button>
            </div>
        </div>
    </LoadingPage>
</template>

<script setup lang="ts">
const { data: manga, refresh, status } = await useApi('/v2/Manga', { key: FetchKeys.Manga.All, lazy: true, server: false });
onMounted(() => refresh());

// Keep the per-manga chapter progress bars current while chapters finish downloading in the
// background, without polling - re-fetch the list whenever the live download hub reports a
// Chapter as done.
const { items } = useDownloadProgress();
const completedCount = computed(() => Array.from(items.value.values()).filter((i) => i.phase === 'Completed').length);
watch(completedCount, () => refresh());

const search = ref('');
const filteredManga = computed(() => {
    const query = search.value.trim().toLowerCase();
    if (!query) return manga.value;
    return manga.value?.filter((m) => m.name.toLowerCase().includes(query));
});

// Manga list is already sorted alphabetically by the backend - jump to the first entry starting
// with a given letter instead of maintaining a separate index.
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
const firstLetter = (name: string) => {
    const c = name.trim().charAt(0).toUpperCase();
    return c >= 'A' && c <= 'Z' ? c : '#';
};
const availableLetters = computed(() => new Set((filteredManga.value ?? []).map((m) => firstLetter(m.name))));
const scrollToLetter = (letter: string) => {
    const target = (filteredManga.value ?? []).find((m) => firstLetter(m.name) === letter);
    if (!target) return;
    document.getElementById(target.key)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

useHead({ title: 'Tranga' });
</script>
