import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  Grid, 
  Chip, 
  Divider, 
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { LocalGasStation, Speed, LocationOn, DirectionsCar, Settings } from '@mui/icons-material';
import { formatCurrency, formatFuelConsumption, formatDistance } from '@t-rex/shared-ui';

interface Vehicle {
  id: number;
  usedVehicleStockId: number;
  year: number;
  makeName: string;
  modelName: string;
  variantName: string;
  price: number;
  mileage: number;
  colour: string;
  provinceName: string;
  bodyType: string;
  transmission: string;
  fuelType: string;
  engineSize: string;
  condition: string;
}

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
    pageSize: 20,
  });
  const [sortBy, setSortBy] = useState('price');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    console.log('SearchResults - initialData received:', initialData);
    console.log('SearchResults - vehicleSearch data:', initialData?.vehicleSearch);
    
    if (initialData?.vehicleSearch) {
      searchVehicles();
    } else {
      console.warn('SearchResults - No vehicleSearch data found in initialData');
      setError('No search criteria provided. Please go back and search again.');
      setIsLoadingResults(false);
    }
  }, [initialData?.vehicleSearch, pagination.currentPage, sortBy, sortDir]);

  const searchVehicles = async (page = 0) => {
    setIsLoadingResults(true);
    setError(null);
    
    try {
      const searchParams = initialData.vehicleSearch;
      const queryParams = new URLSearchParams();
      
      if (searchParams.make) queryParams.append('make', searchParams.make);
      if (searchParams.model) queryParams.append('model', searchParams.model);
      if (searchParams.bodyType) queryParams.append('bodyType', searchParams.bodyType);
      if (searchParams.fuelType) queryParams.append('fuelType', searchParams.fuelType);
      if (searchParams.province) queryParams.append('province', searchParams.province);
      
      if (searchParams.yearRange && searchParams.yearRange.length === 2) {
        queryParams.append('minYear', searchParams.yearRange[0].toString());
        queryParams.append('maxYear', searchParams.yearRange[1].toString());
      }
      
      if (searchParams.priceRange && searchParams.priceRange.length === 2) {
        queryParams.append('minPrice', searchParams.priceRange[0].toString());
        queryParams.append('maxPrice', searchParams.priceRange[1].toString());
      }
      
      if (searchParams.mileageMax) {
        queryParams.append('maxMileage', searchParams.mileageMax.toString());
      }
      
      queryParams.append('page', page.toString());
      queryParams.append('size', '20');
      queryParams.append('sortBy', sortBy);
      queryParams.append('sortDir', sortDir);
      
      console.log('SearchResults - Making API call to:', `http://localhost:8080/api/vehicles/search?${queryParams}`);
      
      const response = await fetch(`http://localhost:8080/api/vehicles/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`Failed to search vehicles: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('SearchResults - API response:', data);
      
      setVehicles(data.vehicles || []);
      setPagination(data.pagination || {
        currentPage: 0,
        totalPages: 1,
        totalElements: 0,
        pageSize: 20,
      });
      
    } catch (err) {
      console.error('SearchResults - API Error:', err);
      
      // Provide mock data for development when backend is not available
      const isFetchError = err instanceof Error && err.message.includes('Failed to fetch');
      
      if (isFetchError) {
        console.log('SearchResults - Backend not available, using mock data');
        const mockVehicles: Vehicle[] = [
          {
            id: 1,
            usedVehicleStockId: 1001,
            year: 2020,
            makeName: initialData?.vehicleSearch?.make || 'BMW',
            modelName: initialData?.vehicleSearch?.model || 'X3',
            variantName: '2.0i xDrive',
            price: 650000,
            mileage: 45000,
            colour: 'Alpine White',
            provinceName: 'Gauteng',
            bodyType: 'SUV',
            transmission: 'Automatic',
            fuelType: 'Petrol',
            engineSize: '2.0L',
            condition: 'Excellent'
          },
          {
            id: 2,
            usedVehicleStockId: 1002,
            year: 2019,
            makeName: initialData?.vehicleSearch?.make || 'Mercedes-Benz',
            modelName: initialData?.vehicleSearch?.model || 'C-Class',
            variantName: 'C200 AMG Line',
            price: 580000,
            mileage: 32000,
            colour: 'Obsidian Black',
            provinceName: 'Western Cape',
            bodyType: 'Sedan',
            transmission: 'Automatic',
            fuelType: 'Petrol',
            engineSize: '2.0L',
            condition: 'Excellent'
          },
          {
            id: 3,
            usedVehicleStockId: 1003,
            year: 2021,
            makeName: initialData?.vehicleSearch?.make || 'Audi',
            modelName: initialData?.vehicleSearch?.model || 'A4',
            variantName: '2.0T FSI Advanced',
            price: 720000,
            mileage: 28000,
            colour: 'Glacier White',
            provinceName: 'KwaZulu-Natal',
            bodyType: 'Sedan',
            transmission: 'Automatic',
            fuelType: 'Petrol',
            engineSize: '2.0L',
            condition: 'Excellent'
          }
        ];
        
        setVehicles(mockVehicles);
        setPagination({
          currentPage: 0,
          totalPages: 1,
          totalElements: mockVehicles.length,
          pageSize: 20,
        });
        setError(null); // Clear error since we're showing mock data
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred while searching');
      }
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleSubmit = () => {
    if (!selectedVehicle) {
      alert('Please select a vehicle to continue');
      return;
    }
    
    console.log('SearchResults - Submitting with selected vehicle:', selectedVehicle);
    
    onSubmit({
      ...initialData,
      selectedVehicle: selectedVehicle,
      nextStep: 'BuyingConfirmation', // Define next step
      action: 'vehicle-selected',
      intent: 'buying'
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(prev => ({ ...prev, currentPage: value - 1 }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoadingResults && vehicles.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>
              Searching for vehicles...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Box display="flex" justifyContent="space-between">
            {onBack && (
              <Button variant="outlined" onClick={onBack}>
                Back to Search
              </Button>
            )}
            <Button variant="contained" onClick={() => searchVehicles()}>
              Try Again
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const message = initialData?.message || "Here are vehicles matching your criteria";
  const total = pagination.totalElements;

  return (
    <Box sx={{ 
      maxWidth: 1200, 
      mx: 'auto', 
      py: 6,
      px: 3
    }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
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
          </Box>
          
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="year">Year</MenuItem>
                <MenuItem value="mileage">Mileage</MenuItem>
                <MenuItem value="makeName">Make</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortDir}
                label="Order"
                onChange={(e) => setSortDir(e.target.value)}
              >
                <MenuItem value="asc">Low to High</MenuItem>
                <MenuItem value="desc">High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
      </Box>

      {/* Vehicle Grid */}
      {vehicles.length === 0 ? (
        <Box textAlign="center" py={8}>
          <DirectionsCar sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No vehicles found
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Try adjusting your search criteria to find more results
          </Typography>
          {onBack && (
            <Button variant="contained" onClick={onBack}>
              Modify Search
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {vehicles.map((vehicle) => (
              <Grid item xs={12} md={6} lg={4} key={vehicle.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    border: selectedVehicle?.id === vehicle.id 
                      ? '2px solid #007AFF' 
                      : '1px solid #e0e0e0',
                    boxShadow: selectedVehicle?.id === vehicle.id
                      ? '0 8px 24px rgba(0, 122, 255, 0.15)'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-4px)',
                    }
                  }}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  <CardContent sx={{ 
                    p: 3, 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Vehicle Title */}
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box>
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
                          {vehicle.year} {vehicle.makeName} {vehicle.modelName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vehicle.variantName}
                        </Typography>
                      </Box>
                      <Chip 
                        label={vehicle.condition} 
                        size="small" 
                        color={vehicle.condition === 'Excellent' ? 'success' : 'default'}
                      />
                    </Box>
                    
                    {/* Location */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.provinceName}
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
                      {formatPrice(vehicle.price)}
                    </Typography>

                    {/* Specs */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap',
                      gap: 1,
                      mb: 3,
                      pb: 3,
                      borderBottom: '1px solid #f0f0f0'
                    }}>
                      <Chip 
                        icon={<Speed />} 
                        label={`${vehicle.mileage?.toLocaleString() || 'N/A'} km`} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        icon={<LocalGasStation />} 
                        label={vehicle.fuelType} 
                        size="small" 
                        variant="outlined" 
                      />
                      <Chip 
                        icon={<Settings />} 
                        label={vehicle.transmission} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>

                    {/* Additional Info */}
                    <Box sx={{ mt: 'auto' }}>
                      <Typography variant="body2" color="text.secondary">
                        {vehicle.colour} • {vehicle.bodyType} • {vehicle.engineSize}
                      </Typography>
                      {selectedVehicle?.id === vehicle.id && (
                        <Chip label="Selected" color="primary" size="small" sx={{ mt: 1 }} />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage + 1}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

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
