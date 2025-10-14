import React, { useState, useEffect } from 'react';
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
    yearRange: [2015, 2025],
    priceRange: [100000, 2000000],
    mileageMax: 200000,
    bodyType: '',
    fuelType: '',
    province: '',
  });

  const [filters, setFilters] = useState({
    makes: [],
    models: [],
    provinces: [],
    fuelTypes: [],
    bodyTypes: [],
    transmissions: [],
    priceRange: { min: 0, max: 2000000 },
    yearRange: { min: 2000, max: 2025 }
  });

  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Load filters on component mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/vehicles/filters');
        const filtersData = await response.json();
        
        setFilters({
          makes: filtersData.makes || [],
          models: [],
          provinces: filtersData.provinces || [],
          fuelTypes: filtersData.fuelTypes || [],
          bodyTypes: filtersData.bodyTypes || [],
          transmissions: filtersData.transmissions || [],
          priceRange: filtersData.priceRange || { min: 0, max: 2000000 },
          yearRange: filtersData.yearRange || { min: 2000, max: 2025 }
        });
        
        // Update search data with actual ranges
        if (filtersData.priceRange) {
          setSearchData(prev => ({
            ...prev,
            priceRange: [filtersData.priceRange.min, filtersData.priceRange.max]
          }));
        }
        
        if (filtersData.yearRange) {
          setSearchData(prev => ({
            ...prev,
            yearRange: [filtersData.yearRange.min, filtersData.yearRange.max]
          }));
        }
        
      } catch (error) {
        console.error('Error loading filters:', error);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    loadFilters();
  }, []);

  // Load models when make changes
  useEffect(() => {
    if (searchData.make) {
      const loadModels = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/vehicles/makes/${searchData.make}/models`);
          const models = await response.json();
          setFilters(prev => ({
            ...prev,
            models: models || []
          }));
        } catch (error) {
          console.error('Error loading models:', error);
        }
      };
      loadModels();
    } else {
      setFilters(prev => ({
        ...prev,
        models: []
      }));
      setSearchData(prev => ({
        ...prev,
        model: ''
      }));
    }
  }, [searchData.make]);

  // Load filtered options when make or model changes
  useEffect(() => {
    const loadFilteredOptions = async () => {
      if (searchData.make || searchData.model) {
        try {
          const params = new URLSearchParams();
          if (searchData.make) params.append('make', searchData.make);
          if (searchData.model) params.append('model', searchData.model);

          // Load filtered options in parallel
          const [bodyTypesRes, fuelTypesRes, provincesRes] = await Promise.all([
            fetch(`http://localhost:8080/api/vehicles/filtered/body-types?${params}`),
            fetch(`http://localhost:8080/api/vehicles/filtered/fuel-types?${params}`),
            fetch(`http://localhost:8080/api/vehicles/filtered/provinces?${params}`)
          ]);

          const [bodyTypes, fuelTypes, provinces] = await Promise.all([
            bodyTypesRes.json(),
            fuelTypesRes.json(),
            provincesRes.json()
          ]);

          setFilters(prev => ({
            ...prev,
            bodyTypes: bodyTypes || [],
            fuelTypes: fuelTypes || [],
            provinces: provinces || []
          }));

          // Clear selections that are no longer valid
          setSearchData(prev => {
            const newData = { ...prev };
            if (prev.bodyType && !bodyTypes.includes(prev.bodyType)) {
              newData.bodyType = '';
            }
            if (prev.fuelType && !fuelTypes.includes(prev.fuelType)) {
              newData.fuelType = '';
            }
            if (prev.province && !provinces.includes(prev.province)) {
              newData.province = '';
            }
            return newData;
          });

        } catch (error) {
          console.error('Error loading filtered options:', error);
        }
      }
    };

    loadFilteredOptions();
  }, [searchData.make, searchData.model]);

  const handleSubmit = () => {
    console.log('VehicleSearch handleSubmit called with searchData:', searchData);
    const submissionData = {
      nextStep: 'SearchResults',
      stepId: 'search-results',
      componentName: 'SearchResults',
      action: 'vehicle-search',
      intent: 'search-vehicles',
      ...initialData,
      vehicleSearch: searchData,
    };
    console.log('VehicleSearch submitting:', submissionData);
    onSubmit(submissionData);
  };

  const handleInputChange = (field: string, value: any) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardContent sx={{ pr: 4 }}>
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
            <FormControl fullWidth>
              <InputLabel>Make</InputLabel>
              <Select
                value={searchData.make}
                label="Make"
                onChange={(e) => handleInputChange('make', e.target.value)}
                disabled={isLoadingFilters}
              >
                <MenuItem value="">Any Make</MenuItem>
                {filters.makes.map((make) => (
                  <MenuItem key={make} value={make}>
                    {make}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Model</InputLabel>
              <Select
                value={searchData.model}
                label="Model"
                onChange={(e) => handleInputChange('model', e.target.value)}
                disabled={!searchData.make || filters.models.length === 0}
              >
                <MenuItem value="">Any Model</MenuItem>
                {filters.models.map((model) => (
                  <MenuItem key={model} value={model}>
                    {model}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Body Type</InputLabel>
              <Select
                value={searchData.bodyType}
                label="Body Type"
                onChange={(e) => handleInputChange('bodyType', e.target.value)}
                disabled={isLoadingFilters}
              >
                <MenuItem value="">Any Body Type</MenuItem>
                {filters.bodyTypes.map((bodyType) => (
                  <MenuItem key={bodyType} value={bodyType}>
                    {bodyType}
                  </MenuItem>
                ))}
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
                disabled={isLoadingFilters}
              >
                <MenuItem value="">Any Fuel Type</MenuItem>
                {filters.fuelTypes.map((fuelType) => (
                  <MenuItem key={fuelType} value={fuelType}>
                    {fuelType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Province</InputLabel>
              <Select
                value={searchData.province}
                label="Province"
                onChange={(e) => handleInputChange('province', e.target.value)}
                disabled={isLoadingFilters}
              >
                <MenuItem value="">Any Province</MenuItem>
                {filters.provinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
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
              min={filters.yearRange.min}
              max={filters.yearRange.max}
              disabled={isLoadingFilters}
              marks={[
                { value: filters.yearRange.min, label: filters.yearRange.min.toString() },
                { value: filters.yearRange.max, label: filters.yearRange.max.toString() },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Price Range: R{searchData.priceRange[0].toLocaleString()} - R{searchData.priceRange[1].toLocaleString()}
            </Typography>
            <Slider
              value={searchData.priceRange}
              onChange={(_, newValue) => handleInputChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={Math.max(10000, filters.priceRange.min)}
              max={filters.priceRange.max}
              step={10000}
              disabled={isLoadingFilters}
              marks={[
                { value: Math.max(10000, filters.priceRange.min), label: `R${Math.max(10000, filters.priceRange.min / 1000)}K` },
                { value: filters.priceRange.max, label: `R${filters.priceRange.max >= 1000000 ? (filters.priceRange.max / 1000000).toFixed(1) + 'M' : (filters.priceRange.max / 1000) + 'K'}` },
              ]}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>
              Maximum Mileage: {searchData.mileageMax.toLocaleString()} kilometers
            </Typography>
            <Slider
              value={searchData.mileageMax}
              onChange={(_, newValue) => handleInputChange('mileageMax', newValue)}
              valueLabelDisplay="auto"
              min={10000}
              max={250000}
              step={5000}
              disabled={isLoadingFilters}
              marks={[
                { value: 10000, label: '10K' },
                { value: 250000, label: '250K' },
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
