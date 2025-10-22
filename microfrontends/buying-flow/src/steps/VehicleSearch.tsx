import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Button,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
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
    city: '',
  });

  const [filters, setFilters] = useState<{
    makes: string[];
    models: string[];
    provinces: string[];
    cities: string[];
    fuelTypes: string[];
    bodyTypes: string[];
    transmissions: string[];
    priceRange: { min: number; max: number };
    yearRange: { min: number; max: number };
  }>({
    makes: [],
    models: [],
    provinces: [],
    cities: [],
    fuelTypes: [],
    bodyTypes: [],
    transmissions: [],
    priceRange: { min: 0, max: 2000000 },
    yearRange: { min: 2000, max: 2025 }
  });

  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [isLoadingBodyTypes, setIsLoadingBodyTypes] = useState(false);

  // Cache for API responses to avoid duplicate calls
  const apiCache = useRef<Map<string, any>>(new Map());
  
  // Debounce timer refs
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const rangesDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Load filters AND models on component mount
  useEffect(() => {
    const loadFiltersAndModels = async () => {
      try {
        // Load filters and models in parallel
        const [filtersResponse, modelsResponse] = await Promise.all([
          fetch('http://localhost:8080/api/vehicles/filters'),
          fetch('http://localhost:8080/api/vehicles/models')
        ]);
        
        const [filtersData, modelsData] = await Promise.all([
          filtersResponse.json(),
          modelsResponse.json()
        ]);
        
        console.log('Initial load - models:', modelsData.length);
        
        // Cache the models
        apiCache.current.set('models-all', modelsData);
        
        // Set all filters including models in one update
        setFilters({
          makes: filtersData.makes || [],
          models: modelsData || [],  // Use fetched models, not from filters
          provinces: filtersData.provinces || [],
          cities: filtersData.cities || [],
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
        setIsLoadingModels(false);
      }
    };

    loadFiltersAndModels();
  }, []);

  // Load models when make changes (not on initial mount)
  useEffect(() => {
    // Skip if no make selected (initial state already loaded in first useEffect)
    if (!searchData.make) {
      return;
    }
    
    const loadModels = async () => {
      console.log('Loading models for make:', searchData.make);
      setIsLoadingModels(true);
      try {
        const cacheKey = `models-${searchData.make}`;
        
        // Check cache first
        if (apiCache.current.has(cacheKey)) {
          const cachedModels = apiCache.current.get(cacheKey);
          console.log('Using cached models:', cachedModels.length);
          setFilters(prev => ({
            ...prev,
            models: cachedModels || []
          }));
          setIsLoadingModels(false);
          return;
        }
        
        // Load models for specific make
        console.log('Fetching models for make:', searchData.make);
        const response = await fetch(`http://localhost:8080/api/vehicles/makes/${searchData.make}/models`);
        const models = await response.json();
        console.log('Received models for make:', models.length);
        apiCache.current.set(cacheKey, models);
        setFilters(prev => ({
          ...prev,
          models: [...models] // Create new array reference
        }));
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setIsLoadingModels(false);
        console.log('Models loading complete');
      }
    };
    loadModels();
  }, [searchData.make]);

  // Cities are now loaded with initial filters, no separate useEffect needed

  // Debounced fetch function with caching
  const debouncedFetch = useCallback(async (url: string, cacheKey: string) => {
    // Check cache first
    if (apiCache.current.has(cacheKey)) {
      return apiCache.current.get(cacheKey);
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    // Cache the result
    apiCache.current.set(cacheKey, data);
    
    return data;
  }, []);
  
  // Load filtered options when make, model, or city changes (with debouncing)
  useEffect(() => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Only fetch if we have at least one filter
    if (!searchData.make && !searchData.model && !searchData.city) {
      return;
    }
    
    // Debounce the API call by 300ms
    debounceTimer.current = setTimeout(async () => {
      console.log('🔍 Fetching filtered options for:', { make: searchData.make, model: searchData.model, city: searchData.city });
      setIsLoadingBodyTypes(true);
      try {
        const params = new URLSearchParams();
        if (searchData.make) params.append('make', searchData.make);
        if (searchData.model) params.append('model', searchData.model);
        if (searchData.city) params.append('city', searchData.city);
        
        const paramsString = params.toString();
        const cacheKey = `filtered-options-${paramsString}`;
        
        // Check if we already have this in cache
        if (apiCache.current.has(cacheKey)) {
          const cached = apiCache.current.get(cacheKey);
          console.log('✅ Using cached body types:', cached.bodyTypes);
          setFilters(prev => ({
            ...prev,
            bodyTypes: cached.bodyTypes || [],
            fuelTypes: cached.fuelTypes || [],
            provinces: cached.provinces || [],
            cities: cached.cities || []
          }));
          setIsLoadingBodyTypes(false);
          return;
        }

        // Load filtered options in parallel
        const [bodyTypesRes, fuelTypesRes, provincesRes, citiesRes] = await Promise.all([
          fetch(`http://localhost:8080/api/vehicles/filtered/body-types?${params}`),
          fetch(`http://localhost:8080/api/vehicles/filtered/fuel-types?${params}`),
          fetch(`http://localhost:8080/api/vehicles/filtered/provinces?${params}`),
          fetch(`http://localhost:8080/api/vehicles/filtered/cities?${params}`)
        ]);

        const [bodyTypes, fuelTypes, provinces, cities] = await Promise.all([
          bodyTypesRes.json(),
          fuelTypesRes.json(),
          provincesRes.json(),
          citiesRes.json()
        ]);
        
        console.log('✅ Fetched body types for model:', searchData.model, '→', bodyTypes);
        
        // Cache the combined result
        apiCache.current.set(cacheKey, { bodyTypes, fuelTypes, provinces, cities });

        setFilters(prev => ({
          ...prev,
          bodyTypes: bodyTypes || [],
          fuelTypes: fuelTypes || [],
          provinces: provinces || [],
          cities: cities || []
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
          if (prev.city && !cities.includes(prev.city)) {
            newData.city = '';
          }
          return newData;
        });

      } catch (error) {
        console.error('❌ Error loading filtered options:', error);
      } finally {
        setIsLoadingBodyTypes(false);
      }
    }, 300); // 300ms debounce delay
    
    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchData.make, searchData.model, searchData.city]);

  // Load dynamic ranges when any filter changes (with debouncing)
  useEffect(() => {
    // Clear existing timer
    if (rangesDebounceTimer.current) {
      clearTimeout(rangesDebounceTimer.current);
    }
    
    // Only fetch if at least one filter is selected
    if (!searchData.make && !searchData.model && !searchData.bodyType && !searchData.fuelType && !searchData.province && !searchData.city) {
      return;
    }
    
    // Debounce by 500ms
    rangesDebounceTimer.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchData.make) params.append('make', searchData.make);
        if (searchData.model) params.append('model', searchData.model);
        if (searchData.bodyType) params.append('bodyType', searchData.bodyType);
        if (searchData.fuelType) params.append('fuelType', searchData.fuelType);
        if (searchData.province) params.append('province', searchData.province);
        if (searchData.city) params.append('city', searchData.city);
        
        const paramsString = params.toString();
        const cacheKey = `ranges-${paramsString}`;
        
        // Check cache first
        if (apiCache.current.has(cacheKey)) {
          const cachedRanges = apiCache.current.get(cacheKey);
          setFilters(prev => ({
            ...prev,
            priceRange: cachedRanges.priceRange || prev.priceRange,
            yearRange: cachedRanges.yearRange || prev.yearRange
          }));
          return;
        }

        const response = await fetch(`http://localhost:8080/api/vehicles/filtered/ranges?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.warn('Failed to fetch dynamic ranges:', response.status, response.statusText);
          return;
        }

        const ranges = await response.json();
        
        // Cache the result
        apiCache.current.set(cacheKey, ranges);

        // Update filter ranges
        setFilters(prev => {
          const newFilters = { ...prev };
          
          if (ranges.priceRange) {
            newFilters.priceRange = ranges.priceRange;
          }
          if (ranges.yearRange) {
            newFilters.yearRange = ranges.yearRange;
          }
          
          return newFilters;
        });

          // Adjust search data to fit within new ranges
          setSearchData(prev => {
            const newData = { ...prev };
            
            if (ranges.priceRange) {
              newData.priceRange = [
                Math.max(prev.priceRange[0], ranges.priceRange.min),
                Math.min(prev.priceRange[1], ranges.priceRange.max)
              ];
            }
            
            if (ranges.yearRange) {
              newData.yearRange = [
                Math.max(prev.yearRange[0], ranges.yearRange.min),
                Math.min(prev.yearRange[1], ranges.yearRange.max)
              ];
            }
            
            if (ranges.mileageRange) {
              newData.mileageMax = Math.min(prev.mileageMax, ranges.mileageRange.max);
            }
            
            return newData;
          });

      } catch (error) {
        console.error('Error loading dynamic ranges:', error);
      }
    }, 500); // 500ms debounce for ranges
    
    // Cleanup
    return () => {
      if (rangesDebounceTimer.current) {
        clearTimeout(rangesDebounceTimer.current);
      }
    };
  }, [searchData.make, searchData.model, searchData.bodyType, searchData.fuelType, searchData.province, searchData.city]);

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

  // Debug: Log filters.models length
  console.log('Render - filters.models.length:', filters.models?.length || 0);
  
  const handleInputChange = async (field: string, value: any) => {
    // If model is selected, auto-populate make
    if (field === 'model' && value && !searchData.make) {
      try {
        const response = await fetch(`http://localhost:8080/api/vehicles/models/${value}/make`);
        const makeData = await response.json();
        if (makeData && makeData.make) {
          setSearchData(prev => ({
            ...prev,
            make: makeData.make,
            model: value,
          }));
          return;
        }
      } catch (error) {
        console.error('Error fetching make for model:', error);
      }
    }
    
    setSearchData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper function to format large numbers with spaces as thousands separators
  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-ZA').replace(/,/g, ' ');
  };

  return (
    <Card>
      <CardContent sx={{ pr: 8, pl: 8 }}>
        <Box textAlign="center" mb={4}>
          <Search sx={{ fontSize: 48, color: '#1e3a8a', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Find Your Vehicle
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
                {(filters.makes || []).map((make) => (
                  <MenuItem key={make} value={make}>
                    {make}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Autocomplete
              value={searchData.model || null}
              onChange={(event, newValue) => {
                handleInputChange('model', newValue || '');
              }}
              inputValue={searchData.model || ''}
              onInputChange={(event, newInputValue) => {
                // Update input as user types
                if (event && event.type === 'change') {
                  handleInputChange('model', newInputValue);
                }
              }}
              options={filters.models || []}
              disabled={isLoadingModels}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Model"
                  placeholder="Type to search models..."
                  helperText={
                    isLoadingModels 
                      ? 'Loading models...' 
                      : `${(filters.models || []).length} models available`
                  }
                />
              )}
              noOptionsText="No models found"
              loading={isLoadingModels}
              loadingText="Loading models..."
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Body Type</InputLabel>
              <Select
                value={searchData.bodyType}
                label="Body Type"
                onChange={(e) => handleInputChange('bodyType', e.target.value)}
                disabled={isLoadingFilters || isLoadingBodyTypes}
              >
                <MenuItem value="">Any Body Type</MenuItem>
                {(filters.bodyTypes || []).map((bodyType) => (
                  <MenuItem key={bodyType} value={bodyType}>
                    {bodyType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {isLoadingBodyTypes && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Updating body types based on selected model...
              </Typography>
            )}
            {!isLoadingBodyTypes && searchData.model && filters.bodyTypes.length > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                {filters.bodyTypes.length} body type{filters.bodyTypes.length !== 1 ? 's' : ''} available for {searchData.model}
              </Typography>
            )}
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
                {(filters.fuelTypes || []).map((fuelType) => (
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
                {(filters.provinces || []).map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={searchData.city}
                label="City"
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={isLoadingFilters}
              >
                <MenuItem value="">Any City</MenuItem>
                {(filters.cities || []).map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
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
              sx={{
                color: '#1e3a8a',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#1e3a8a',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#1e3a8a',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#cbd5e1',
                },
              }}
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
                { value: Math.max(10000, filters.priceRange.min), label: `R${formatPrice(Math.max(10000, filters.priceRange.min))}` },
                { value: filters.priceRange.max, label: `R${filters.priceRange.max >= 1000000 ? (filters.priceRange.max / 1000000).toFixed(1) + 'M' : (filters.priceRange.max / 1000) + 'K'}` },
              ]}
              sx={{
                color: '#1e3a8a',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#1e3a8a',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#1e3a8a',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#cbd5e1',
                },
              }}
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
              sx={{
                color: '#1e3a8a',
                '& .MuiSlider-thumb': {
                  backgroundColor: '#1e3a8a',
                },
                '& .MuiSlider-track': {
                  backgroundColor: '#1e3a8a',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#cbd5e1',
                },
              }}
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="contained"
            size="medium"
            startIcon={isLoading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <Search />}  
            onClick={handleSubmit}
            disabled={isLoading}
             sx={{
                  px: 4,
                  py: 1,
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  backgroundColor: '#1e3a8a',
                  color: '#ffffff',
                  boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)',
                  '&:hover': {
                    backgroundColor: '#1e40af',
                    boxShadow: '0 3px 10px rgba(30, 58, 138, 0.3)',
                  }
                }}
          >
            {isLoading ? 'Searching...' : 'Search Vehicles'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleSearch;
