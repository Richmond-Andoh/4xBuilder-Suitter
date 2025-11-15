/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROFILE_PACKAGE_ID?: string
  readonly VITE_POST_PACKAGE_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

