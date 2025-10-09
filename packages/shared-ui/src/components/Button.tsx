import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface SharedButtonProps extends ButtonProps {
  loading?: boolean;
}

const Button: React.FC<SharedButtonProps> = ({ loading, children, disabled, ...props }) => {
  return (
    <MuiButton 
      {...props} 
      disabled={disabled || loading}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button;
