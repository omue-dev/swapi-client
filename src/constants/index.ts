// SEO and validation constants
export const SEO_LIMITS = {
  META_TITLE_MAX_LENGTH: 80,
  META_DESCRIPTION_MAX_LENGTH: 250,
} as const;

// Gender options
export const GENDER_OPTIONS = [
  { value: '', label: '–' },
  { value: 'Damen', label: 'Damen' },
  { value: 'Herren', label: 'Herren' },
  { value: 'Unisex', label: 'Unisex' },
] as const;

// Snackbar configuration
export const SNACKBAR_CONFIG = {
  AUTO_HIDE_DURATION: 6000,
  ANCHOR_ORIGIN: { vertical: 'top' as const, horizontal: 'center' as const },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  SINGLE_PRODUCT: '/single-product',
  UPDATE_MAIN_PRODUCT: '/update-main-product',
  UPDATE_RELATED_PRODUCTS: '/update-related-products',
} as const;

// Form validation
export const VALIDATION = {
  REQUIRED_FIELDS: ['name', 'productNumber'] as const,
  MIN_DESCRIPTION_LENGTH: 10,
} as const;

// UI constants
export const UI = {
  DEBOUNCE_DELAY: 300,
  PAGINATION_OPTIONS: [10, 25, 50, 100] as const,
  MIN_EDITOR_HEIGHT: 150,
} as const;
