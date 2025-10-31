import React, { useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import FormField from './FormField';
import LocationFieldsSection from './LocationFieldsSection';
import { useContactForm } from '../hooks/useContactForm';
import { useVehicleSelection } from '../hooks/useVehicleSelection';
import ContactRequestService from '../services/contactRequestService';
import { FormErrors } from '../types/contactRequest';

/**
 * ContactRequestForm Component
 * Form for submitting contact requests with selected vehicles
 * All fields start empty - zero mock data
 */

interface ContactRequestFormProps {
  onSubmitSuccess?: (requestId: number) => void;
  onSubmitError?: (error: string) => void;
}

interface ContactRequestFormData {
  fullName: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  preferredContactMethod: string;
  additionalComments: string;
}

export const ContactRequestForm: React.FC<ContactRequestFormProps> = ({
  onSubmitSuccess,
  onSubmitError,
}) => {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Get selected vehicles from localStorage
  const { selectedVehicles } = useVehicleSelection(true);

  // Initialize form with empty values - NO mock data
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<ContactRequestFormData>({
    mode: 'onChange', // Real-time validation on every keystroke
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      province: '',
      city: '',
      preferredContactMethod: 'email',
      additionalComments: '',
    },
  });

  const { clearAllErrors } = useContactForm();

  const handleFormSubmit = async (data: ContactRequestFormData) => {
    if (!selectedVehicles || selectedVehicles.length === 0) {
      setSubmitError('Please select at least one vehicle');
      if (onSubmitError) {
        onSubmitError('No vehicles selected');
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await ContactRequestService.submitContactRequest({
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        province: data.province,
        city: data.city,
        preferredContactMethod: data.preferredContactMethod as 'email' | 'phone' | 'whatsapp',
        additionalComments: data.additionalComments.trim(),
        selectedVehicles: selectedVehicles,
      });

      // Check if submission was successful
      if (response.success) {
        // Success - clear form
        reset();
        setSelectedProvince(null);
        setSelectedCity(null);
        clearAllErrors();

        if (onSubmitSuccess && response.contactRequestId) {
          onSubmitSuccess(response.contactRequestId);
        }
      } else {
        // Backend returned validation errors
        if (response.errors && response.errors.length > 0) {
          // Map backend validation errors to form errors
          const backendErrors: FormErrors = {};
          response.errors.forEach((error) => {
            backendErrors[error.field] = error.message;
          });

          // Set form errors
          Object.entries(backendErrors).forEach(([field, message]) => {
            clearErrors(field as any);
          });

          setSubmitError(response.message || 'Please fix the validation errors and try again');
        } else {
          setSubmitError(response.message || 'Failed to submit request');
        }

        if (onSubmitError) {
          onSubmitError(response.message || 'Submission failed');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit request. Please try again later.';
      setSubmitError(errorMessage);
      if (onSubmitError) {
        onSubmitError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    // Clear error for this field immediately when user starts typing (good UX)
    if (errors[fieldName as keyof ContactRequestFormData]) {
      clearErrors(fieldName as keyof ContactRequestFormData);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        width: '100%',
        maxWidth: '600px',
      }}
    >
      {/* Error Alert */}
      {submitError && (
        <Alert
          severity="error"
          onClose={() => setSubmitError(null)}
          sx={{ marginBottom: 3 }}
        >
          {submitError}
        </Alert>
      )}

      {/* Form Fields Stack */}
      <Stack spacing={3}>
        {/* Contact Information Section */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              marginBottom: 2,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Contact Information
          </Typography>

          <Stack spacing={2}>
            {/* Full Name */}
            <FormField
              {...register('fullName', {
                required: 'Full name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 255, message: 'Name must not exceed 255 characters' },
                pattern: {
                  value: /^[a-zA-Z\s'-]+$/,
                  message: 'Name can only contain letters, spaces, hyphens, or apostrophes',
                },
              })}
              label="Full Name"
              name="fullName"
              placeholder="John Smith"
              error={Boolean(errors.fullName)}
              errorMessage={errors.fullName?.message}
              required
              disabled={isSubmitting}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
            />

            {/* Email */}
            <FormField
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                  message: 'Please enter a valid email address',
                },
              })}
              label="Email Address"
              name="email"
              type="email"
              placeholder="john@example.com"
              error={Boolean(errors.email)}
              errorMessage={errors.email?.message}
              required
              disabled={isSubmitting}
              onChange={(e) => handleFieldChange('email', e.target.value)}
            />

            {/* Phone */}
            <FormField
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^\+[0-9]{1,3}\s?[0-9\s-]{6,15}$/,
                  message: 'Phone must include country code (e.g., +27 83 456 7890)',
                },
              })}
              label="Phone Number"
              name="phone"
              placeholder="+27 83 456 7890"
              error={Boolean(errors.phone)}
              errorMessage={errors.phone?.message}
              required
              disabled={isSubmitting}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
            />
          </Stack>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            height: '1px',
            backgroundColor: theme.palette.divider,
            margin: '8px 0',
          }}
        />

        {/* Location Section */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              marginBottom: 2,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Location
          </Typography>

          {/* Location Fields */}
          <Box>
            {/* Province Hidden Input for react-hook-form */}
            <input
              {...register('province', {
                required: 'Province is required',
              })}
              type="hidden"
              value={selectedProvince || ''}
            />
            
            {/* City Hidden Input for react-hook-form */}
            <input
              {...register('city', {
                required: selectedProvince ? 'City is required' : false,
              })}
              type="hidden"
              value={selectedCity || ''}
            />

            <LocationFieldsSection
              selectedProvince={selectedProvince}
              selectedCity={selectedCity}
              onProvinceChange={(provinceId) => {
                setSelectedProvince(provinceId);
                handleFieldChange('province', String(provinceId));
              }}
              onCityChange={(cityName) => {
                setSelectedCity(cityName);
                handleFieldChange('city', cityName);
              }}
              provinceError={errors.province?.message}
              cityError={errors.city?.message}
              disabled={isSubmitting}
            />
          </Box>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            height: '1px',
            backgroundColor: theme.palette.divider,
            margin: '8px 0',
          }}
        />

        {/* Contact Preferences Section */}
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              marginBottom: 2,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Contact Preferences
          </Typography>

          <Stack spacing={2}>
            {/* Preferred Contact Method */}
            <FormField
              {...register('preferredContactMethod', {
                required: 'Preferred contact method is required',
              })}
              label="Preferred Contact Method"
              name="preferredContactMethod"
              select
              SelectProps={{
                native: true,
              }}
              error={Boolean(errors.preferredContactMethod)}
              errorMessage={errors.preferredContactMethod?.message}
              required
              disabled={isSubmitting}
              onChange={(e) => handleFieldChange('preferredContactMethod', e.target.value)}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="whatsapp">WhatsApp</option>
            </FormField>

            {/* Additional Comments */}
            <FormField
              {...register('additionalComments', {
                maxLength: {
                  value: 1000,
                  message: 'Comments must not exceed 1000 characters',
                },
              })}
              label="Additional Comments (Optional)"
              name="additionalComments"
              placeholder="Tell us anything else about your interest in these vehicles..."
              multiline
              rows={4}
              error={Boolean(errors.additionalComments)}
              errorMessage={errors.additionalComments?.message}
              disabled={isSubmitting}
              onChange={(e) => handleFieldChange('additionalComments', e.target.value)}
            />
          </Stack>
        </Box>

        {/* Submit Button */}
        <Box sx={{ display: 'flex', gap: 2, marginTop: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              minHeight: 44, // Material Design touch target
              minWidth: 200,
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              '&:disabled': {
                backgroundColor: theme.palette.action.disabled,
              },
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ marginRight: 1, color: 'inherit' }} />
                Submitting...
              </>
            ) : (
              'Submit Contact Request'
            )}
          </Button>
        </Box>

        {/* Info Message */}
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            textAlign: 'center',
            marginTop: 2,
            fontSize: '0.8125rem',
            lineHeight: 1.5,
          }}
        >
          We'll connect you with dealerships within 30 minutes. Your information is kept private.
        </Typography>
      </Stack>
    </Box>
  );
};

export default ContactRequestForm;
