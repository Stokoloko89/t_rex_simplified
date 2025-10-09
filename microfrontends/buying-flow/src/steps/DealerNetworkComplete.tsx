import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Alert, Chip } from '@mui/material';
import { Business, Schedule, Phone, Email, Refresh, TrendingUp } from '@mui/icons-material';

interface DealerNetworkCompleteProps {
  initialData?: any;
  onSubmit?: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const DealerNetworkComplete: React.FC<DealerNetworkCompleteProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const message = initialData?.message || "Thank you for your submission!";
  const description = initialData?.description || "We'll connect you with dealers in our network who are interested in your vehicle type.";
  const nextSteps = initialData?.nextSteps || "Our dealer network team will review your vehicle information and match you with interested buyers within 48 hours.";

  const handleStartNew = () => {
    // Restart the workflow
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Business sx={{ fontSize: 72, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom color="secondary.main">
          {message}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Chip 
          label="Dealer Network Request Submitted" 
          color="secondary"
          variant="outlined"
          size="small"
        />
      </Box>

      <Stack spacing={3}>
        <Alert severity="info" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Dealer Matching in Progress
          </Typography>
          <Typography variant="body2">
            {nextSteps}
          </Typography>
        </Alert>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              How Our Dealer Network Works
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 2, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Market Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We analyze current market demand for your vehicle type
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Business sx={{ mr: 2, color: 'secondary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Dealer Matching
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect with dealers actively seeking your vehicle type
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 2, color: 'secondary.main' }} />
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
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              What to Expect Next
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                • <strong>Within 24 hours:</strong> Initial dealer interest notifications
              </Typography>
              <Typography variant="body2">
                • <strong>Within 48 hours:</strong> Detailed offers from interested dealers
              </Typography>
              <Typography variant="body2">
                • <strong>Ongoing support:</strong> Our team will help you evaluate and negotiate offers
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Questions About the Process?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Our dealer network specialists are available to answer any questions about the matching process.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" size="small">
                Call Dealer Network
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

export default DealerNetworkComplete;
