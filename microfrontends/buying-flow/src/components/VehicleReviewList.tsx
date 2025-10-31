import React from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * VehicleReviewList Component
 * Displays all selected vehicles (2-4) for review before contact request submission
 */

export interface Vehicle {
  id: number;
  makeName: string;
  modelName: string;
  year: number;
  price: number | null;
  mileage: number | null;
  transmission: string | null;
  fuelType: string | null;
  colour: string | null;
  bodyType?: string | null;
  imageUrl?: string;
}

interface VehicleReviewListProps {
  selectedVehicles: Vehicle[];
  onBackToSelection?: () => void;
  isEditable?: boolean;
}

export const VehicleReviewList: React.FC<VehicleReviewListProps> = ({
  selectedVehicles,
  onBackToSelection,
  isEditable = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handle empty state
  if (!selectedVehicles || selectedVehicles.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          padding: 4,
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.secondary,
            fontWeight: 500,
        }}
        >
          No vehicles selected
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            marginTop: 1,
          }}
        >
          Please go back and select at least 1 vehicle to proceed
        </Typography>
        {onBackToSelection && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackToSelection}
            variant="outlined"
            sx={{ marginTop: 2 }}
          >
            Back to Selection
          </Button>
        )}
      </Paper>
    );
  }

  // Handle max selection state
  const isMaxSelected = selectedVehicles.length === 4;

  return (
    <Box sx={{ width: '100%', marginBottom: 4 }}>
      {/* Header Section */}
      <Box sx={{ marginBottom: 3 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            marginBottom: 1,
          }}
        >
          Review Your Selected Vehicles
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            marginBottom: 2,
          }}
        >
          You have selected {selectedVehicles.length} vehicle{selectedVehicles.length !== 1 ? 's' : ''}
          {isMaxSelected ? ' (maximum reached)' : ''}
        </Typography>

        {/* Info Alert */}
        <Alert
          severity="info"
          sx={{
            marginBottom: 2,
            backgroundColor: '#e3f2fd',
            color: theme.palette.text.primary,
            '& .MuiAlert-icon': {
              color: theme.palette.info.main,
            },
          }}
        >
          These vehicles will be included in your contact request. The dealership will
          follow up with you about your selected vehicles.
        </Alert>
      </Box>

      {/* Vehicles Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: isMobile ? 2 : 3,
          marginBottom: 3,
        }}
      >
        {selectedVehicles.map((vehicle, index) => (
          <Box key={vehicle.id} sx={{ position: 'relative' }}>
            {/* Selection Number Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 10,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '0.875rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              {index + 1}
            </Box>

            {/* Vehicle Card */}
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: `2px solid ${theme.palette.primary.main}`,
                transition: 'all 0.3s ease',
              }}
            >
              {/* Image Section */}
              <CardMedia
                component="img"
                height={isMobile ? 200 : 250}
                image={vehicle.imageUrl || 'https://via.placeholder.com/400x250?text=Vehicle'}
                alt={`${vehicle.year} ${vehicle.makeName} ${vehicle.modelName}`}
                sx={{
                  objectFit: 'cover',
                  backgroundColor: '#e0e0e0',
                }}
              />

              {/* Content Section */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  padding: 2,
                }}
              >
                {/* Title: Make, Model, Year */}
                <Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      marginBottom: 0.5,
                    }}
                  >
                    {vehicle.year} {vehicle.makeName} {vehicle.modelName}
                  </Typography>
                  {vehicle.bodyType && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: '0.875rem',
                      }}
                    >
                      {vehicle.bodyType}
                    </Typography>
                  )}
                </Box>

                {/* Key Details */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 1,
                  }}
                >
                  {/* Price */}
                  {vehicle.price && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.5px',
                        }}
                      >
                        Price
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          fontSize: '1rem',
                        }}
                      >
                        R{vehicle.price.toLocaleString('en-ZA')}
                      </Typography>
                    </Box>
                  )}

                  {/* Mileage */}
                  {vehicle.mileage !== null && vehicle.mileage !== undefined && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          letterSpacing: '0.5px',
                        }}
                      >
                        Mileage
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {vehicle.mileage.toLocaleString('en-ZA')} km
                      </Typography>
                    </Box>
                  )}
                </Box>

                {/* Specs Row */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {vehicle.transmission && (
                    <Chip
                      label={vehicle.transmission}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 28,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                  {vehicle.fuelType && (
                    <Chip
                      label={vehicle.fuelType}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 28,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                  {vehicle.colour && (
                    <Chip
                      label={vehicle.colour}
                      size="small"
                      variant="outlined"
                      sx={{
                        height: 28,
                        fontSize: '0.75rem',
                      }}
                    />
                  )}
                </Box>

                {/* Selection Badge */}
                <Box
                  sx={{
                    marginTop: 'auto',
                    paddingTop: 1,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '4px',
                      backgroundColor: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      ✓
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    }}
                  >
                    Selected
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Actions Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        {onBackToSelection && isEditable && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackToSelection}
            variant="outlined"
            sx={{
              order: isMobile ? 2 : 1,
            }}
          >
            Back to Selection
          </Button>
        )}

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            flex: 1,
            textAlign: isMobile ? 'center' : 'right',
            order: isMobile ? 1 : 2,
          }}
        >
          {isMaxSelected ? (
            <strong>You have selected the maximum number of vehicles (4)</strong>
          ) : (
            `You can select ${4 - selectedVehicles.length} more vehicle${4 - selectedVehicles.length !== 1 ? 's' : ''}`
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default VehicleReviewList;
