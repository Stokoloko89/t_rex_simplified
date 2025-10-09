import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import { Person, Business } from '@mui/icons-material';

interface BuyerTypeProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const BuyerType: React.FC<BuyerTypeProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const handleSelection = (choice: string) => {
    onSubmit({ buyer_type: choice });
  };

  const message = initialData?.message || "What type of buyer do you have?";

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Buyer Information
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, textAlign: 'center', color: 'text.secondary' }}>
        {message}
      </Typography>

      <Stack spacing={3}>
        <Card 
          sx={{ 
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3,
            }
          }}
          onClick={() => handleSelection('private')}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Person sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
            <Box>
              <Typography variant="h6" component="h3">
                Private individual
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Selling to a private party or individual buyer
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card 
          sx={{ 
            cursor: 'pointer',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3,
            }
          }}
          onClick={() => handleSelection('dealer')}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
            <Business sx={{ mr: 2, fontSize: 32, color: 'secondary.main' }} />
            <Box>
              <Typography variant="h6" component="h3">
                Dealer/Trade-in
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Trading in at a dealership or selling to a dealer
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {onBack && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="outlined" 
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default BuyerType;
