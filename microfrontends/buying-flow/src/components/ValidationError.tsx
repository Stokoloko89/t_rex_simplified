import React, { useEffect, useState } from 'react';
import { Box, Typography, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WarningIcon from '@mui/icons-material/Warning';

/**
 * ValidationError Component
 * Displays single field error message with Material Design error styling
 * Red background, icon, and error text
 */

interface ValidationErrorProps {
  fieldName?: string;
  message?: string;
  showIcon?: boolean;
}

export const ValidationError: React.FC<ValidationErrorProps> = ({
  fieldName,
  message,
  showIcon = true,
}) => {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  /**
   * Show error with fade-in animation when message appears
   */
  useEffect(() => {
    if (message && message.trim().length > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!message || message.trim().length === 0) {
    return null;
  }

  return (
    <Fade in={visible} timeout={200}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
          padding: 1.5,
          backgroundColor: '#ffebee', // Light red background
          borderRadius: 1,
          border: `1px solid ${theme.palette.error.light}`,
          marginTop: 1,
          marginBottom: 0,
        }}
      >
        {showIcon && (
          <WarningIcon
            sx={{
              color: theme.palette.error.main,
              fontSize: '1.2rem',
              marginTop: '0.2rem',
              flexShrink: 0,
            }}
          />
        )}

        <Box sx={{ flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.error.main,
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {message}
          </Typography>
          {fieldName && (
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.error.dark,
                fontSize: '0.75rem',
                marginTop: 0.5,
                display: 'block',
                opacity: 0.8,
              }}
            >
              Field: {fieldName}
            </Typography>
          )}
        </Box>
      </Box>
    </Fade>
  );
};

export default ValidationError;
