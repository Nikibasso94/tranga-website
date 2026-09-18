<template>
    <LoadingPage :loading="status === 'pending'">
        <MangaCardList :manga="manga" class="min-md:mx-4 max-md:mx-0 mt-2" @click="(m) => navigateTo(`/manga/${m.key}`)" />
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

useHead({ title: 'Tranga' });
</script>
