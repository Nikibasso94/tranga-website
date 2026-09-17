<template>
    <TrangaPage title="Downloads" rimless>
        <template #actions>
            <UBadge :color="connected ? 'success' : 'error'" variant="subtle">{{ connected ? 'Live' : 'Disconnected' }}</UBadge>
            <UButton variant="soft" color="secondary" icon="i-lucide-eraser" @click="clearFinished">Clear finished</UButton>
        </template>
        <div class="w-full pt-2">
            <p v-if="sortedItems.length === 0" class="text-dimmed text-center py-8">
                No download activity yet this session. Start a download to see live progress here.
            </p>
            <UPageList v-else class="gap-2">
                <UPageCard
                    v-for="item in sortedItems"
                    :key="item.workerId"
                    orientation="horizontal"
                    :ui="{ container: 'p-3 sm:p-3' }">
                    <template #title>
                        <UButton
                            :to="`/manga/${item.mangaId}?return=${$route.fullPath}`"
                            variant="ghost"
                            color="primary"
                            class="p-0 h-auto">
                            {{ item.mangaName }}
                        </UButton>
                        <span class="text-secondary ml-2">Ch. {{ item.chapterNumber }}</span>
                    </template>
                    <template #default>
                        <div class="flex flex-row items-center gap-3 w-full">
                            <UBadge :color="phaseColor(item.phase)" :icon="phaseIcon(item.phase)" variant="subtle">
                                {{ phaseLabel(item) }}
                            </UBadge>
                            <UProgress
                                v-if="item.phase === 'DownloadingImages'"
                                :model-value="Math.round(item.progress * 100)"
                                class="flex-1" />
                            <UButton
                                v-if="item.phase === 'Completed' || item.phase === 'Failed'"
                                icon="i-lucide-x"
                                variant="ghost"
                                color="neutral"
                                size="xs"
                                class="ml-auto"
                                @click="dismiss(item.workerId)" />
                        </div>
                    </template>
                </UPageCard>
            </UPageList>
        </div>
    </TrangaPage>
</template>

<script setup lang="ts">
const { items, connected, dismiss } = useDownloadProgress();

const sortedItems = computed(() => {
    const rank = (phase: string) => (phase === 'Failed' ? 0 : phase === 'Completed' ? 2 : 1);
    return Array.from(items.value.values()).sort((a, b) => rank(a.phase) - rank(b.phase));
});

const clearFinished = () => {
    for (const item of Array.from(items.value.values())) {
        if (item.phase === 'Completed' || item.phase === 'Failed') dismiss(item.workerId);
    }
};

const phaseColor = (phase: string) =>
    phase === 'Failed' ? 'error' : phase === 'Completed' ? 'success' : phase === 'DownloadingImages' ? 'info' : 'neutral';

const phaseIcon = (phase: string) =>
    phase === 'Failed'
        ? 'i-lucide-circle-x'
        : phase === 'Completed'
          ? 'i-lucide-circle-check'
          : phase === 'PackagingArchive'
            ? 'i-lucide-package'
            : phase === 'DownloadingImages'
              ? 'i-lucide-download'
              : 'i-lucide-link';

const phaseLabel = (item: { phase: string; currentImage: number; totalImages: number }) =>
    item.phase === 'DownloadingImages'
        ? `${item.currentImage} / ${item.totalImages} images`
        : item.phase.replace(/(?=[A-Z])/g, ' ').trim();

useHead({ title: 'Downloads' });
</script>
