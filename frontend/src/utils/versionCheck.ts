/**
 * Version Check & Storage/Cache Purge Manager
 *
 * Automatically detects new frontend deployments, clears Cache Storage & obsolete cookies/caches,
 * while preserving user login authentication, biodata drafts, and preferences.
 */

// Critical keys that MUST be preserved across updates so users stay logged in with their data intact
const PRESERVED_EXACT_KEYS = new Set([
  'access_token',
  'refresh_token',
  'auth_token',
  'auth_user',
  'auth_user_id',
  'user_role',
  'app_lang',
  'app_build_version',
  'selected_template_id',
  'last_used_template_id',
  'last_used_template_name',
  'custom_templates_local_v1',
  'biodata_wizard_fields',
  'edit_profile_open',
  'theme',
]);

const shouldPreserveKey = (key: string): boolean => {
  if (PRESERVED_EXACT_KEYS.has(key)) return true;
  if (
    key.startsWith('soul_sync_') ||
    key.startsWith('truemarriage_') ||
    key.startsWith('tm_') ||
    key.startsWith('auth_') ||
    key.startsWith('user_')
  ) {
    return true;
  }
  return false;
};

export function initVersionCachePurge(): void {
  try {
    // In local development, avoid constantly purging caches on hot reloads
    if (import.meta.env.DEV) {
      return;
    }

    const currentVersion = typeof __APP_BUILD_VERSION__ !== 'undefined' ? __APP_BUILD_VERSION__ : 'dev';
    const savedVersion = localStorage.getItem('app_build_version');

    if (!savedVersion || savedVersion !== currentVersion) {
      console.log(`[App Update] Deploy version changed (${savedVersion || 'none'} -> ${currentVersion}). Clearing stale caches & cookies.`);

      // 1. Purge Browser Cache Storage (Service Worker & dynamic HTTP asset caches)
      if (typeof window !== 'undefined' && 'caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((name) => {
            caches.delete(name).catch(() => {});
          });
        }).catch(() => {});
      }

      // 2. Purge obsolete cookies (like Google Translate or outdated session flags) without touching HTTP-only auth cookies
      const obsoleteCookies = ['googtrans', 'googtrans_opt', 'googtrans_domain', '_googtrans', 'tm_lang'];
      const hostname = window.location.hostname;
      const domainParts = hostname.split('.');
      const domains = ['', hostname, `.${hostname}`];
      while (domainParts.length > 1) {
        domains.push(`.${domainParts.join('.')}`);
        domainParts.shift();
      }
      const paths = ['/', window.location.pathname, ''];

      domains.forEach((d) => {
        paths.forEach((p) => {
          obsoleteCookies.forEach((c) => {
            document.cookie = `${c}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p}; ${d ? `domain=${d};` : ''}`;
          });
        });
      });

      // 3. Purge non-essential localStorage items (e.g. stale translation dictionaries, old temp caches)
      try {
        const allKeys = Object.keys(localStorage);
        allKeys.forEach((key) => {
          if (!shouldPreserveKey(key)) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.warn('[App Update] Error pruning localStorage:', e);
      }

      // 4. Update the stored build version
      localStorage.setItem('app_build_version', currentVersion);
    }
  } catch (err) {
    console.warn('[App Update] Error during version check:', err);
  }
}
