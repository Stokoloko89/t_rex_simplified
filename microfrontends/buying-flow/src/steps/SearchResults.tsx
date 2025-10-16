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
  imageUrl?: string;
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
  const [modalVehicle, setModalVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // Handle Escape key to close modals
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isImageViewerOpen) {
          handleImageViewerClose();
        } else if (isModalOpen) {
          handleModalClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isImageViewerOpen, isModalOpen]);

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
            condition: 'Excellent',
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
            condition: 'Excellent',
            imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
            condition: 'Excellent',
            imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
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
    setModalVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalVehicle(null);
  };

  const handleModalSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicles(prev => {
      // Check if vehicle is already selected
      const isAlreadySelected = prev.some(v => v.id === vehicle.id);
      if (isAlreadySelected) {
        return prev;
      }
      return [...prev, vehicle];
    });
    setIsModalOpen(false);
  };

  const handleUnselectVehicle = (vehicleId: number) => {
    setSelectedVehicles(prev => prev.filter(v => v.id !== vehicleId));
  };

  const isVehicleSelected = (vehicleId: number): boolean => {
    return selectedVehicles.some(v => v.id === vehicleId);
  };

  const handleImageClick = (index: number = 0) => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const handleImageViewerClose = () => {
    setIsImageViewerOpen(false);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (modalVehicle) {
      const images = getVehicleImages(modalVehicle);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevImage = () => {
    if (modalVehicle) {
      const images = getVehicleImages(modalVehicle);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const getVehicleImages = (vehicle: Vehicle): string[] => {
    // For now, return the single image or fallback
    // In production, this would return an array of multiple images
    const images = [];
    if (vehicle.imageUrl) {
      images.push(vehicle.imageUrl);
    }
    // Add fallback image
    images.push('https://images.unsplash.com/photo-1591293836027-e05b48473b67?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
    
    // Add more mock images for demonstration
    images.push('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop');
    images.push('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop');
    
    return images;
  };

  const handleSubmit = () => {
    if (selectedVehicles.length === 0) {
      alert('Please select at least one vehicle to continue');
      return;
    }
    
    console.log('SearchResults - Submitting with selected vehicles:', selectedVehicles);
    
    onSubmit({
      ...initialData,
      selectedVehicles: selectedVehicles,
      nextStep: 'BuyingConfirmation', // Define next step
      action: 'vehicle-selected',
      intent: 'buying'
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPagination(prev => ({ ...prev, currentPage: value - 1 }));
    searchVehicles(value - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <Box sx={{ 
            maxHeight: '70vh', 
            overflowY: 'auto',
            pr: 1,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#1e3a8a',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#1e40af',
              },
            },
          }}>
            <Grid container spacing={4}>
            {vehicles.map((vehicle) => (
              <Grid item xs={12} md={6} lg={6} key={vehicle.id}>
                <Card 
                  sx={{ 
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease-in-out',
                    border: isVehicleSelected(vehicle.id) 
                      ? '2px solid #1e3a8a' 
                      : '1px solid #e0e0e0',
                    boxShadow: isVehicleSelected(vehicle.id)
                      ? '0 8px 24px rgba(30, 58, 138, 0.15)'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-4px)',
                    }
                  }}
                  onClick={() => handleVehicleSelect(vehicle)}
                >
                  {/* Vehicle Image */}
                  <Box sx={{
                    height: 200,
                    backgroundImage: vehicle.imageUrl
                      ? `url(${vehicle.imageUrl})`
                      : `url(https://images.unsplash.com/photo-1591293836027-e05b48473b67?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
                    }
                  }}>
                    {/* Image overlay for selected state */}
                    {isVehicleSelected(vehicle.id) && (
                      <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: '#1e3a8a',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        zIndex: 1
                      }}>
                        Selected
                      </Box>
                    )}
                  </Box>

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
                        color: '#1e3a8a',
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
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            </Grid>
          </Box>

          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage + 1}
                onChange={handlePageChange}
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#666',
                    '&.Mui-selected': {
                      backgroundColor: '#1e3a8a',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#1e40af'
                      }
                    },
                    '&:hover': {
                      backgroundColor: '#f0f0f0'
                    }
                  }
                }}
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
          disabled={isLoading || selectedVehicles.length === 0}
          sx={{ 
            ml: 'auto',
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            backgroundColor: '#1e3a8a',
            color: '#ffffff',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1e40af',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)'
            },
            '&:disabled': {
              backgroundColor: '#d0d0d0',
              color: '#999'
            }
          }}
        >
          Continue with {selectedVehicles.length > 0 ? `${selectedVehicles.length} ` : ''}Selected Vehicle{selectedVehicles.length !== 1 ? 's' : ''}
        </Button>
        {selectedVehicles.length > 0 && (
          <Button 
            variant="outlined" 
            onClick={() => setSelectedVehicles([])}
            disabled={isLoading}
            sx={{
              ml: 2,
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              py: 1.5,
              borderColor: '#ff4444',
              color: '#ff4444',
              '&:hover': {
                borderColor: '#cc0000',
                backgroundColor: '#fff5f5',
                color: '#cc0000'
              }
            }}
          >
            Clear All ({selectedVehicles.length})
          </Button>
        )}
      </Box>

      {/* Vehicle Detail Modal */}
      {isModalOpen && modalVehicle && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            p: 2,
          }}
          onClick={handleModalClose}
        >
          <Card
            sx={{
              maxWidth: 800,
              maxHeight: '90vh',
              width: '100%',
              overflow: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
              onClick={handleModalClose}
            >
              ✕
            </Box>

            {/* Vehicle Image */}
            <Box 
              sx={{
                height: 300,
                backgroundImage: modalVehicle.imageUrl
                  ? `url(${modalVehicle.imageUrl})`
                  : `url(https://images.unsplash.com/photo-1591293836027-e05b48473b67?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                cursor: 'pointer',
                '&:hover::before': {
                  content: '"🔍 Click to view images"',
                  position: 'absolute',
                  bottom: 16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                }
              }}
              onClick={() => handleImageClick(0)}
            >
              {/* Selected indicator */}
              {isVehicleSelected(modalVehicle.id) && (
                <Box sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  backgroundColor: '#1e3a8a',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                }}>
                  Currently Selected
                </Box>
              )}
            </Box>

            <CardContent sx={{ p: 4 }}>
              {/* Vehicle Header */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                  {modalVehicle.year} {modalVehicle.makeName} {modalVehicle.modelName}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {modalVehicle.variantName}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Chip
                    label={modalVehicle.condition}
                    color={modalVehicle.condition === 'Excellent' ? 'success' : 'default'}
                    size="medium"
                  />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
                    {formatPrice(modalVehicle.price)}
                  </Typography>
                </Box>
              </Box>

              {/* Vehicle Details Grid */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Vehicle Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationOn sx={{ color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Location:</strong> {modalVehicle.provinceName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Speed sx={{ color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Mileage:</strong> {modalVehicle.mileage.toLocaleString()} km
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalGasStation sx={{ color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Fuel Type:</strong> {modalVehicle.fuelType}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Settings sx={{ color: 'text.secondary' }} />
                      <Typography variant="body1">
                        <strong>Transmission:</strong> {modalVehicle.transmission}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Specifications
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography variant="body1">
                      <strong>Body Type:</strong> {modalVehicle.bodyType}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Engine Size:</strong> {modalVehicle.engineSize}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Colour:</strong> {modalVehicle.colour}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Stock ID:</strong> #{modalVehicle.usedVehicleStockId}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Description/Features */}
              <Box sx={{ mb: 4, p: 3, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  About This Vehicle
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  This {modalVehicle.year} {modalVehicle.makeName} {modalVehicle.modelName} is in {modalVehicle.condition.toLowerCase()} condition with {modalVehicle.mileage.toLocaleString()} kilometers on the odometer.
                  It features {modalVehicle.fuelType.toLowerCase()} fuel type with {modalVehicle.transmission.toLowerCase()} transmission.
                  Located in {modalVehicle.provinceName}, this vehicle offers excellent value for money.
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                pt: 3,
                borderTop: '1px solid #e0e0e0'
              }}>
                <Button
                  variant="outlined"
                  onClick={handleModalClose}
                  sx={{ px: 4, py: 1.5 }}
                >
                  Close
                </Button>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  {isVehicleSelected(modalVehicle.id) ? (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleUnselectVehicle(modalVehicle.id);
                        handleModalClose();
                      }}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderColor: '#ff4444',
                        color: '#ff4444',
                        '&:hover': {
                          borderColor: '#cc0000',
                          backgroundColor: '#fff5f5',
                          color: '#cc0000'
                        }
                      }}
                    >
                      Unselect Vehicle
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleModalSelectVehicle(modalVehicle)}
                      sx={{
                        px: 4,
                        py: 1.5,
                        backgroundColor: '#1e3a8a',
                        color: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#1e40af',
                        }
                      }}
                    >
                      Select this vehicle
                    </Button>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Image Viewer Modal */}
      {isImageViewerOpen && modalVehicle && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            p: 2,
          }}
          onClick={handleImageViewerClose}
        >
          {/* Close Button */}
          <Box
            sx={{
              position: 'absolute',
              top: 24,
              right: 24,
              zIndex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              fontSize: '24px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
            onClick={handleImageViewerClose}
          >
            ✕
          </Box>

          {/* Image Counter */}
          <Box
            sx={{
              position: 'absolute',
              top: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              px: 3,
              py: 1,
              borderRadius: 2,
              fontSize: '0.875rem',
            }}
          >
            {currentImageIndex + 1} / {getVehicleImages(modalVehicle).length}
          </Box>

          {/* Previous Button */}
          {getVehicleImages(modalVehicle).length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                left: 24,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '32px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              ‹
            </Box>
          )}

          {/* Image */}
          <Box
            component="img"
            src={getVehicleImages(modalVehicle)[currentImageIndex]}
            alt={`${modalVehicle.year} ${modalVehicle.makeName} ${modalVehicle.modelName}`}
            sx={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 2,
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          {getVehicleImages(modalVehicle).length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                right: 24,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '32px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              ›
            </Box>
          )}

          {/* Image Thumbnails */}
          {getVehicleImages(modalVehicle).length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                p: 1.5,
                borderRadius: 2,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {getVehicleImages(modalVehicle).map((img, index) => (
                <Box
                  key={index}
                  component="img"
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: currentImageIndex === index ? '3px solid #1e3a8a' : '3px solid transparent',
                    opacity: currentImageIndex === index ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default SearchResults;
