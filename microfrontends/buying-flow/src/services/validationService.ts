/**
 * Form Validation Service
 * Runtime schema validation for contact request forms
 * Note: Zod schema definitions provided below for reference
 * After running `pnpm install`, use the Zod implementation from /zod-validation-service.ts
 */

import { FormErrors, ValidationError } from '../types/contactRequest';

/**
 * Email validation using RFC 5322 pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * International phone validation (E.164 format)
 * Accepts: +[country code][1-14 digits]
 * Examples: +27 83 456 7890, +1 555 123 4567, +44 20 7946 0958
 */
const PHONE_REGEX = /^\+\d{1,3}\s?\d{1,14}$/;

/**
 * Full name validation (letters, spaces, hyphens, apostrophes)
 */
const FULL_NAME_REGEX = /^[a-zA-Z\s'-]+$/;

/**
 * Field validators for real-time validation feedback
 */
export const fieldValidators = {
  fullName: (value: string) => {
    if (!value) {
      return 'Full name is required';
    }
    if (value.length < 2) {
      return 'Full name must be at least 2 characters';
    }
    if (value.length > 255) {
      return 'Full name must not exceed 255 characters';
    }
    if (!FULL_NAME_REGEX.test(value)) {
      return 'Full name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return null;
  },

  email: (value: string) => {
    if (!value) {
      return 'Email address is required';
    }
    if (!EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address (e.g., name@example.com)';
    }
    return null;
  },

  phone: (value: string) => {
    if (!value) {
      return 'Phone number is required';
    }
    if (!PHONE_REGEX.test(value)) {
      return 'Phone must include country code (e.g., +27 83 456 7890 for South Africa, +1 555 123 4567 for USA)';
    }
    return null;
  },

  province: (value: string) => {
    if (!value) {
      return 'Please select a province from the list';
    }
    if (value.length > 100) {
      return 'Province name too long';
    }
    return null;
  },

  city: (value: string) => {
    if (!value) {
      return 'Please select a city from the list for your province';
    }
    if (value.length > 100) {
      return 'City name too long';
    }
    return null;
  },

  preferredContactMethod: (value: string) => {
    const validMethods = ['email', 'phone', 'whatsapp'];
    if (!value) {
      return 'Please select how you would like to be contacted';
    }
    if (!validMethods.includes(value)) {
      return 'Please select a valid contact method (Email, Phone, or WhatsApp)';
    }
    return null;
  },

  additionalComments: (value: string) => {
    if (value && value.length > 1000) {
      return 'Additional comments must not exceed 1000 characters';
    }
    return null;
  },

  selectedVehicles: (vehicles: any[]) => {
    if (!Array.isArray(vehicles)) {
      return 'Invalid vehicle selection';
    }
    if (vehicles.length === 0) {
      return 'Please select at least 1 vehicle';
    }
    if (vehicles.length > 4) {
      return 'You can select a maximum of 4 vehicles';
    }
    // Validate each vehicle has required fields
    for (const vehicle of vehicles) {
      if (!vehicle.vehicleId || !vehicle.make || !vehicle.model || !vehicle.year) {
        return 'One or more vehicles have invalid data';
      }
    }
    return null;
  },
};

/**
 * Validate entire contact request payload
 * Returns FormErrors object if validation fails, null if successful
 */
export function validateContactRequest(data: any): FormErrors | null {
  const errors: FormErrors = {};

  // Validate each field
  if (data.fullName !== undefined) {
    const error = fieldValidators.fullName(data.fullName || '');
    if (error) errors.fullName = error;
  }

  if (data.email !== undefined) {
    const error = fieldValidators.email(data.email || '');
    if (error) errors.email = error;
  }

  if (data.phone !== undefined) {
    const error = fieldValidators.phone(data.phone || '');
    if (error) errors.phone = error;
  }

  if (data.province !== undefined) {
    const error = fieldValidators.province(data.province || '');
    if (error) errors.province = error;
  }

  if (data.city !== undefined) {
    const error = fieldValidators.city(data.city || '');
    if (error) errors.city = error;
  }

  if (data.preferredContactMethod !== undefined) {
    const error = fieldValidators.preferredContactMethod(data.preferredContactMethod || '');
    if (error) errors.preferredContactMethod = error;
  }

  if (data.additionalComments !== undefined) {
    const error = fieldValidators.additionalComments(data.additionalComments || '');
    if (error) errors.additionalComments = error;
  }

  if (data.selectedVehicles !== undefined) {
    const error = fieldValidators.selectedVehicles(data.selectedVehicles || []);
    if (error) errors.selectedVehicles = error;
  }

  // Return errors object if any errors found, else null
  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Validate a single field
 * Returns error message string if validation fails, null if successful
 */
export function validateField(
  fieldName: keyof typeof fieldValidators,
  value: any
): string | null {
  const validator = fieldValidators[fieldName];
  if (validator) {
    try {
      return validator(value);
    } catch {
      return 'Validation error';
    }
  }
  return null;
}

/**
 * Convert validation errors to ValidationError array format
 * Used for API error responses
 */
export function convertErrorsToValidationErrors(
  errors: FormErrors
): ValidationError[] {
  return Object.entries(errors).map(([field, message]) => ({
    field,
    message,
    severity: 'error' as const,
  }));
}

/**
 * Check if a field has validation errors
 */
export function hasFieldError(fieldName: string, errors: FormErrors): boolean {
  return fieldName in errors && errors[fieldName] !== '';
}

/**
 * Get error message for a specific field
 */
export function getFieldError(
  fieldName: string,
  errors: FormErrors
): string | null {
  return errors[fieldName] || null;
}

/**
 * Clear error for a specific field
 */
export function clearFieldError(
  fieldName: string,
  errors: FormErrors
): FormErrors {
  const newErrors = { ...errors };
  delete newErrors[fieldName];
  return newErrors;
}

/**
 * Clear all errors
 */
export function clearAllErrors(): FormErrors {
  return {};
}

/**
 * ZOD SCHEMA REFERENCE (for future implementation after pnpm install)
 * 
 * import { z } from 'zod';
 * 
 * export const contactRequestSchema = z.object({
 *   fullName: z
 *     .string()
 *     .min(2, 'Full name must be at least 2 characters')
 *     .max(255, 'Full name must not exceed 255 characters')
 *     .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
 *   
 *   email: z.string().email('Please enter a valid email address'),
 *   
 *   phone: z
 *     .string()
 *     .regex(/^\+\d{1,3}\s?\d{1,14}$/, 'Phone must include country code'),
 *   
 *   province: z.string().min(1, 'Province is required').max(100),
 *   city: z.string().min(1, 'City is required').max(100),
 *   
 *   preferredContactMethod: z.enum(['email', 'phone', 'whatsapp']),
 *   additionalComments: z.string().max(1000).optional().default(''),
 *   
 *   selectedVehicles: z
 *     .array(z.object({
 *       vehicleId: z.number().positive(),
 *       make: z.string().min(1),
 *       model: z.string().min(1),
 *       year: z.number().positive(),
 *       price: z.number().positive(),
 *       imageUrl: z.string().url(),
 *     }))
 *     .min(1, 'Select at least 1 vehicle')
 *     .max(4, 'Select at most 4 vehicles'),
 * });
 */

