import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button as MuiButton,
} from '@mui/material';
import { Button } from '@t-rex/shared-ui';
import { Search } from '@mui/icons-material';

interface VehicleSearchProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
}) => {
  const [searchData, setSearchData] = useState({
    make: '',
    model: '',
    yearRange: [2015, 2024],
    priceRange: [10000, 50000],
    mileageMax: 100000,
    bodyType: '',
    fuelType: '',
  });

  const handleSubmit = () => {
    onSubmit({
      ...initialData,
      vehicleSearch: searchData,
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardContent>
        <Box textAlign="center" mb={4}>
          <Search sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Find Your Perfect Vehicle
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tell us what you're looking for and we'll help you find it
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Make"
              value={searchData.make}
              onChange={(e) => handleInputChange('make', e.target.value)}
              placeholder="e.g., Toyota, Honda, Ford"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Model"
              value={searchData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              placeholder="e.g., Camry, Civic, F-150"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Body Type</InputLabel>
              <Select
                value={searchData.bodyType}
                label="Body Type"
                onChange={(e) => handleInputChange('bodyType', e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="sedan">Sedan</MenuItem>
                <MenuItem value="suv">SUV</MenuItem>
                <MenuItem value="truck">Truck</MenuItem>
                <MenuItem value="coupe">Coupe</MenuItem>
                <MenuItem value="hatchback">Hatchback</MenuItem>
                <MenuItem value="convertible">Convertible</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Fuel Type</InputLabel>
              <Select
                value={searchData.fuelType}
                label="Fuel Type"
                onChange={(e) => handleInputChange('fuelType', e.target.value)}
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="gasoline">Gasoline</MenuItem>
                <MenuItem value="hybrid">Hybrid</MenuItem>
                <MenuItem value="electric">Electric</MenuItem>
                <MenuItem value="diesel">Diesel</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Year Range: {searchData.yearRange[0]} - {searchData.yearRange[1]}
            </Typography>
            <Slider
              value={searchData.yearRange}
              onChange={(_, newValue) => handleInputChange('yearRange', newValue)}
              valueLabelDisplay="auto"
              min={2000}
              max={2024}
              marks={[
                { value: 2000, label: '2000' },
                { value: 2024, label: '2024' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Price Range: ${searchData.priceRange[0].toLocaleString()} - ${searchData.priceRange[1].toLocaleString()}
            </Typography>
            <Slider
              value={searchData.priceRange}
              onChange={(_, newValue) => handleInputChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={5000}
              max={100000}
              step={1000}
              marks={[
                { value: 5000, label: '$5K' },
                { value: 100000, label: '$100K' },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Maximum Mileage: {searchData.mileageMax.toLocaleString()} miles
            </Typography>
            <Slider
              value={searchData.mileageMax}
              onChange={(_, newValue) => handleInputChange('mileageMax', newValue)}
              valueLabelDisplay="auto"
              min={10000}
              max={200000}
              step={5000}
              marks={[
                { value: 10000, label: '10K' },
                { value: 200000, label: '200K' },
              ]}
            />
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
            Search Vehicles
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleSearch;
