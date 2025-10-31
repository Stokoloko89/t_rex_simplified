import React from 'react';
import {
  TextField,
  TextFieldProps,
  Box,
  Typography,
  FormHelperText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ValidationError from './ValidationError';

/**
 * FormField Component
 * Reusable Material-UI TextField wrapper for consistent form styling
 * Integrates with react-hook-form and displays validation errors
 */

interface FormFieldProps extends Omit<TextFieldProps, 'error' | 'helperText'> {
  label: string;
  name: string;
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error = false,
  errorMessage,
  required = false,
  disabled = false,
  ...otherProps
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        {...otherProps}
        name={name}
        label={label}
        fullWidth
        required={required}
        disabled={disabled}
        error={error}
        variant="outlined"
        size="medium"
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: disabled ? '#f5f5f5' : '#ffffff',
            borderRadius: 1,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: disabled ? '#f5f5f5' : '#ffffff',
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              boxShadow: `0 0 0 3px ${theme.palette.primary.light}20`,
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? theme.palette.error.main : theme.palette.divider,
          },
          '& .MuiOutlinedInput-input': {
            padding: '12px 14px',
            fontSize: '1rem',
            color: theme.palette.text.primary,
            '&::placeholder': {
              color: theme.palette.text.secondary,
              opacity: 0.7,
            },
          },
          '& .MuiInputLabel-root': {
            color: theme.palette.text.primary,
            fontSize: '0.875rem',
            fontWeight: 500,
            '&.Mui-focused': {
              color: theme.palette.primary.main,
            },
            '&.Mui-error': {
              color: theme.palette.error.main,
            },
          },
        }}
      />

      {/* Error Message Display using ValidationError Component */}
      <ValidationError
        fieldName={name}
        message={error ? errorMessage : undefined}
        showIcon={true}
      />
    </Box>
  );
};

export default FormField;
