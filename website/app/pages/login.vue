<template>
    <div class="flex flex-col items-center justify-center min-h-[80vh] gap-6">
        <div class="flex gap-2 items-center">
            <img src="/blahaj.png" class="h-12" alt="Blahaj" />
            <p
                style="
                    background: linear-gradient(110deg, var(--color-pink), var(--color-blue));
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                "
                class="font-bold text-4xl">
                Tranga
            </p>
        </div>
        <UCard class="w-full max-w-sm">
            <form class="flex flex-col gap-4" @submit.prevent="login">
                <UFormField label="Username">
                    <UInput v-model="username" autofocus autocomplete="username" class="w-full" />
                </UFormField>
                <UFormField label="Password">
                    <UInput v-model="password" type="password" autocomplete="current-password" class="w-full" />
                </UFormField>
                <UAlert v-if="error" color="error" variant="subtle" title="Invalid username or password" />
                <UButton type="submit" block loading-auto :disabled="!username || !password">Log in</UButton>
            </form>
        </UCard>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const username = ref('');
const password = ref('');
const error = ref(false);

const login = async () => {
    error.value = false;
    try {
        await $fetch('/v2/Auth/Login', {
            method: 'POST',
            body: { username: username.value, password: password.value },
            credentials: 'include',
        });
        await navigateTo((route.query.return as string) ?? '/');
    } catch {
        error.value = true;
    }
};

useHead({ title: 'Log in - Tranga' });
</script>
