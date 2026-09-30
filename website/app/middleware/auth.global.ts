// Login is optional on the API side (only enforced if AUTH_USERNAME/AUTH_PASSWORD are set there), so
// this checks with the API on every navigation instead of assuming a fixed app-wide mode. Client-only:
// this app talks to the API through nginx via relative /v2/... paths, which only resolve in the browser.
export default defineNuxtRouteMiddleware(async (to) => {
    if (import.meta.server || to.path === '/login') return;

    const enabled = await $fetch<boolean>('/v2/Auth/Enabled').catch(() => false);
    if (!enabled) return;

    const authenticated = await $fetch('/v2/Auth/Session', { credentials: 'include' })
        .then(() => true)
        .catch(() => false);
    if (!authenticated) return navigateTo(`/login?return=${encodeURIComponent(to.fullPath)}`);
});
