import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import VehicleReviewList, { Vehicle } from '../components/VehicleReviewList';
import { ContactRequestForm } from '../components/ContactRequestForm';

/**
 * ContactRequestStep Component
 * Displays selected vehicles for review and contact request form
 * Part of the buying workflow
 */

interface ContactRequestStepProps {
  selectedVehicles?: Vehicle[];
  onBackToSelection?: () => void;
  onSubmitComplete?: (requestId: number) => void;
  isLoading?: boolean;
}

export const ContactRequestStep: React.FC<ContactRequestStepProps> = ({
  selectedVehicles = [],
  onBackToSelection,
  onSubmitComplete,
  isLoading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleBackClick = () => {
    if (onBackToSelection) {
      onBackToSelection();
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingY: { xs: 2, sm: 4 },
        paddingX: { xs: 1, sm: 2 },
      }}
    >
      {/* Page Header */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            marginBottom: 1,
          }}
        >
          Complete Your Contact Request
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: '1rem',
          }}
        >
          Review your selected vehicles and provide your contact information so dealerships can reach out to you.
        </Typography>
      </Box>

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

      {/* Loading State */}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingY: 4,
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Processing your request...
          </Typography>
        </Box>
      )}

      {/* Main Content */}
      {!isLoading && (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 2,
            padding: { xs: 2, sm: 3, md: 4 },
            marginBottom: 4,
          }}
        >
          {/* Vehicle Review Section */}
          <Box sx={{ marginBottom: 4 }}>
            <VehicleReviewList
              selectedVehicles={selectedVehicles}
              onBackToSelection={handleBackClick}
              isEditable={true}
            />
          </Box>

          {/* Contact Form Section */}
          <Box
            sx={{
              paddingTop: 3,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                color: theme.palette.text.primary,
                marginBottom: 3,
              }}
            >
              Your Contact Information
            </Typography>

            {/* Contact Request Form */}
            <ContactRequestForm
              onSubmitSuccess={(requestId) => {
                if (onSubmitComplete) {
                  onSubmitComplete(requestId);
                }
              }}
              onSubmitError={(error) => {
                setSubmitError(error);
              }}
            />
          </Box>
        </Paper>
      )}

      {/* Info Section */}
      <Alert severity="info" sx={{ marginTop: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, marginBottom: 1 }}>
          What Happens Next:
        </Typography>
        <Typography variant="caption" component="div" sx={{ marginBottom: 0.5 }}>
          • Your contact request will be submitted to dealerships matching your selected vehicles
        </Typography>
        <Typography variant="caption" component="div" sx={{ marginBottom: 0.5 }}>
          • You'll receive a confirmation email within the next 30 minutes
        </Typography>
        <Typography variant="caption" component="div">
          • Dealerships will contact you via your preferred contact method
        </Typography>
      </Alert>
    </Container>
  );
};

export default ContactRequestStep;
