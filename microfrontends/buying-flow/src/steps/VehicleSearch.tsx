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
  Button,
  CircularProgress,
  Autocomplete,
  Chip,
  Divider,
} from '@mui/material';
import { Search, FilterList, ExpandMore, CheckCircle } from '@mui/icons-material';

interface VehicleSearchProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
  showIntro?: boolean; // Optional prop to show the intro message
}

const VehicleSearch: React.FC<VehicleSearchProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
  showIntro = false,
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
    mileageRange: { min: number; max: number };
  }>({
    makes: [],
    models: [],
    provinces: [],
    cities: [],
    fuelTypes: [],
    bodyTypes: [],
    transmissions: [],
    priceRange: { min: 0, max: 2000000 },
    yearRange: { min: 2000, max: 2025 },
    mileageRange: { min: 0, max: 250000 }
  });

  const [isLoadingFilters, setIsLoadingFilters] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [isLoadingBodyTypes, setIsLoadingBodyTypes] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [makeSuggestions, setMakeSuggestions] = useState<string[]>([]);
  const [filterCounts, setFilterCounts] = useState<{
    makes: Record<string, number>;
    models: Record<string, number>;
    bodyTypes: Record<string, number>;
    fuelTypes: Record<string, number>;
    transmissions: Record<string, number>;
    conditions: Record<string, number>;
    provinces: Record<string, number>;
    cities: Record<string, number>;
    colours: Record<string, number>;
  }>({
    makes: {},
    models: {},
    bodyTypes: {},
    fuelTypes: {},
    transmissions: {},
    conditions: {},
    provinces: {},
    cities: {},
    colours: {},
  });
  const [totalVehicles, setTotalVehicles] = useState<number>(0);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  // Cache for API responses to avoid duplicate calls
  const apiCache = useRef<Map<string, any>>(new Map());
  
  // Debounce timer refs
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const rangesDebounceTimer = useRef<NodeJS.Timeout | null>(null);
  const countsDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch filter counts with debounce
  useEffect(() => {
    if (countsDebounceTimer.current) {
      clearTimeout(countsDebounceTimer.current);
    }

    countsDebounceTimer.current = setTimeout(async () => {
      try {
        setIsLoadingCounts(true);
        
        const params = new URLSearchParams();
        
        if (searchData.make) params.append('make', searchData.make);
        if (searchData.model) params.append('model', searchData.model);
        if (searchData.yearRange) {
          params.append('yearMin', searchData.yearRange[0].toString());
          params.append('yearMax', searchData.yearRange[1].toString());
        }
        if (searchData.priceRange) {
          params.append('priceMin', searchData.priceRange[0].toString());
          params.append('priceMax', searchData.priceRange[1].toString());
        }
        if (searchData.mileageMax) {
          params.append('mileageMax', searchData.mileageMax.toString());
        }
        if (searchData.bodyType) params.append('bodyTypes', searchData.bodyType);
        if (searchData.fuelType) params.append('fuelTypes', searchData.fuelType);
        if (searchData.province) params.append('province', searchData.province);
        if (searchData.city) params.append('city', searchData.city);

        const response = await fetch(`http://localhost:8080/api/vehicles/filter-counts?${params.toString()}`);
        const result = await response.json();
        
        if (result.counts) {
          // Ensure all required properties exist with default empty objects
          setFilterCounts({
            makes: result.counts.makes || {},
            models: result.counts.models || {},
            bodyTypes: result.counts.bodyTypes || {},
            fuelTypes: result.counts.fuelTypes || {},
            transmissions: result.counts.transmissions || {},
            conditions: result.counts.conditions || {},
            provinces: result.counts.provinces || {},
            cities: result.counts.cities || {},
            colours: result.counts.colours || {},
          });
          setTotalVehicles(result.total || 0);
        }
      } catch (error) {
        console.error('Error fetching filter counts:', error);
        // Reset to empty counts on error to prevent undefined access
        setFilterCounts({
          makes: {},
          models: {},
          bodyTypes: {},
          fuelTypes: {},
          transmissions: {},
          conditions: {},
          provinces: {},
          cities: {},
          colours: {},
        });
      } finally {
        setIsLoadingCounts(false);
      }
    }, 300);

    return () => {
      if (countsDebounceTimer.current) {
        clearTimeout(countsDebounceTimer.current);
      }
    };
  }, [searchData.make, searchData.model, searchData.yearRange, searchData.priceRange, searchData.mileageMax, searchData.bodyType, searchData.fuelType, searchData.province, searchData.city]);

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
          yearRange: filtersData.yearRange || { min: 2000, max: 2025 },
          mileageRange: filtersData.mileageRange || { min: 0, max: 250000 }
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
  // DISABLED: Backend ranges endpoint has issues with data type casting
  // TODO: Fix backend VehicleRepository findPriceRangeByFilters, findYearRangeByFilters, findMileageRangeByFilters
  useEffect(() => {
    // Temporarily disabled - backend ranges endpoint returning empty data
    return;
    
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
        // The ranges endpoint only accepts these basic filter parameters
        if (searchData.make) params.append('make', searchData.make);
        if (searchData.model) params.append('model', searchData.model);
        if (searchData.bodyType) params.append('bodyType', searchData.bodyType);
        if (searchData.fuelType) params.append('fuelType', searchData.fuelType);
        if (searchData.province) params.append('province', searchData.province);
        
        const paramsString = params.toString();
        const cacheKey = `ranges-${paramsString}`;
        
        // Check cache first
        if (apiCache.current.has(cacheKey)) {
          const cachedRanges = apiCache.current.get(cacheKey);
          setFilters(prev => ({
            ...prev,
            priceRange: cachedRanges.priceRange || prev.priceRange,
            yearRange: cachedRanges.yearRange || prev.yearRange,
            mileageRange: cachedRanges.mileageRange || prev.mileageRange
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
        
        // Check if ranges are empty and use filter-counts as fallback
        let hasValidRanges = ranges && (ranges.priceRange || ranges.yearRange || ranges.mileageRange);
        
        if (!hasValidRanges) {
          console.log('Ranges endpoint returned empty, trying to get basic filtered counts');
          try {
            // Try to get filter counts for the same filters to see if vehicles exist
            const countsParams = new URLSearchParams();
            if (searchData.make) countsParams.append('make', searchData.make);
            if (searchData.model) countsParams.append('model', searchData.model);
            
            const countsResponse = await fetch(`http://localhost:8080/api/vehicles/filter-counts?${countsParams}`);
            const countsData = await countsResponse.json();
            
            if (countsData && countsData.total > 0) {
              console.log(`Found ${countsData.total} vehicles for current filters, using adjusted ranges`);
              // If vehicles exist but ranges endpoint returned empty, use slightly narrower ranges
              const fallbackRanges = {
                priceRange: { min: 100000, max: 1200000 }, // Slightly narrower for filtered results
                yearRange: { min: 2015, max: 2025 }, // More recent years for filtered results
                mileageRange: { min: 0, max: 150000 } // Lower max mileage for quality vehicles
              };
              Object.assign(ranges, fallbackRanges);
            } else {
              console.log('No vehicles found for current filters, keeping original ranges');
              return; // Don't update ranges if no vehicles match
            }
          } catch (countsError) {
            console.warn('Failed to get fallback counts, keeping original ranges');
            return;
          }
        }
        
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
          if (ranges.mileageRange) {
            newFilters.mileageRange = ranges.mileageRange;
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

  const handleClear = () => {
    // Reset all search and filter state to initial values
    setSearchQuery('');
    setSearchData({
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
    setMakeSuggestions([]);
    setShowFilters(false);
    
    // Reset filter counts and total vehicles
    setFilterCounts({
      makes: {},
      models: {},
      bodyTypes: {},
      fuelTypes: {},
      transmissions: {},
      conditions: {},
      provinces: {},
      cities: {},
      colours: {},
    });
    setTotalVehicles(0);
  };

  const handleSubmit = () => {
    // Parse any remaining search query before submitting
    parseFullSearchQuery();
    
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
          // Update search bar to show the make when auto-populated
          setSearchQuery(makeData.make + (value ? ` ${value}` : ''));
          return;
        }
      } catch (error) {
        console.error('Error fetching make for model:', error);
      }
    }
    
    // If make is being changed, update the search bar
    if (field === 'make') {
      if (value) {
        // Update search bar to show the selected make
        const currentModel = searchData.model;
        const newSearchQuery = value + (currentModel ? ` ${currentModel}` : '');
        if (searchQuery !== newSearchQuery) {
          setSearchQuery(newSearchQuery);
        }
      } else {
        // If make is cleared, clear search bar or keep only model
        const currentModel = searchData.model;
        const newSearchQuery = currentModel || '';
        if (searchQuery !== newSearchQuery) {
          setSearchQuery(newSearchQuery);
        }
      }
    }
    
    // If model is being changed and we have a make, update search bar
    if (field === 'model') {
      const currentMake = searchData.make;
      let newSearchQuery = '';
      if (currentMake) {
        newSearchQuery = currentMake + (value ? ` ${value}` : '');
      } else if (value) {
        newSearchQuery = value;
      }
      
      if (searchQuery !== newSearchQuery) {
        setSearchQuery(newSearchQuery);
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

  // Helper function to format mileage numbers
  const formatMileage = (mileage: number): string => {
    return mileage.toLocaleString('en-ZA').replace(/,/g, ' ');
  };

  // Generate dynamic price options based on current price range
  const generatePriceOptions = (min: number, max: number) => {
    const options = [];
    const ranges = [50000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000];
    
    // Filter ranges to only include those within the dynamic range
    const validRanges = ranges.filter(price => price >= min && price <= max);
    
    // Always include the actual min and max from the data
    if (min > 0 && !validRanges.includes(min)) {
      validRanges.unshift(min);
    }
    if (max < 2000000 && !validRanges.includes(max)) {
      validRanges.push(max);
    }
    
    return validRanges.sort((a, b) => a - b);
  };

  // Generate dynamic mileage options based on available data
  const generateMileageOptions = (maxMileage: number) => {
    const options = [];
    const ranges = [20000, 30000, 50000, 75000, 100000, 150000, 200000, 250000];
    
    // Filter ranges to only include those within the dynamic range
    const validRanges = ranges.filter(mileage => mileage <= maxMileage);
    
    // Always include the actual max from the data
    if (!validRanges.includes(maxMileage)) {
      validRanges.push(maxMileage);
    }
    
    return validRanges.sort((a, b) => a - b);
  };

  // Handle search query change
  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    // Keep the original query for display (case-sensitive for user experience)
    setSearchQuery(query);

    // Convert to uppercase for filtering
    const upperCaseQuery = query.toUpperCase();

    // Filter both makes AND models based on the input
    if (upperCaseQuery.trim()) {
      const availableMakes = filters.makes || [];
      const availableModels = filters.models || [];
      
      // Helper function to check if string contains all characters in order
      const matchesQuery = (text: string) => {
        let queryIndex = 0;
        for (let i = 0; i < text.length && queryIndex < upperCaseQuery.length; i++) {
          if (text[i] === upperCaseQuery[queryIndex]) {
            queryIndex++;
          }
        }
        return queryIndex === upperCaseQuery.length;
      };

      // Filter makes that match the query
      const filteredMakes = availableMakes.filter(matchesQuery);
      
      // Filter models that match the query
      const filteredModels = availableModels.filter(matchesQuery);

      // Combine and deduplicate results
      const allSuggestions = [...filteredMakes, ...filteredModels];
      const uniqueSuggestions = Array.from(new Set(allSuggestions));

      // Sort by relevance: exact matches first, then starts-with, then contains
      const sortedSuggestions = uniqueSuggestions.sort((a, b) => {
        const aExact = a === upperCaseQuery;
        const bExact = b === upperCaseQuery;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        const aStartsWith = a.startsWith(upperCaseQuery);
        const bStartsWith = b.startsWith(upperCaseQuery);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Prioritize makes over models when relevance is equal
        const aIsMake = availableMakes.includes(a);
        const bIsMake = availableMakes.includes(b);
        if (aIsMake && !bIsMake) return -1;
        if (!aIsMake && bIsMake) return 1;
        
        // If both or neither start with query, sort by length (shorter first)
        return a.length - b.length;
      });

      setMakeSuggestions(sortedSuggestions.slice(0, 10)); // Limit to 10 suggestions
    } else {
      setMakeSuggestions([]);
    }
  };

  // Handle make/model selection from autocomplete
  const handleMakeSelection = (selectedValue: string | null) => {
    if (selectedValue) {
      const availableMakes = filters.makes || [];
      const availableModels = filters.models || [];
      
      if (availableMakes.includes(selectedValue)) {
        // It's a make, set it directly
        handleInputChange('make', selectedValue);
      } else if (availableModels.includes(selectedValue)) {
        // It's a model, set the model and try to auto-populate the make
        handleInputChange('model', selectedValue);
        // Fetch the make for this model
        fetchMakeForModel(selectedValue);
      } else {
        // It might be a search query like "BMW 1 SERIES", parse it
        parseFullSearchQuery();
      }
      
      // Clear suggestions when a selection is made
      setMakeSuggestions([]);
    }
  };

  // Fetch make for a given model
  const fetchMakeForModel = async (model: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/vehicles/models/${model}/make`);
      const makeData = await response.json();
      if (makeData && makeData.make) {
        handleInputChange('make', makeData.make);
      }
    } catch (error) {
      console.error('Error fetching make for model:', error);
    }
  };

  // Handle parsing full search query (when user presses enter or clicks search)
  const parseFullSearchQuery = () => {
    const upperCaseQuery = searchQuery.toUpperCase();
    
    if (upperCaseQuery.trim()) {
      const parts = upperCaseQuery.trim().split(/\s+/);
      if (parts.length >= 1) {
        const potentialMake = parts[0];
        
        // Try to find exact or best matching make
        const availableMakes = filters.makes || [];
        const exactMatch = availableMakes.find(make => make === potentialMake);
        const startsWithMatch = availableMakes.find(make => make.startsWith(potentialMake));
        
        const bestMakeMatch = exactMatch || startsWithMatch;
        
        if (bestMakeMatch) {
          handleInputChange('make', bestMakeMatch);
          // Rest is the model
          if (parts.length >= 2) {
            handleInputChange('model', parts.slice(1).join(' '));
          }
        } else {
          // If no make match found, treat entire query as model search
          handleInputChange('make', '');
          handleInputChange('model', upperCaseQuery);
        }
      }
    }
  };

  // Count active filters
  const activeFiltersCount = [
    searchData.make,
    searchData.model,
    searchData.bodyType,
    searchData.fuelType,
    searchData.province,
    searchData.city,
  ].filter(Boolean).length;

  return (
    <Card>
      <CardContent sx={{ pr: 8, pl: 8 }}>
        {/* Optional Intro Section */}
        {showIntro && (
          <Box sx={{ mb: 4 }}>
            {/* Confirmation Message */}
            <Box sx={{ mb: 3, p: 3, backgroundColor: '#e8f5e8', borderRadius: 2, border: '1px solid #4caf50' }}>
              <Typography
                variant="body1"
                sx={{
                  color: '#2e7d32',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}
              >
                <CheckCircle sx={{ color: '#4caf50', fontSize: 20 }} />
                Your vehicle valuation report has been sent to your email and will arrive shortly.
              </Typography>
            </Box>

            {/* Main Question */}
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                color: '#1a1a1a',
                mb: 2,
                letterSpacing: '-0.02em',
                textAlign: 'center'
              }}
            >
              While you await the report, can we help you find a vehicle?
            </Typography>
              <Divider />
          </Box>
        )}

        <Box textAlign="center" mb={4}>
          {/* <Search sx={{ fontSize: 48, color: '#1e3a8a', mb: 1 }} /> */}
          <Typography variant="h4" gutterBottom>
            Find cars for sale
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tell us what you're looking for and we'll help you find it
          </Typography>
        </Box>

        {/* Dynamic Search Bar */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Autocomplete
              fullWidth
              freeSolo
              options={makeSuggestions}
              value={null}
              inputValue={searchQuery}
              onInputChange={(event, newInputValue) => {
                // If the input value is empty and there was a previous value, user clicked clear button
                if (newInputValue === '' && searchQuery !== '') {
                  handleClear();
                } else if (event && event.type === 'change') {
                  handleSearchQueryChange(event as React.ChangeEvent<HTMLInputElement>);
                }
              }}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  handleMakeSelection(newValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter Make, Model and Variant"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSubmit();
                    }
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <Search sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#ffffff',
                    },
                  }}
                />
              )}
              renderOption={(props, option) => {
                const availableMakes = filters.makes || [];
                const isMake = availableMakes.includes(option);
                
                return (
                  <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {option}
                    </Typography>
                    <Chip
                      label={isMake ? 'Make' : 'Model'}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        backgroundColor: isMake ? '#1e3a8a' : '#f0f0f0',
                        color: isMake ? 'white' : '#666',
                        ml: 2,
                      }}
                    />
                  </Box>
                );
              }}
              noOptionsText="No makes or models found"
              sx={{
                '& .MuiAutocomplete-popup': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              endIcon={
                <ExpandMore
                  sx={{
                    transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                />
              }
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                minWidth: '140px',
                borderRadius: 2,
                textTransform: 'none',
                borderColor: '#1e3a8a',
                color: '#1e3a8a',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#1e40af',
                  backgroundColor: 'rgba(30, 58, 138, 0.04)',
                },
              }}
            >
              Filters
              {activeFiltersCount > 0 && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    px: 1,
                    py: 0.25,
                    borderRadius: '12px',
                    backgroundColor: '#1e3a8a',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {activeFiltersCount}
                </Box>
              )}
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : null}
              sx={{
                minWidth: '200px',
                borderRadius: 2,
                textTransform: 'none',
                backgroundColor: '#1e3a8a',
                color: '#ffffff',
                fontWeight: 500,
                px: 3,
                '&:hover': {
                  backgroundColor: '#1e40af',
                },
              }}
            >
              {isLoading ? 'Searching...' : `Search ${totalVehicles > 0 ? `(${totalVehicles.toLocaleString()})` : 'cars'}`}
            </Button>
          </Box>
        </Box>

        {/* Expandable Filters Section */}
        {showFilters && (
          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: '#1e3a8a', fontWeight: 600 }}>
              Advanced Filters
            </Typography>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>{make}</span>
                          {filterCounts.makes[make] && (
                            <Chip
                              label={filterCounts.makes[make]}
                              size="small"
                              sx={{ height: 20, ml: 1 }}
                            />
                          )}
                        </Box>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>{bodyType}</span>
                          {filterCounts.bodyTypes[bodyType] && (
                            <Chip
                              label={filterCounts.bodyTypes[bodyType]}
                              size="small"
                              sx={{ height: 20, ml: 1 }}
                            />
                          )}
                        </Box>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>{fuelType}</span>
                          {filterCounts.fuelTypes[fuelType] && (
                            <Chip
                              label={filterCounts.fuelTypes[fuelType]}
                              size="small"
                              sx={{ height: 20, ml: 1 }}
                            />
                          )}
                        </Box>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>{province}</span>
                          {filterCounts.provinces[province] && (
                            <Chip
                              label={filterCounts.provinces[province]}
                              size="small"
                              sx={{ height: 20, ml: 1 }}
                            />
                          )}
                        </Box>
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                          <span>{city}</span>
                          {filterCounts.cities[city] && (
                            <Chip
                              label={filterCounts.cities[city]}
                              size="small"
                              sx={{ height: 20, ml: 1 }}
                            />
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel id="year-min-select-label">Min Year</InputLabel>
                  <Select
                    labelId="year-min-select-label"
                    id="year-min-select"
                    value={searchData.yearRange[0]}
                    label="Min Year"
                    onChange={(e) => handleInputChange('yearRange', [e.target.value, searchData.yearRange[1]])}
                    disabled={isLoadingFilters}
                  >
                    <MenuItem value={filters.yearRange.min}>Any</MenuItem>
                    {Array.from({ length: filters.yearRange.max - filters.yearRange.min + 1 }, (_, i) => filters.yearRange.max - i)
                      .filter(year => year <= searchData.yearRange[1]) // Only show years <= max year
                      .map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel id="year-max-select-label">Max Year</InputLabel>
                  <Select
                    labelId="year-max-select-label"
                    id="year-max-select"
                    value={searchData.yearRange[1]}
                    label="Max Year"
                    onChange={(e) => handleInputChange('yearRange', [searchData.yearRange[0], e.target.value])}
                    disabled={isLoadingFilters}
                  >
                    <MenuItem value={filters.yearRange.max}>Any</MenuItem>
                    {Array.from({ length: filters.yearRange.max - filters.yearRange.min + 1 }, (_, i) => filters.yearRange.max - i)
                      .filter(year => year >= searchData.yearRange[0]) // Only show years >= min year
                      .map((year) => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel id="price-min-select-label">Min Price</InputLabel>
                  <Select
                    labelId="price-min-select-label"
                    id="price-min-select"
                    value={searchData.priceRange[0]}
                    label="Min Price"
                    onChange={(e) => handleInputChange('priceRange', [e.target.value, searchData.priceRange[1]])}
                    disabled={isLoadingFilters}
                  >
                    <MenuItem value={filters.priceRange.min}>Any</MenuItem>
                    {generatePriceOptions(filters.priceRange.min, filters.priceRange.max).map((price) => (
                      <MenuItem key={price} value={price}>
                        R{formatPrice(price)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel id="price-max-select-label">Max Price</InputLabel>
                  <Select
                    labelId="price-max-select-label"
                    id="price-max-select"
                    value={searchData.priceRange[1]}
                    label="Max Price"
                    onChange={(e) => handleInputChange('priceRange', [searchData.priceRange[0], e.target.value])}
                    disabled={isLoadingFilters}
                  >
                    <MenuItem value={filters.priceRange.max}>Any</MenuItem>
                    {generatePriceOptions(filters.priceRange.min, filters.priceRange.max)
                      .filter(price => price >= searchData.priceRange[0]) // Only show prices >= min price
                      .map((price) => (
                        <MenuItem key={price} value={price}>
                          R{formatPrice(price)}{price === filters.priceRange.max ? '+' : ''}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <FormControl fullWidth>
                  <InputLabel id="mileage-select-label">Max Mileage</InputLabel>
                  <Select
                    labelId="mileage-select-label"
                    id="mileage-select"
                    value={searchData.mileageMax}
                    label="Max Mileage"
                    onChange={(e) => handleInputChange('mileageMax', e.target.value)}
                    disabled={isLoadingFilters}
                  >
                    <MenuItem value={filters.mileageRange.max}>Any</MenuItem>
                    {generateMileageOptions(filters.mileageRange.max).map((mileage) => (
                      <MenuItem key={mileage} value={mileage}>
                        {formatPrice(mileage)} km{mileage === filters.mileageRange.max ? '+' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        )}

        {/* Quick Search Button (shown when filters are hidden) */}
        {/* {!showFilters && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button
              variant="text"
              onClick={() => setShowFilters(true)}
              sx={{
                textTransform: 'none',
                color: '#1e3a8a',
                '&:hover': {
                  backgroundColor: 'rgba(30, 58, 138, 0.04)',
                },
              }}
            >
              Need more options? Try advanced filters
            </Button>
          </Box>
        )} */}

        {/* Search Button (shown when filters are expanded) */}
        {/* {showFilters && (
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
        )} */}
      </CardContent>
    </Card>
  );
};

export default VehicleSearch;
