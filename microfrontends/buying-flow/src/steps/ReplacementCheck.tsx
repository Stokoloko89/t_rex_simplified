import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Divider } from '@mui/material';
import { DirectionsCar, CheckCircle } from '@mui/icons-material';

interface ReplacementCheckProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const ReplacementCheck: React.FC<ReplacementCheckProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const handleSelection = (choice: string) => {
    // Pass through the context from initialData to preserve user assistance needs
    const context = initialData?.context;
    const submissionData: any = { replacement: choice };
    
    if (context) {
      submissionData.context = context;
    }
    
    onSubmit(submissionData);
  };

  const message = initialData?.message || "Do you need a replacement vehicle?";

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 6, px: 3 }}>
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: '#1a1a1a',
            mb: 1.5,
            letterSpacing: '-0.02em'
          }}
        >
          Replacement Vehicle
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 3, fontSize: '1rem', lineHeight: 1.6 }}
        >
          {message}
        </Typography>
        <Divider />
      </Box>

      <Stack spacing={3} sx={{ mb: 6 }}>
        <Card 
          sx={{ 
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-4px)',
            }
          }}
          onClick={() => handleSelection('wants_replacement')}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <DirectionsCar sx={{ mr: 3, fontSize: 40, color: '#007AFF' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>
                Yes, help me find a replacement
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                I need another vehicle and would like help finding one
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-4px)',
            }
          }}
          onClick={() => handleSelection('no_replacement')}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <CheckCircle sx={{ mr: 3, fontSize: 40, color: '#007AFF' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>
                No, I don't need a replacement
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                I'm all set and don't need another vehicle at this time
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {onBack && (
        <Box sx={{ 
          pt: 4,
          borderTop: '1px solid #e0e0e0',
          display: 'flex', 
          justifyContent: 'center'
        }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            disabled={isLoading}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1.25,
              borderColor: '#d0d0d0',
              color: '#666',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            Back
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ReplacementCheck;
