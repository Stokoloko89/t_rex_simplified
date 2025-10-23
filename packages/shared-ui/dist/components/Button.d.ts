import React from 'react';
import { ButtonProps } from '@mui/material';
interface SharedButtonProps extends ButtonProps {
    loading?: boolean;
}
declare const Button: React.FC<SharedButtonProps>;
export default Button;
