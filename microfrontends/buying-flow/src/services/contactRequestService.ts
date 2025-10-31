/**
 * Contact Request API Service
 * Handles communication with backend for contact request submission
 */

import axios, { AxiosError, AxiosInstance } from 'axios';
import { ContactRequestPayload, ContactRequestResponse, ValidationError } from '../types/contactRequest';
import { convertErrorsToValidationErrors } from './validationService';

/**
 * Default API configuration
 */
const DEFAULT_API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 30000;

/**
 * Contact Request API Client
 */
class ContactRequestService {
  private apiClient: AxiosInstance;
  private retryAttempts: number;
  private baseURL: string;

  constructor(
    baseURL: string = DEFAULT_API_BASE_URL,
    retryAttempts: number = DEFAULT_RETRY_ATTEMPTS
  ) {
    this.baseURL = baseURL;
    this.retryAttempts = retryAttempts;

    // Create axios instance with configuration
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(this.handleError(error))
    );
  }

  /**
   * Submit a contact request to the backend
   * Includes automatic retry logic for network failures
   */
  async submitContactRequest(
    payload: ContactRequestPayload,
    retryCount: number = 0
  ): Promise<ContactRequestResponse> {
    try {
      // Transform payload to match backend expectations
      // Backend expects vehicleIds array, not selectedVehicles objects
      const backendPayload = {
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        province: payload.province,
        city: payload.city,
        preferredContactMethod: payload.preferredContactMethod,
        additionalComments: payload.additionalComments,
        vehicleIds: payload.selectedVehicles.map(v => v.vehicleId),
      };

      const response = await this.apiClient.post<ContactRequestResponse>(
        '/contact-requests',
        backendPayload
      );

      return {
        success: true,
        contactRequestId: response.data.contactRequestId,
        message: response.data.message || 'Contact request submitted successfully',
        nextStep: response.data.nextStep || 'Your request has been received',
      };
    } catch (error) {
      // Handle validation errors (422)
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || [];
        return {
          success: false,
          message: 'Please fix the validation errors below',
          errors: validationErrors,
        };
      }

      // Handle vehicle not available (409)
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return {
          success: false,
          message: 'One or more selected vehicles are no longer available. Please refresh and try again.',
          errors: [
            {
              field: 'selectedVehicles',
              message: 'Vehicles unavailable - please refresh',
              severity: 'error',
            },
          ],
        };
      }

      // Retry on network errors
      if (retryCount < this.retryAttempts && this.isRetryableError(error)) {
        // Exponential backoff: 1s, 2s, 4s
        const delayMs = Math.pow(2, retryCount) * 1000;
        await this.delay(delayMs);
        return this.submitContactRequest(payload, retryCount + 1);
      }

      // Handle other errors
      throw new ContactRequestError(
        'Failed to submit contact request. Please try again later.',
        error
      );
    }
  }

  /**
   * Fetch available provinces for dropdown
   */
  async getProvinces(): Promise<{ id: number; name: string }[]> {
    try {
      const response = await this.apiClient.get('/locations/provinces');
      return response.data.provinces || [];
    } catch (error) {
      throw new ContactRequestError('Failed to load provinces', error);
    }
  }

  /**
   * Fetch cities for a specific province
   */
  async getCities(provinceId: number): Promise<{ id: number; name: string }[]> {
    try {
      const response = await this.apiClient.get(`/locations/provinces/${provinceId}/cities`);
      return response.data.cities || [];
    } catch (error) {
      throw new ContactRequestError(`Failed to load cities for province ${provinceId}`, error);
    }
  }

  /**
   * Private helper methods
   */

  private isRetryableError(error: any): boolean {
    if (!axios.isAxiosError(error)) {
      return false;
    }

    // Retry on network timeout or no response
    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
      return true;
    }

    // Retry on 5xx server errors
    if (error.response?.status && error.response.status >= 500) {
      return true;
    }

    // Do not retry on client errors (4xx) except timeouts
    return false;
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        return new Error(
          error.response.data?.message || `Server error: ${error.response.status}`
        );
      } else if (error.request) {
        // Request made but no response
        return new Error('No response from server. Please check your connection.');
      }
    }

    // Network error or other
    return new Error('Network error. Please try again.');
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Custom error class for contact request failures
 */
export class ContactRequestError extends Error {
  public readonly originalError: any;

  constructor(message: string, originalError?: any) {
    super(message);
    this.name = 'ContactRequestError';
    this.originalError = originalError;
  }
}

/**
 * Create and export a singleton instance
 */
const contactRequestService = new ContactRequestService();

export default contactRequestService;

/**
 * For testing purposes, export the class as well
 */
export { ContactRequestService };
