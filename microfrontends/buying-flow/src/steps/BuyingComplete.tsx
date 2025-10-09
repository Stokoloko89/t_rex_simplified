import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Alert, Chip } from '@mui/material';
import { CheckCircle, Schedule, Phone, Email, Refresh } from '@mui/icons-material';

interface BuyingCompleteProps {
  initialData?: any;
  onSubmit?: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const BuyingComplete: React.FC<BuyingCompleteProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const message = initialData?.message || "Thank you! Your request has been submitted successfully.";
  const nextSteps = initialData?.nextSteps || "A dealer will contact you within 24 hours.";
  const leadId = initialData?.leadId || `LEAD-${Date.now()}`;

  const handleStartNew = () => {
    // Restart the workflow
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom color="success.main">
          Success!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {message}
        </Typography>
        <Chip 
          label={`Reference: ${leadId}`} 
          variant="outlined" 
          size="small"
          sx={{ fontFamily: 'monospace' }}
        />
      </Box>

      <Stack spacing={3}>
        <Alert severity="success" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            What happens next?
          </Typography>
          <Typography variant="body2">
            {nextSteps}
          </Typography>
        </Alert>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Next Steps
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Dealer Contact (Within 24 hours)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A certified dealer will reach out to discuss your vehicle interest
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Vehicle Availability Check
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We'll verify current inventory and pricing for your selected vehicle
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Personalized Quote
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive a detailed quote including financing options and trade-in value
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              If you have any questions or need immediate assistance, feel free to contact us.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" size="small">
                Call Support
              </Button>
              <Button variant="outlined" size="small">
                Live Chat
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', pt: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleStartNew}
            startIcon={<Refresh />}
            size="large"
          >
            Start New Search
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default BuyingComplete;
