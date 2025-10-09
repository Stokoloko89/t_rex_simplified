import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, TextField, Grid, Divider, Alert, CardMedia } from '@mui/material';
import { CheckCircle, Person, Email, Phone, DirectionsCar, LocalGasStation, Speed } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { formatCurrency, formatFuelConsumption, formatDistance } from '@t-rex/shared-ui';

interface BuyingConfirmationProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const schema = yup.object({
  name: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  preferredContact: yup.string().required('Preferred contact method is required'),
  comments: yup.string(),
});

const BuyingConfirmation: React.FC<BuyingConfirmationProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      preferredContact: 'email',
      comments: '',
    }
  });

  const selectedVehicle = initialData?.selectedVehicle;
  const message = initialData?.message || "Confirm your vehicle selection and provide contact details";

  const onFormSubmit = (formData: any) => {
    onSubmit({
      contactInfo: formData,
      selectedVehicle: selectedVehicle,
      confirmed: true
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 6, px: 3 }}>
      <Box sx={{ mb: 6 }}>
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
          Confirm Your Selection
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 3, fontSize: '1rem', lineHeight: 1.6 }}
        >
          {message}
        </Typography>
        <Divider />
      </Box>

      <Grid container spacing={4}>
        {/* Vehicle Summary */}
        {selectedVehicle && (
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '100%',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              {selectedVehicle.image && (
                <CardMedia
                  component="img"
                  height="240"
                  image={selectedVehicle.image}
                  alt={`${selectedVehicle.make} ${selectedVehicle.model}`}
                  sx={{ 
                    objectFit: 'cover',
                    borderBottom: '1px solid #e0e0e0'
                  }}
                />
              )}
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    display: 'flex', 
                    alignItems: 'center',
                    fontWeight: 600,
                    color: '#1a1a1a'
                  }}
                >
                  <DirectionsCar sx={{ mr: 1.5, color: '#007AFF' }} />
                  Selected Vehicle
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, color: '#1a1a1a' }}>
                    {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#007AFF' }}>
                    {selectedVehicle.price ? formatCurrency(selectedVehicle.price) : selectedVehicle.price}
                  </Typography>
                </Box>

                <Stack spacing={2} sx={{ pt: 2, borderTop: '1px solid #f0f0f0' }}>
                  {selectedVehicle.fuelConsumption && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalGasStation sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">Fuel Economy:</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatFuelConsumption(selectedVehicle.fuelConsumption)}
                      </Typography>
                    </Box>
                  )}

                  {selectedVehicle.mileage && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Speed sx={{ mr: 1, fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">Mileage:</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDistance(selectedVehicle.mileage)}
                      </Typography>
                    </Box>
                  )}

                  {selectedVehicle.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Rating:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedVehicle.rating}/5 ⭐
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 600,
                  color: '#1a1a1a'
                }}
              >
                <Person sx={{ mr: 1.5, color: '#007AFF' }} />
                Contact Information
              </Typography>

              <form onSubmit={handleSubmit(onFormSubmit)}>
                <Stack spacing={3}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Full Name"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        InputProps={{
                          startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email Address"
                        type="email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="preferredContact"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Preferred Contact Method"
                        fullWidth
                        SelectProps={{ native: true }}
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="text">Text Message</option>
                      </TextField>
                    )}
                  />

                  <Controller
                    name="comments"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Additional Comments (Optional)"
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Any specific questions or requirements..."
                      />
                    )}
                  />

                  <Alert severity="info">
                    <Typography variant="body2">
                      By submitting this form, you agree to be contacted by our dealer partners regarding this vehicle inquiry.
                    </Typography>
                  </Alert>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
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
                      type="submit"
                      variant="contained" 
                      disabled={isLoading || !isValid}
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
                      Submit Request
                    </Button>
                  </Box>
                </Stack>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BuyingConfirmation;
