import tailwindcss from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image', '@nuxt/ui', 'nuxt-open-fetch', '@nuxtjs/mdc', '@vite-pwa/nuxt'],
    devServer: { host: '127.0.0.1' },
    openFetch: {
        clients: {
            api: { baseURL: '', schema: 'https://raw.githubusercontent.com/C9Glax/tranga/refs/heads/testing/API/openapi/API_v2.json' },
        },
    },
    vite: { plugins: [tailwindcss()] },
    nitro: { prerender: { failOnError: false } },
    app: {
        head: {
            title: 'Tranga',
            htmlAttrs: { lang: 'en' },
            link: [
                { rel: 'icon', type: 'image/png', href: '/blahaj.png' },
                { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
            ],
        },
    },
    pwa: {
        registerType: 'autoUpdate',
        manifest: {
            name: 'Tranga',
            short_name: 'Tranga',
            description: 'Automatic Manga and Metadata downloader',
            theme_color: '#f5a9b8',
            background_color: '#111827',
            display: 'standalone',
            icons: [
                { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
                { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
                { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            ],
        },
        // Installable only - no offline caching. The app is useless without the API, so caching the
        // static shell for offline use wouldn't give a usable experience anyway.
        workbox: { globPatterns: [] },
        devOptions: { enabled: false },
    },
});
