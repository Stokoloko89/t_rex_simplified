// React is available globally from the host app
declare const React: typeof import('react');
const { useState, useEffect, useCallback, useRef, useMemo } = React;
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
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
        // Load filters first
        const filtersResponse = await fetch('http://localhost:8080/api/vehicles/filters');
        const filtersData = await filtersResponse.json();
        
        // Try to load all models from dedicated endpoint
        let modelsData = null;
        try {
          const modelsResponse = await fetch('http://localhost:8080/api/vehicles/models');
          console.log('Models response status:', modelsResponse.status);
          
          if (modelsResponse.ok) {
            modelsData = await modelsResponse.json();
          } else {
            console.warn('Models API returned non-OK status:', modelsResponse.status);
          }
        } catch (modelsError) {
          console.warn('Models API endpoint not available, will use filters.models:', modelsError);
        }
        
        console.log('Raw modelsData:', modelsData);
        
        // Ensure modelsData is an array
        let modelsArray = Array.isArray(modelsData) ? modelsData : [];
        
        // Fallback 1: If models endpoint returns empty/undefined, try to get from filters
        if (modelsArray.length === 0 && filtersData.models && Array.isArray(filtersData.models)) {
          console.log('Using models from filters endpoint as fallback');
          modelsArray = filtersData.models;
        }
        
        // Fallback 2: If still empty, aggregate models by fetching per make
        if (modelsArray.length === 0) {
          const makesArray = Array.isArray(filtersData.makes) ? filtersData.makes : [];
          if (makesArray.length > 0) {
            try {
              const results = await Promise.allSettled(
                makesArray.map((m: string) =>
                  fetch(`http://localhost:8080/api/vehicles/makes/${encodeURIComponent(m)}/models`).then(res =>
                    res.ok ? res.json() : []
                  )
                )
              );
              const collected = new Set<string>();
              results.forEach(r => {
                if (r.status === 'fulfilled' && Array.isArray(r.value)) {
                  (r.value as any[]).forEach((model: any) => {
                    if (typeof model === 'string' && model) collected.add(model);
                  });
                }
              });
              modelsArray = Array.from(collected).sort((a, b) => a.localeCompare(b));
              console.log('Aggregated models from makes:', modelsArray.length);
            } catch (aggErr) {
              console.warn('Failed aggregating models from makes', aggErr);
            }
          }
        }
        
        console.log('Initial load - models array length:', modelsArray.length);
        
        // Cache all initial filter lists for reset functionality
        apiCache.current.set('models-all', modelsArray);
        apiCache.current.set('makes-all', filtersData.makes || []);
        apiCache.current.set('bodyTypes-all', filtersData.bodyTypes || []);
        apiCache.current.set('fuelTypes-all', filtersData.fuelTypes || []);
        apiCache.current.set('provinces-all', filtersData.provinces || []);
        apiCache.current.set('cities-all', filtersData.cities || []);
        
        // Set all filters including models in one update
        setFilters({
          makes: filtersData.makes || [],
          models: modelsArray,  // Use fetched models or fallback to filters.models
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
        const modelsArray = Array.isArray(models) ? models : [];
        console.log('Received models for make:', modelsArray.length);
        apiCache.current.set(cacheKey, modelsArray);
        setFilters(prev => ({
          ...prev,
          models: [...modelsArray] // Create new array reference
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
  
  // Load filtered options when ANY filter changes (with debouncing)
  useEffect(() => {
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Check if all filters are empty
    const hasAnyFilter = searchData.make || searchData.model || searchData.bodyType || 
                         searchData.fuelType || searchData.province || searchData.city;
    
    // If no filters at all, reset ALL filter lists to initial state
    if (!hasAnyFilter) {
      const cachedAllModels = apiCache.current.get('models-all');
      const cachedAllBodyTypes = apiCache.current.get('bodyTypes-all');
      const cachedAllFuelTypes = apiCache.current.get('fuelTypes-all');
      const cachedAllProvinces = apiCache.current.get('provinces-all');
      const cachedAllCities = apiCache.current.get('cities-all');
      
      console.log('🔄 Resetting all filters to initial state');
      setFilters(prev => ({
        ...prev,
        models: cachedAllModels || prev.models,
        bodyTypes: cachedAllBodyTypes || prev.bodyTypes,
        fuelTypes: cachedAllFuelTypes || prev.fuelTypes,
        provinces: cachedAllProvinces || prev.provinces,
        cities: cachedAllCities || prev.cities
      }));
      return;
    }
    
    // Debounce the API call by 300ms
    debounceTimer.current = setTimeout(async () => {
      console.log('🔍 Fetching filtered options for:', { 
        make: searchData.make, 
        model: searchData.model, 
        bodyType: searchData.bodyType,
        fuelType: searchData.fuelType,
        province: searchData.province,
        city: searchData.city 
      });
      setIsLoadingBodyTypes(true);
      setIsLoadingModels(true);
      try {
        const params = new URLSearchParams();
        if (searchData.make) params.append('make', searchData.make);
        if (searchData.model) params.append('model', searchData.model);
        if (searchData.bodyType) params.append('bodyType', searchData.bodyType);
        if (searchData.fuelType) params.append('fuelType', searchData.fuelType);
        if (searchData.province) params.append('province', searchData.province);
        if (searchData.city) params.append('city', searchData.city);
        
        const paramsString = params.toString();
        const cacheKey = `filtered-options-${paramsString}`;
        
        // Check if we already have this in cache
        if (apiCache.current.has(cacheKey)) {
          const cached = apiCache.current.get(cacheKey);
          console.log('✅ Using cached filtered options');
          setFilters(prev => ({
            ...prev,
            models: cached.models || [],
            bodyTypes: cached.bodyTypes || [],
            fuelTypes: cached.fuelTypes || [],
            provinces: cached.provinces || [],
            cities: cached.cities || []
          }));
          setIsLoadingBodyTypes(false);
          setIsLoadingModels(false);
          return;
        }

        // Build filtered endpoints - fetch models, bodyTypes, fuelTypes, provinces, cities
        const endpoints = [
          `http://localhost:8080/api/vehicles/filtered/models?${params}`,
          `http://localhost:8080/api/vehicles/filtered/body-types?${params}`,
          `http://localhost:8080/api/vehicles/filtered/fuel-types?${params}`,
          `http://localhost:8080/api/vehicles/filtered/provinces?${params}`,
          `http://localhost:8080/api/vehicles/filtered/cities?${params}`
        ];

        // Load filtered options in parallel
        const responses = await Promise.all(endpoints.map(url => fetch(url)));
        const [models, bodyTypes, fuelTypes, provinces, cities] = await Promise.all(
          responses.map(res => res.json())
        );
        
        console.log('✅ Fetched filtered options:', { 
          models: models.length,
          bodyTypes: bodyTypes.length, 
          fuelTypes: fuelTypes.length,
          provinces: provinces.length,
          cities: cities.length
        });
        
        // Cache the combined result
        apiCache.current.set(cacheKey, { models, bodyTypes, fuelTypes, provinces, cities });

        setFilters(prev => ({
          ...prev,
          models: models || [],
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
        setIsLoadingModels(false);
      }
    }, 300); // 300ms debounce delay
    
    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchData.make, searchData.model, searchData.bodyType, searchData.fuelType, searchData.province, searchData.city]);

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

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <FormControl fullWidth>
              <InputLabel id="make-select-label">Make</InputLabel>
              <Select
                labelId="make-select-label"
                id="make-select"
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
          </Box>
          
          <Box>
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
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel id="body-type-select-label">Body Type</InputLabel>
              <Select
                labelId="body-type-select-label"
                id="body-type-select"
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
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel id="fuel-type-select-label">Fuel Type</InputLabel>
              <Select
                labelId="fuel-type-select-label"
                id="fuel-type-select"
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
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel id="province-select-label">Province</InputLabel>
              <Select
                labelId="province-select-label"
                id="province-select"
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
          </Box>

          <Box>
            <FormControl fullWidth>
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
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
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
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
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
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
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
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
          </Box>
        </Box>

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
