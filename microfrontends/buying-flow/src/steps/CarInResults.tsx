import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Grid, Chip, Alert, CardMedia } from '@mui/material';
import { Psychology, TrendingUp, DirectionsCar, Star, LocalGasStation } from '@mui/icons-material';
import { formatCurrency, formatFuelConsumption } from '@t-rex/shared-ui';

interface CarInResultsProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const CarInResults: React.FC<CarInResultsProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Mock CarIn recommendation data
  const recommendations = {
    primary: {
      id: 'rec-1',
      make: 'Toyota',
      model: 'Camry Hybrid',
      year: 2023,
      price: 462000,
      fuelConsumption: 4.5,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1549399292-d3c5a8c2b5a0?w=400&h=300&fit=crop&auto=format',
      matchScore: 95,
      reasons: ['Excellent fuel efficiency', 'High reliability rating', 'Spacious interior', 'Advanced safety features']
    },
    alternatives: [
      {
        id: 'rec-2',
        make: 'Honda',
        model: 'Accord Hybrid',
        year: 2023,
        price: 485000,
        fuelConsumption: 5.2,
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&auto=format',
        matchScore: 88,
        reasons: ['Premium interior', 'Smooth ride quality', 'Honda Sensing standard']
      },
      {
        id: 'rec-3',
        make: 'Nissan',
        model: 'Altima',
        year: 2023,
        price: 398000,
        fuelConsumption: 6.8,
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&auto=format',
        matchScore: 82,
        reasons: ['Great value', 'Comfortable seating', 'User-friendly technology']
      }
    ]
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  const handleSubmit = () => {
    const allVehicles = [recommendations.primary, ...recommendations.alternatives];
    const selected = allVehicles.find(v => v.id === selectedVehicle);
    onSubmit({ 
      selectedVehicle: selected,
      vehicleId: selectedVehicle,
      source: 'carin_analytics'
    });
  };

  const message = initialData?.message || "Based on your preferences, here are our recommendations";

  const VehicleCard = ({ vehicle, isPrimary = false }: { vehicle: any, isPrimary?: boolean }) => (
    <Card 
      sx={{ 
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: selectedVehicle === vehicle.id ? 2 : 1,
        borderColor: selectedVehicle === vehicle.id ? 'primary.main' : 'divider',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        }
      }}
      onClick={() => handleVehicleSelect(vehicle.id)}
    >
      {isPrimary && (
        <Chip 
          label="Best Match" 
          color="primary" 
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12, 
            zIndex: 1,
            fontWeight: 600
          }} 
        />
      )}
      
      <CardMedia
        component="img"
        height="200"
        image={vehicle.image}
        alt={`${vehicle.make} ${vehicle.model}`}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Typography>
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700, mb: 1 }}>
            {formatCurrency(vehicle.price)}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1, color: 'success.main', fontSize: 20 }} />
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
              {vehicle.matchScore}% Match
            </Typography>
          </Box>
        </Box>

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalGasStation sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
              <Typography variant="body2">{formatFuelConsumption(vehicle.fuelConsumption)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ mr: 0.5, fontSize: 20, color: 'warning.main' }} />
              <Typography variant="body2">{vehicle.rating}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Why this matches you:
            </Typography>
            <Stack spacing={0.5}>
              {vehicle.reasons.map((reason: string, index: number) => (
                <Typography key={index} variant="body2" sx={{ fontSize: '0.875rem' }}>
                  • {reason}
                </Typography>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Psychology sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Your Personalized Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          These recommendations are based on your preferences for usage, passenger capacity, budget, and desired features.
        </Typography>
      </Alert>

      <Stack spacing={4}>
        {/* Primary Recommendation */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
            Top Recommendation
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <VehicleCard vehicle={recommendations.primary} isPrimary />
            </Grid>
          </Grid>
        </Box>

        {/* Alternative Recommendations */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Alternative Options
          </Typography>
          <Grid container spacing={3}>
            {recommendations.alternatives.map((vehicle) => (
              <Grid item xs={12} md={6} key={vehicle.id}>
                <VehicleCard vehicle={vehicle} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Stack>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        {onBack && (
          <Button 
            variant="outlined" 
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
        )}
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isLoading || !selectedVehicle}
          sx={{ ml: 'auto' }}
        >
          Continue with Selected Vehicle
        </Button>
      </Box>
    </Box>
  );
};

export default CarInResults;
