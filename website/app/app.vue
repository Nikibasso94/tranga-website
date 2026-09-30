<template>
    <UApp>
        <UHeader :toggle="true">
            <template #left>
                <NuxtLink to="/">
                    <div class="h-full flex gap-2 items-center">
                        <img src="/blahaj.png" class="h-lh cursor-grab" alt="Blahaj" />
                        <p
                            style="
                                background: linear-gradient(110deg, var(--color-pink), var(--color-blue));
                                background-clip: text;
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                            "
                            class="font-bold cursor-pointer text-3xl">
                            Tranga
                        </p>
                    </div>
                </NuxtLink>
            </template>
            <template #body>
                <UNavigationMenu :items="items" orientation="vertical" variant="link" color="neutral" />
            </template>
            <template #default>
                <UNavigationMenu :items="items" orientation="horizontal" variant="link" color="neutral" />
            </template>
            <template #right>
                <UTooltip text="Live download progress">
                    <UButton
                        icon="i-lucide-download"
                        to="/downloads"
                        :disabled="$route.fullPath.startsWith('/downloads')"
                        variant="soft"
                        color="secondary" />
                </UTooltip>
                <UTooltip text="Activity log">
                    <UButton
                        icon="i-lucide-brick-wall-shield"
                        :to="`/actions?return=${$route.fullPath}`"
                        :disabled="$route.fullPath.startsWith('/actions')"
                        variant="soft"
                        color="secondary" />
                </UTooltip>
                <UButton icon="i-lucide-plus" to="/search" color="primary">
                    <template #default>
                        <span class="max-sm:hidden">Manga</span>
                    </template>
                </UButton>
                <UColorModeButton color="secondary" />
                <UButton icon="i-lucide-settings" variant="ghost" to="/settings" color="secondary" />
                <UTooltip v-if="authEnabled && authenticated" text="Log out">
                    <UButton icon="i-lucide-log-out" variant="ghost" color="secondary" @click="logout" />
                </UTooltip>
            </template>
        </UHeader>
        <UMain>
            <UPage>
                <NuxtPage />
            </UPage>
        </UMain>
    </UApp>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/components/NavigationMenu.vue';

const items = computed<NavigationMenuItem[]>(() => [
    { label: 'API', to: 'https://github.com/C9Glax/tranga', icon: 'i-lucide-github', target: '_blank' },
    { label: 'Website', to: 'https://github.com/C9Glax/tranga-website', icon: 'i-lucide-github', target: '_blank' },
    { label: 'Swagger', to: `${useRuntimeConfig().public.openFetch.api.baseURL}swagger`, icon: 'i-lucide-book-open', target: '_blank' },
]);

const authEnabled = ref(false);
const authenticated = ref(false);
const route = useRoute();
const refreshAuthState = async () => {
    authEnabled.value = await $fetch<boolean>('/v2/Auth/Enabled').catch(() => false);
    authenticated.value = authEnabled.value
        ? await $fetch('/v2/Auth/Session', { credentials: 'include' })
              .then(() => true)
              .catch(() => false)
        : false;
};
onMounted(refreshAuthState);
// The login page itself doesn't reload the app, so re-check right after a successful login too -
// otherwise the logout button stays hidden until the next full navigation.
watch(() => route.path, refreshAuthState);
const logout = async () => {
    await $fetch('/v2/Auth/Logout', { method: 'POST', credentials: 'include' });
    authenticated.value = false;
    await navigateTo('/login');
};
</script>
