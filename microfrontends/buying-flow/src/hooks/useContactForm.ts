/**
 * useContactForm Hook
 * Manages contact form state and validation using react-hook-form
 */

import { useState, useCallback } from 'react';
import { useForm, FieldValues, UseFormReturn } from 'react-hook-form';
import { ContactRequestFormState, FormErrors } from '../types/contactRequest';
import { validateField, clearFieldError } from '../services/validationService';

interface UseContactFormOptions {
  onSubmit?: (data: ContactRequestFormState) => Promise<void>;
  initialValues?: Partial<ContactRequestFormState>;
}

interface UseContactFormReturn extends UseFormReturn<any> {
  errors: FormErrors;
  isValidating: boolean;
  submitError: string | null;
  clearError: (fieldName: keyof ContactRequestFormState) => void;
  clearAllErrors: () => void;
  getFieldError: (fieldName: string) => string | null;
}

/**
 * Custom hook for managing contact form state
 */
export function useContactForm(
  options: UseContactFormOptions = {}
): UseContactFormReturn {
  const {
    onSubmit,
    initialValues = {},
  } = options;

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Initialize react-hook-form
  const form = useForm<ContactRequestFormState>({
    mode: 'onChange', // Validate on change for real-time feedback
    defaultValues: {
      fullName: initialValues.fullName || '',
      email: initialValues.email || '',
      phone: initialValues.phone || '',
      province: initialValues.province || '',
      city: initialValues.city || '',
      preferredContactMethod: initialValues.preferredContactMethod || 'email',
      additionalComments: initialValues.additionalComments || '',
    },
  });

  const { watch, formState: { isDirty } } = form;
  const formData = watch();

  /**
   * Validate a single field
   */
  const validateFieldValue = useCallback(
    async (fieldName: keyof ContactRequestFormState, value: any) => {
      setIsValidating(true);
      try {
        const error = validateField(fieldName, value);
        
        if (error) {
          setFormErrors((prev) => ({
            ...prev,
            [fieldName]: error,
          }));
        } else {
          // Clear error if validation passes
          setFormErrors((prev) => {
            const updated = { ...prev };
            delete updated[fieldName];
            return updated;
          });
        }
      } finally {
        setIsValidating(false);
      }
    },
    []
  );

  /**
   * Clear error for a specific field
   */
  const clearError = useCallback((fieldName: keyof ContactRequestFormState) => {
    setFormErrors((prev) => clearFieldError(fieldName, prev));
  }, []);

  /**
   * Clear all errors
   */
  const clearAllErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  /**
   * Get error message for a field
   */
  const getFieldError = useCallback((fieldName: string): string | null => {
    return formErrors[fieldName] || null;
  }, [formErrors]);

  /**
   * Watch for field changes and clear errors on correction
   */
  const unsubscribe = watch((data) => {
    // Clear errors as user types (UX: immediate feedback on correction)
    Object.keys(formErrors).forEach((fieldName) => {
      if (fieldName in data && data[fieldName as keyof typeof data]) {
        clearError(fieldName as keyof ContactRequestFormState);
      }
    });
  });

  return {
    ...form,
    errors: formErrors,
    isValidating,
    submitError,
    clearError,
    clearAllErrors,
    getFieldError,
  };
}

export type { UseContactFormReturn, UseContactFormOptions };
