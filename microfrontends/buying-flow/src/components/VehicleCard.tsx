import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, Avatar } from '@mui/material';
import { DirectionsCar, LocalGasStation, Speed, Engineering } from '@mui/icons-material';
import { formatCurrency, formatDistance, formatFuelConsumption, formatPower } from '@t-rex/shared-ui';

interface VehicleCardProps {
  vehicle: {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number; // in kilometers
    fuelConsumption: number; // L/100km
    power: number; // in kW
    location: string;
    image?: string;
  };
  onClick?: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onClick }) => {
  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,107,53,0.1)',
        '&:hover': onClick ? {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(255,107,53,0.15)',
          border: '1px solid #FF6B35',
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h5" component="h3" sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              mb: 0.5
            }}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              📍 {vehicle.location}
            </Typography>
          </Box>
          
          <Avatar sx={{ 
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8A65 100%)',
            width: 48,
            height: 48
          }}>
            <DirectionsCar sx={{ color: 'white' }} />
          </Avatar>
        </Box>

        <Typography variant="h4" sx={{ 
          fontWeight: 800,
          color: 'secondary.main',
          mb: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {formatCurrency(vehicle.price)}
        </Typography>

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Speed sx={{ mr: 1, color: 'info.main', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Mileage
              </Typography>
            </Box>
            <Chip 
              label={formatDistance(vehicle.mileage)} 
              size="small" 
              color="info"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalGasStation sx={{ mr: 1, color: 'warning.main', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Fuel Economy
              </Typography>
            </Box>
            <Chip 
              label={formatFuelConsumption(vehicle.fuelConsumption)} 
              size="small" 
              color="warning"
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Engineering sx={{ mr: 1, color: 'error.main', fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                Power
              </Typography>
            </Box>
            <Chip 
              label={formatPower(vehicle.power)} 
              size="small" 
              color="error"
              variant="outlined"
            />
          </Box>
        </Stack>

        <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="🇿🇦 ZAR Pricing" 
            size="small" 
            color="primary"
            sx={{ fontWeight: 600 }}
          />
          <Chip 
            label="📏 Metric System" 
            size="small" 
            color="secondary"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
