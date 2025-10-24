import { Product } from '../interfaces/types';
import { VALIDATION, SEO_LIMITS } from '../constants';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateProduct = (product: Product | null): ValidationResult => {
  const errors: string[] = [];

  if (!product) {
    return { isValid: false, errors: ['Product is required'] };
  }

  // Required fields validation
  if (!product.name?.trim()) {
    errors.push('Product name is required');
  }

  if (!product.productNumber?.trim()) {
    errors.push('Product number is required');
  }

  // SEO validation
  if (product.metaTitle && product.metaTitle.length > SEO_LIMITS.META_TITLE_MAX_LENGTH) {
    errors.push(`Meta title exceeds maximum length of ${SEO_LIMITS.META_TITLE_MAX_LENGTH} characters`);
  }

  if (product.metaDescription && product.metaDescription.length > SEO_LIMITS.META_DESCRIPTION_MAX_LENGTH) {
    errors.push(`Meta description exceeds maximum length of ${SEO_LIMITS.META_DESCRIPTION_MAX_LENGTH} characters`);
  }

  // Description validation
  if (product.description && product.description.length < VALIDATION.MIN_DESCRIPTION_LENGTH) {
    errors.push(`Description must be at least ${VALIDATION.MIN_DESCRIPTION_LENGTH} characters long`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateFormData = (formData: any): ValidationResult => {
  const errors: string[] = [];

  if (!formData.id) {
    errors.push('Product ID is required');
  }

  if (!formData.description?.trim()) {
    errors.push('Description is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
