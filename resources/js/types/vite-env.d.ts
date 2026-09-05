/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly NASA_API_KEY?: string;
    readonly VITE_NASA_API_KEY?: string;
    readonly VITE_APP_NAME?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
