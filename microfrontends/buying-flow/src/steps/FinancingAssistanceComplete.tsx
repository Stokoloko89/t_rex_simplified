import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Alert, Chip, Avatar, Divider } from '@mui/material';
import { AccountBalance, Schedule, Phone, Email, Refresh, CelebrationOutlined, TrendingUp, Security } from '@mui/icons-material';

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
  const description = initialData?.description || "One of our Financial & Insurance (F&I) representatives will be in touch regarding financing assistance for your buyer.";
  const nextSteps = initialData?.nextSteps || "Our F&I team will contact you within 24 hours to discuss financing options and next steps.";

  const handleStartNew = () => {
    // Restart the workflow
    window.location.reload();
  };

  return (
    <Box sx={{ 
      maxWidth: 700, 
      mx: 'auto', 
      p: 4,
      background: 'linear-gradient(135deg, rgba(255,107,53,0.03) 0%, rgba(76,175,80,0.03) 100%)',
      borderRadius: 3,
      minHeight: '80vh'
    }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Avatar sx={{ 
          width: 100, 
          height: 100, 
          mx: 'auto', 
          mb: 3,
          background: 'linear-gradient(135deg, #FF6B35 0%, #4CAF50 100%)',
          boxShadow: '0 12px 32px rgba(255,107,53,0.3)'
        }}>
          <CelebrationOutlined sx={{ fontSize: 50, color: 'white' }} />
        </Avatar>
        
        <Typography variant="h2" component="h1" gutterBottom sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #FF6B35 0%, #4CAF50 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2
        }}>
          {message}
        </Typography>
        
        <Typography variant="h5" color="text.primary" sx={{ 
          mb: 3, 
          fontWeight: 500,
          maxWidth: 500,
          mx: 'auto'
        }}>
          {description}
        </Typography>
        
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <Chip 
            label="🏦 F&I Request Submitted" 
            color="primary"
            sx={{ 
              fontWeight: 600,
              fontSize: '1rem',
              px: 2,
              py: 1,
              height: 'auto'
            }}
          />
          <Chip 
            label="💰 ZAR Currency Support" 
            color="secondary"
            sx={{ 
              fontWeight: 600,
              fontSize: '1rem',
              px: 2,
              py: 1,
              height: 'auto'
            }}
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

        <Card sx={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,107,53,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ 
              mb: 3, 
              fontWeight: 700,
              color: 'primary.main',
              textAlign: 'center'
            }}>
              🇿🇦 What Our South African F&I Team Will Help With
            </Typography>
            
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, background: 'rgba(255,107,53,0.05)' }}>
                <Avatar sx={{ mr: 3, background: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)' }}>
                  <TrendingUp sx={{ color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    ZAR Financing Options Review
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Explore the best South African Rand financing solutions tailored for your buyer's situation
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, background: 'rgba(76,175,80,0.05)' }}>
                <Avatar sx={{ mr: 3, background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)' }}>
                  <AccountBalance sx={{ color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                    SA Bank Network Access
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Connect with our network of trusted South African banks and lending institutions
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, background: 'rgba(33,150,243,0.05)' }}>
                <Avatar sx={{ mr: 3, background: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)' }}>
                  <Security sx={{ color: 'white' }} />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                    Local Documentation Support
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Assistance with South African vehicle finance paperwork and FICA compliance
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
