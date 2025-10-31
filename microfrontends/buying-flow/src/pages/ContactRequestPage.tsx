import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import VehicleReviewList from '../components/VehicleReviewList';
import ContactRequestStep from '../steps/ContactRequestStep';

/**
 * ContactRequestPage Component
 * Main page layout for multi-vehicle contact request submission
 * Two-column desktop layout (vehicles left, form right)
 * Stacked mobile/tablet layout (vehicles top, form bottom)
 */

interface ContactRequestPageProps {
  selectedVehicles?: any[];
  onBackToSelection?: () => void;
  onSubmitComplete?: (requestId: number) => void;
}

export const ContactRequestPage: React.FC<ContactRequestPageProps> = ({
  selectedVehicles = [],
  onBackToSelection,
  onSubmitComplete,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [isLoading, setIsLoading] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  return (
    <Container
      maxWidth="lg"
      sx={{
        paddingY: { xs: 2, sm: 3, md: 4 },
        paddingX: { xs: 1, sm: 2, md: 3 },
        minHeight: '100vh',
      }}
    >
      {/* Page Header */}
      <Box sx={{ marginBottom: { xs: 3, md: 4 } }}>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            marginBottom: 1,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          Complete Your Contact Request
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: { xs: '0.95rem', md: '1rem' },
            lineHeight: 1.6,
          }}
        >
          Review your selected vehicles and provide your contact information so dealerships can reach out to you.
        </Typography>
      </Box>

      {/* Page Error Alert */}
      {pageError && (
        <Alert
          severity="error"
          onClose={() => setPageError(null)}
          sx={{ marginBottom: 3 }}
        >
          {pageError}
        </Alert>
      )}

      {/* Page Loading State */}
      {isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingY: 6,
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
            Processing your request...
          </Typography>
        </Box>
      )}

      {/* Main Content Grid */}
      {!isLoading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr', // Mobile: full width
              sm: '1fr', // Tablet: full width
              md: '1fr 1.4fr', // Desktop: 40% vehicles, 60% form
            },
            gap: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Vehicle Review Section (Left/Top) */}
          <Box>
            <Paper
              elevation={0}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                padding: { xs: 2, sm: 3, md: 4 },
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              {/* Section Title */}
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  marginBottom: 2.5,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Vehicle Summary
              </Typography>

              {/* Vehicle Review List Component */}
              <Box sx={{ overflowY: 'auto', maxHeight: '600px' }}>
                <VehicleReviewList
                  selectedVehicles={selectedVehicles}
                  onBackToSelection={onBackToSelection}
                  isEditable={true}
                />
              </Box>
            </Paper>
          </Box>

          {/* Contact Form Section (Right/Bottom) */}
          <Box>
            <Paper
              elevation={0}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: 1,
                padding: { xs: 2, sm: 3, md: 4 },
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              {/* Section Title */}
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  marginBottom: 3,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Your Contact Information
              </Typography>

              {/* Contact Request Step Component (includes form) */}
              <ContactRequestStep
                onSubmitComplete={(requestId) => {
                  if (onSubmitComplete) {
                    onSubmitComplete(requestId);
                  }
                }}
              />
            </Paper>
          </Box>
        </Box>
      )}

      {/* Info Section */}
      <Alert
        severity="info"
        sx={{
          marginTop: { xs: 3, md: 4 },
          borderRadius: 1,
          backgroundColor: '#e3f2fd',
          borderColor: theme.palette.info.light,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            marginBottom: 1,
            color: theme.palette.info.dark,
          }}
        >
          What Happens Next:
        </Typography>
        <Box
          component="ul"
          sx={{
            margin: 0,
            paddingLeft: 2,
            '& li': {
              marginBottom: 0.5,
              fontSize: '0.875rem',
              color: theme.palette.info.dark,
              lineHeight: 1.5,
            },
            '& li:last-child': {
              marginBottom: 0,
            },
          }}
        >
          <li>Your contact request will be submitted to dealerships matching your selected vehicles</li>
          <li>You'll receive a confirmation email within the next 30 minutes</li>
          <li>Dealerships will contact you via your preferred contact method</li>
        </Box>
      </Alert>
    </Container>
  );
};

export default ContactRequestPage;
