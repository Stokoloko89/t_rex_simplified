/**
 * Contact Request Type Definitions
 * Data structures for contact request form and submission
 */

import { SelectedVehicle } from './vehicle';

/**
 * ContactRequestFormState - Form field values for contact request
 */
export interface ContactRequestFormState {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  city: string;
  preferredContactMethod: 'email' | 'phone' | 'whatsapp';
  additionalComments: string;
}

/**
 * ContactRequestPayload - Complete payload submitted to backend
 */
export interface ContactRequestPayload extends ContactRequestFormState {
  selectedVehicles: SelectedVehicle[];
}

/**
 * ValidationError - Represents a single field validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

/**
 * FormErrors - Map of field names to their validation error messages
 */
export type FormErrors = Record<string, string>;

/**
 * ContactRequestResponse - Backend response after form submission
 */
export interface ContactRequestResponse {
  success: boolean;
  contactRequestId?: number;
  message: string;
  errors?: ValidationError[];
  nextStep?: string;
}

/**
 * FormSubmissionState - State tracking form submission progress
 */
export interface FormSubmissionState {
  isSubmitting: boolean;
  submitError?: string;
  submitSuccess: boolean;
  response?: ContactRequestResponse;
}

/**
 * ContactFormContextValue - Contextual data for the entire contact form
 */
export interface ContactFormContextValue {
  formState: ContactRequestFormState;
  errors: FormErrors;
  submissionState: FormSubmissionState;
  setFormState: (state: Partial<ContactRequestFormState>) => void;
  setErrors: (errors: FormErrors) => void;
  clearField: (field: keyof ContactRequestFormState) => void;
  submit: (payload: ContactRequestPayload) => Promise<ContactRequestResponse>;
}

/**
 * Type guard to check if value is a valid ContactRequestFormState
 */
export function isContactRequestFormState(value: unknown): value is ContactRequestFormState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'fullName' in value &&
    'phone' in value &&
    'email' in value &&
    'province' in value &&
    'city' in value &&
    'preferredContactMethod' in value
  );
}

/**
 * Type guard to check if value is a valid ContactRequestPayload
 */
export function isContactRequestPayload(value: unknown): value is ContactRequestPayload {
  return isContactRequestFormState(value) && 'selectedVehicles' in value;
}
