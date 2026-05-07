// ============================================================
// i18n/index.ts — Public barrel export for the i18n module
// ============================================================

export * from "./types"
export * from "./detection"    // includes isStaticLocale, persistLocale, detectLocale
export * from "./loader"       // includes loadStaticTranslations, translateDynamically
export * from "./utils"        // includes getLocalizedField, translate
export { I18nProvider, useTranslation, useT, useLocale } from "./context"

