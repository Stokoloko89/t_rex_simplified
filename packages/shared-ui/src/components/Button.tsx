import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface SharedButtonProps extends ButtonProps {
  loading?: boolean;
}

const Button: React.FC<SharedButtonProps> = ({ loading, children, disabled, sx, ...props }) => {
  const isContained = props.variant === 'contained';
  
  return (
    <MuiButton 
      {...props} 
      disabled={disabled || loading}
      sx={[
        // Base styles for contained buttons
        isContained && {
          px: 4,
          py: 1,
          fontSize: '1rem',
          fontWeight: 500,
          borderRadius: 2,
          textTransform: 'none',
          backgroundColor: '#1e3a8a',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)',
          '&:hover': {
            backgroundColor: '#1e40af',
            boxShadow: '0 3px 10px rgba(30, 58, 138, 0.3)',
          },
          '&.Mui-disabled': {
            backgroundColor: '#cbd5e1',
            color: '#ffffff',
            boxShadow: 'none',
          }
        },
        // Merge custom sx styles (they will override if specified)
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button;
