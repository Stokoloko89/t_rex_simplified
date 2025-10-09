import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Divider
} from '@mui/material';
import { Button } from '@t-rex/shared-ui';
import { DriveEta, Sell } from '@mui/icons-material';

interface IntentSelectionProps {
  initialData: { message: string };
  onSubmit: (data: { intent: 'buying' | 'selling' }) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const IntentSelection: React.FC<IntentSelectionProps> = ({ 
  initialData, 
  onSubmit, 
  onBack,
  isLoading 
}) => {
  const [selectedIntent, setSelectedIntent] = useState<'buying' | 'selling' | null>(null);

  const handleSubmit = () => {
    if (selectedIntent) {
      onSubmit({ intent: selectedIntent });
    }
  };

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
          {initialData.message || 'What would you like to do today?'}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 3, fontSize: '1rem', lineHeight: 1.6 }}
        >
          Choose your intent to get started with the right flow
        </Typography>
        <Divider />
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              border: selectedIntent === 'buying' ? '2px solid #007AFF' : '1px solid #e0e0e0',
              boxShadow: selectedIntent === 'buying'
                ? '0 8px 24px rgba(0, 122, 255, 0.15)'
                : '0 2px 8px rgba(0, 0, 0, 0.08)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => setSelectedIntent('buying')}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <DriveEta 
                sx={{ 
                  fontSize: 56, 
                  color: selectedIntent === 'buying' ? '#007AFF' : '#666',
                  mb: 2
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1.5,
                  color: '#1a1a1a'
                }}
              >
                Buying a Vehicle
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Find and purchase your next vehicle with our guided process
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              height: '100%',
              transition: 'all 0.2s ease-in-out',
              border: selectedIntent === 'selling' ? '2px solid #007AFF' : '1px solid #e0e0e0',
              boxShadow: selectedIntent === 'selling'
                ? '0 8px 24px rgba(0, 122, 255, 0.15)'
                : '0 2px 8px rgba(0, 0, 0, 0.08)',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                transform: 'translateY(-4px)',
              },
            }}
            onClick={() => setSelectedIntent('selling')}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Sell 
                sx={{ 
                  fontSize: 56, 
                  color: selectedIntent === 'selling' ? '#007AFF' : '#666',
                  mb: 2
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1.5,
                  color: '#1a1a1a'
                }}
              >
                Selling a Vehicle
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Get the best value for your current vehicle with our selling process
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ 
        pt: 4,
        borderTop: '1px solid #e0e0e0',
        display: 'flex', 
        justifyContent: 'flex-end'
      }}>
        <Button
          onClick={handleSubmit}
          disabled={!selectedIntent || isLoading}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 122, 255, 0.25)'
            }
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default IntentSelection;
