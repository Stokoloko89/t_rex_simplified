import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Alert } from '@mui/material';
import { CheckCircle, Refresh, ThumbUp } from '@mui/icons-material';

interface NoAssistanceNeededProps {
  initialData?: any;
  onSubmit?: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const NoAssistanceNeeded: React.FC<NoAssistanceNeededProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const message = initialData?.message || "You're all set!";
  const description = initialData?.description || "It looks like you have everything under control with your vehicle sale.";
  const nextSteps = initialData?.nextSteps || "Feel free to return anytime if you need assistance with future vehicle transactions.";

  const handleStartNew = () => {
    // Restart the workflow
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <ThumbUp sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom color="success.main">
          {message}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </Box>

      <Stack spacing={3}>
        <Alert severity="info" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            No worries!
          </Typography>
          <Typography variant="body2">
            {nextSteps}
          </Typography>
        </Alert>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              We're Here When You Need Us
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Future Vehicle Purchases
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    When you're ready to buy your next vehicle, we'll be here to help
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Market Updates
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Stay informed about vehicle market trends and opportunities
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Expert Advice
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get professional guidance whenever you need it
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Need Help Later?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              If your situation changes or you need assistance with vehicle transactions, we're just a click away.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" size="small">
                Contact Support
              </Button>
              <Button variant="outlined" size="small">
                Browse Inventory
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

export default NoAssistanceNeeded;
