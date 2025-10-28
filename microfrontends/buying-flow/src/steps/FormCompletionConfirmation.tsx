import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Container
} from '@mui/material';
import { CheckCircle, Email } from '@mui/icons-material';

interface FormCompletionConfirmationProps {
  initialData: {
    message: string;
    subMessage: string;
    title: string;
  };
  onSubmit: (data: { action: string }) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const FormCompletionConfirmation: React.FC<FormCompletionConfirmationProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading
}) => {
  const handleContinue = () => {
    onSubmit({ action: 'continue_to_vehicle_help' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card
        elevation={2}
        sx={{
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Success Icon */}
          <Box sx={{ mb: 3 }}>
            <CheckCircle
              sx={{
                fontSize: 48,
                color: '#4caf50',
                mb: 2
              }}
            />
          </Box>

          {/* Main Message */}
          <Typography
            variant="h5"
            component="h1"
            sx={{
              fontWeight: 600,
              color: '#1a1a1a',
              mb: 2,
              letterSpacing: '-0.02em'
            }}
          >
            {initialData.title}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#424242',
              mb: 3,
              fontWeight: 400
            }}
          >
            {initialData.message}
          </Typography>

          <Divider sx={{ my: 3, mx: 'auto', maxWidth: 300 }} />

          {/* Email Confirmation */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Email sx={{ color: '#2196f3', mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  color: '#2196f3',
                  fontWeight: 500
                }}
              >
                Email Sent Successfully
              </Typography>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                maxWidth: 400,
                mx: 'auto',
                lineHeight: 1.5
              }}
            >
              {initialData.subMessage}
            </Typography>
          </Box>

          {/* Continue Button */}
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="medium"
              onClick={handleContinue}
              disabled={isLoading}
              sx={{
                px: 4,
                py: 1,
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: 2,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #007AFF 0%, #0056cc 100%)',
                boxShadow: '0 2px 8px rgba(0, 122, 255, 0.2)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0056cc 0%, #004499 100%)',
                  boxShadow: '0 3px 10px rgba(0, 122, 255, 0.3)',
                }
              }}
            >
              Continue to Vehicle Search
            </Button>
          </Box>

          {/* Additional Info */}
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.85rem',
                maxWidth: 350,
                mx: 'auto'
              }}
            >
              Ready to find your perfect vehicle? Click the button above to get started.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FormCompletionConfirmation;
