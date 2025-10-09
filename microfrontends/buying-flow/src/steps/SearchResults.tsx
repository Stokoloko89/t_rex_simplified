import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, Grid, Chip, Divider, CardMedia } from '@mui/material';
import { LocalGasStation, Speed, LocationOn } from '@mui/icons-material';
import { formatCurrency, formatFuelConsumption, formatDistance } from '@t-rex/shared-ui';

interface SearchResultsProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  // Mock South African vehicle data - in real app this would come from initialData
  const vehicles = [
    {
      id: 'vehicle-1',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 485000, // ZAR
      fuelConsumption: 6.8, // L/100km
      mileage: 15000, // km
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200&auto=format&fit=crop',
      location: 'Cape Town, Western Cape',
      features: ['Hybrid Available', 'Toyota Safety Sense', 'Apple CarPlay']
    },
    {
      id: 'vehicle-2',
      make: 'Honda',
      model: 'Accord',
      year: 2023,
      price: 462000, // ZAR
      fuelConsumption: 7.2, // L/100km
      mileage: 22000, // km
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=1200&auto=format&fit=crop',
      location: 'Johannesburg, Gauteng',
      features: ['Honda Sensing', 'Wireless Charging', 'LED Headlights']
    },
    {
      id: 'vehicle-3',
      make: 'Nissan',
      model: 'Altima',
      year: 2023,
      price: 440000, // ZAR
      fuelConsumption: 7.8, // L/100km
      mileage: 18500, // km
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
      location: 'Durban, KwaZulu-Natal',
      features: ['ProPILOT Assist', 'Remote Start', 'Bose Audio']
    }
  ];

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  const handleSubmit = () => {
    const selected = vehicles.find(v => v.id === selectedVehicle);
    onSubmit({ 
      selectedVehicle: selected,
      vehicleId: selectedVehicle 
    });
  };

  const message = initialData?.message || "Here are vehicles matching your criteria";
  const total = initialData?.results?.total || vehicles.length;

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      py: 6,
      px: 3
    }}>
      {/* Header Section */}
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
          Vehicle Search Results
        </Typography>
        
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 3,
            fontSize: '1rem',
            lineHeight: 1.6
          }}
        >
          {message} • {total} vehicles found in South Africa
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
      </Box>

      {/* Vehicle Grid */}
      <Grid container spacing={4}>
        {vehicles.map((vehicle) => (
          <Grid item xs={12} md={6} key={vehicle.id}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease-in-out',
                border: selectedVehicle === vehicle.id 
                  ? '2px solid #007AFF' 
                  : '1px solid #e0e0e0',
                boxShadow: selectedVehicle === vehicle.id
                  ? '0 8px 24px rgba(0, 122, 255, 0.15)'
                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-4px)',
                }
              }}
              onClick={() => handleVehicleSelect(vehicle.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={vehicle.image}
                alt={`${vehicle.make} ${vehicle.model}`}
                sx={{ 
                  objectFit: 'cover',
                  borderBottom: '1px solid #e0e0e0'
                }}
              />
              
              <CardContent sx={{ 
                p: 3, 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Vehicle Title */}
                <Typography 
                  variant="h6" 
                  component="h3" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 0.5,
                    color: '#1a1a1a',
                    fontSize: '1.125rem'
                  }}
                >
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </Typography>
                
                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {vehicle.location}
                  </Typography>
                </Box>
                
                {/* Price */}
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#007AFF',
                    mb: 3,
                    fontSize: '1.75rem'
                  }}
                >
                  {formatCurrency(vehicle.price)}
                </Typography>

                {/* Specs */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3,
                  mb: 3,
                  pb: 3,
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <LocalGasStation sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      {formatFuelConsumption(vehicle.fuelConsumption)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <Speed sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      {formatDistance(vehicle.mileage)}
                    </Typography>
                  </Box>
                </Box>

                {/* Features */}
                <Box sx={{ mt: 'auto' }}>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'block',
                      mb: 1,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontWeight: 600
                    }}
                  >
                    Key Features
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {vehicle.features.map((feature, index) => (
                      <Chip 
                        key={index}
                        label={feature} 
                        size="small" 
                        sx={{
                          backgroundColor: '#f5f5f5',
                          border: 'none',
                          fontSize: '0.75rem',
                          height: '24px',
                          '& .MuiChip-label': {
                            px: 1.5
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ 
        mt: 6, 
        pt: 4,
        borderTop: '1px solid #e0e0e0',
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {onBack && (
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
        )}
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isLoading || !selectedVehicle}
          sx={{ 
            ml: 'auto',
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
          Continue with Selected Vehicle
        </Button>
      </Box>
    </Box>
  );
};

export default SearchResults;
