import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40 
}) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      p={3}
    >
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `conic-gradient(
            from 0deg,
            #FF6B35 0deg 80deg,
            #F7B801 100deg 170deg,
            #4CAF50 190deg 260deg,
            #2196F3 280deg 350deg,
            #FF6B35 370deg
          )`,
          animation: `${spinAnimation} 0.6s linear infinite`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            width: `${size * 0.7}px`,
            height: `${size * 0.7}px`,
            borderRadius: '50%',
            backgroundColor: 'background.paper',
            position: 'absolute',
          }
        }}
      />
      {message && (
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2,
            background: 'linear-gradient(90deg, #FF6B35, #F7B801, #4CAF50, #2196F3)',
            backgroundSize: '300% 300%',
            animation: `${gradientAnimation} 1.8s ease infinite`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 500
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
