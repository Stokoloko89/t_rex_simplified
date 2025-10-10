import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Alert, Chip } from '@mui/material';
import { AccountBalance, Schedule, Phone, Email, Refresh, CheckCircle, TrendingUp, Security } from '@mui/icons-material';

interface FinancingAssistanceCompleteProps {
  initialData?: any;
  onSubmit?: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const FinancingAssistanceComplete: React.FC<FinancingAssistanceCompleteProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const message = initialData?.message || "Thank you for your request!";
  const description = initialData?.description || "One of our F&I representatives will be in touch regarding financing assistance for your buyer.";
  const nextSteps = initialData?.nextSteps || "Our F&I team will contact you within 24 hours to discuss financing options and next steps.";
  const assistanceType = initialData?.assistanceType || "financing";

  const handleStartNew = () => {
    // Restart the workflow
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircle sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom color="success.main">
          Request Submitted!
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Chip 
            label="F&I Request Submitted" 
            color="primary"
            variant="outlined"
          />
        </Stack>
      </Box>

      <Stack spacing={3}>
        <Alert severity="success" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Financing Assistance Request Received
          </Typography>
          <Typography variant="body2">
            {nextSteps}
          </Typography>
        </Alert>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              What Our F&I Team Will Help With
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                   Financing Options Review
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Explore the best financing solutions tailored for your buyer's situation
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalance sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    SA Bank Network Access
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Connect with our network of trusted banks and lending institutions
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Local Documentation Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Assistance with vehicle finance paperwork and FICA compliance
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Questions About Financing?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              If you have immediate questions about the financing process, our support team is available.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="outlined" size="small">
                Call F&I Support
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

export default FinancingAssistanceComplete;
