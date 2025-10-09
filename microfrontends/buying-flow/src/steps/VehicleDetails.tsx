import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  Chip,
  Button as MuiButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Button } from '@t-rex/shared-ui';
import { DirectionsCar, Speed, LocalGasStation, Palette } from '@mui/icons-material';

interface VehicleDetailsProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

// Mock vehicle data
const mockVehicle = {
  id: 'v123',
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  price: 28500,
  mileage: 15000,
  color: 'Silver',
  fuelType: 'Gasoline',
  transmission: 'Automatic',
  engine: '2.5L 4-Cylinder',
  mpg: '28 city / 39 highway',
  features: [
    'Backup Camera',
    'Bluetooth Connectivity',
    'Apple CarPlay',
    'Android Auto',
    'Lane Departure Warning',
    'Adaptive Cruise Control',
    'Heated Seats',
    'Sunroof',
  ],
  images: [
    'https://via.placeholder.com/400x300/0066cc/ffffff?text=Toyota+Camry+Front',
    'https://via.placeholder.com/400x300/0066cc/ffffff?text=Toyota+Camry+Side',
    'https://via.placeholder.com/400x300/0066cc/ffffff?text=Toyota+Camry+Interior',
  ],
};

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
}) => {
  const [selectedVehicle] = useState(mockVehicle);

  const handleSubmit = () => {
    onSubmit({
      ...initialData,
      selectedVehicle,
    });
  };

  return (
    <Card>
      <CardContent>
        <Box textAlign="center" mb={4}>
          <DirectionsCar sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Vehicle Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Review the details of your selected vehicle
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <img
                src={selectedVehicle.images[0]}
                alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                style={{ width: '100%', borderRadius: 8 }}
              />
            </Paper>
            <Grid container spacing={1}>
              {selectedVehicle.images.slice(1).map((image, index) => (
                <Grid item xs={6} key={index}>
                  <img
                    src={image}
                    alt={`${selectedVehicle.make} ${selectedVehicle.model} ${index + 2}`}
                    style={{ width: '100%', borderRadius: 4 }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              ${selectedVehicle.price.toLocaleString()}
            </Typography>

            <Box display="flex" gap={1} mb={3} flexWrap="wrap">
              <Chip 
                icon={<Speed />} 
                label={`${selectedVehicle.mileage.toLocaleString()} miles`} 
                variant="outlined" 
              />
              <Chip 
                icon={<LocalGasStation />} 
                label={selectedVehicle.fuelType} 
                variant="outlined" 
              />
              <Chip 
                icon={<Palette />} 
                label={selectedVehicle.color} 
                variant="outlined" 
              />
            </Box>

            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Engine" 
                  secondary={selectedVehicle.engine} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Transmission" 
                  secondary={selectedVehicle.transmission} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Fuel Economy" 
                  secondary={selectedVehicle.mpg} 
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Features
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {selectedVehicle.features.map((feature, index) => (
                <Chip 
                  key={index} 
                  label={feature} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" mt={4}>
          {onBack && (
            <MuiButton variant="outlined" onClick={onBack}>
              Back
            </MuiButton>
          )}
          <Box flex={1} />
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            loading={isLoading}
          >
            Continue with This Vehicle
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleDetails;
