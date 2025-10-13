import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Divider } from '@mui/material';
import { Person, Search } from '@mui/icons-material';

interface HasBuyerProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const HasBuyer: React.FC<HasBuyerProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const handleSelection = (choice: string) => {
    console.log('HasBuyer - User selected:', choice);
    const submissionData = { has_buyer: choice };
    console.log('HasBuyer - Submitting data:', submissionData);
    onSubmit(submissionData);
  };

  const message = initialData?.message || "Do you already have a buyer for your vehicle?";

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
          Selling Your Vehicle
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
          onClick={() => handleSelection('has_buyer')}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <Person sx={{ mr: 3, fontSize: 40, color: '#007AFF' }} />
            <Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>
                Yes, I have a buyer
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                I already have someone interested in purchasing my vehicle
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
          onClick={() => handleSelection('no_buyer')}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <Search sx={{ mr: 3, fontSize: 40, color: '#007AFF' }} />
            <Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>
                No, I need help finding a buyer
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                I'd like assistance connecting with potential buyers through our dealer network
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

export default HasBuyer;
