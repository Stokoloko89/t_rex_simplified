import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Alert, Chip } from '@mui/material';
import { CheckCircle, Schedule, Phone, Email, Refresh } from '@mui/icons-material';

interface SellingCompleteProps {
  initialData?: any;
  onSubmit?: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const SellingComplete: React.FC<SellingCompleteProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const message = initialData?.message || "Thank you! Your selling request has been processed.";
  const nextSteps = initialData?.nextSteps || "We'll be in touch with updates on your sale.";
  const leadId = initialData?.leadId || `SELL-${Date.now()}`;

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
              Next Steps for Your Sale
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Market Analysis (Within 24 hours)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We'll analyze current market conditions for your vehicle
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Dealer Network Matching
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect with dealers interested in your vehicle type
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Competitive Offers
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive multiple offers to ensure you get the best price
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
              If you have any questions about the selling process, we're here to help.
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
            Start New Request
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default SellingComplete;
