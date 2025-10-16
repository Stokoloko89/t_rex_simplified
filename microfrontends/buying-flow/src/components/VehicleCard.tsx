import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack, Avatar, IconButton } from '@mui/material';
import { DirectionsCar, LocalGasStation, Speed, Engineering, Phone, Directions, FavoriteBorder, Favorite } from '@mui/icons-material';
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = 7; // Mock carousel with 7 images

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        '&:hover': onClick ? {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderColor: 'primary.main',
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 0 }}>
        {/* Horizontal Layout */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, position: 'relative' }}>
          {/* Left: Image Section with Carousel */}
          <Box sx={{ 
            position: 'relative',
            width: { xs: '100%', md: '280px' },
            flexShrink: 0,
            backgroundColor: '#f5f5f5'
          }}>
            {/* Favorite Button */}
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 2,
                backgroundColor: 'white',
                '&:hover': { backgroundColor: 'white' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {isFavorite ? (
                <Favorite sx={{ color: 'error.main' }} />
              ) : (
                <FavoriteBorder sx={{ color: 'text.secondary' }} />
              )}
            </IconButton>

            {/* Car Image */}
            <Box
              component="img"
              src={vehicle.image || 'https://via.placeholder.com/280x200?text=Vehicle'}
              alt={`${vehicle.make} ${vehicle.model}`}
              sx={{
                width: '100%',
                height: { xs: 200, md: '100%' },
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Navigation Arrows */}
            <IconButton
              onClick={handlePrevImage}
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(51, 51, 51, 0.8)',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': { backgroundColor: 'rgba(51, 51, 51, 0.95)' }
              }}
            >
              <Box component="span" sx={{ fontSize: 20, fontWeight: 'bold' }}>‹</Box>
            </IconButton>
            <IconButton
              onClick={handleNextImage}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(51, 51, 51, 0.8)',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': { backgroundColor: 'rgba(51, 51, 51, 0.95)' }
              }}
            >
              <Box component="span" sx={{ fontSize: 20, fontWeight: 'bold' }}>›</Box>
            </IconButton>

            {/* Carousel Dots */}
            <Box sx={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.75,
              zIndex: 1
            }}>
              {Array.from({ length: totalImages }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index === currentImageIndex ? 'secondary.main' : 'rgba(255,255,255,0.6)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Right: Content Section */}
          <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
            {/* Top Row: Title and Price */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 1
              }}>
                {vehicle.make} {vehicle.model}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 700,
                  color: 'text.primary'
                }}>
                  {formatCurrency(vehicle.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price
                </Typography>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: 'info.main',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    cursor: 'help'
                  }}
                  title="Price information"
                >
                  i
                </Box>
              </Box>

              {/* Specs Row */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Engineering sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatPower(vehicle.power)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCar sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {vehicle.year}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalGasStation sx={{ fontSize: 20, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formatFuelConsumption(vehicle.fuelConsumption)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Bottom Row: Location and Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 'auto',
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Box component="span" sx={{ fontSize: 16 }}>📍</Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {vehicle.location.split(' ')[0]}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  {vehicle.location}
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      borderColor: 'primary.main',
                      '& svg': { color: 'white' }
                    }
                  }}
                >
                  <Phone sx={{ fontSize: 20, color: 'text.secondary' }} />
                </IconButton>
                <IconButton
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      borderColor: 'primary.main',
                      '& svg': { color: 'white' }
                    }
                  }}
                >
                  <Directions sx={{ fontSize: 20, color: 'text.secondary' }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
