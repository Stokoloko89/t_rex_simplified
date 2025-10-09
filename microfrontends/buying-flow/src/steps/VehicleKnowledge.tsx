import React from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Divider } from '@mui/material';
import { DirectionsCar, Help } from '@mui/icons-material';

interface VehicleKnowledgeProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const VehicleKnowledge: React.FC<VehicleKnowledgeProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const handleSelection = (choice: string) => {
    onSubmit({ vehicle_knowledge: choice });
  };

  const message = initialData?.message || "Do you already know which vehicle you want to buy?";
  const context = initialData?.context;

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
          {context === 'replacement_vehicle' ? 'Replacement Vehicle' : 'Vehicle Knowledge'}
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
          onClick={() => handleSelection('knows_vehicle')}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <DirectionsCar sx={{ mr: 3, fontSize: 40, color: '#007AFF' }} />
            <Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>
                Yes, I know what I want
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                I have a specific vehicle in mind and want to search for it
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
          onClick={() => handleSelection('needs_help')}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', p: 4 }}>
            <Help sx={{ mr: 3, fontSize: 40, color: '#007AFF' }} />
            <Box>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>
                No, I need help choosing
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                I'd like personalized recommendations based on my needs
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

export default VehicleKnowledge;
