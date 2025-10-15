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
      name: initialData?.userInfo?.name || initialData?.contactInfo?.name || '',
      email: initialData?.userInfo?.email || initialData?.contactInfo?.email || '',
      phone: initialData?.userInfo?.phone || initialData?.contactInfo?.phone || '',
      preferredContact: initialData?.userInfo?.preferredContact || initialData?.contactInfo?.preferredContact || 'email',
      comments: initialData?.userInfo?.comments || initialData?.contactInfo?.comments || '',
    }
  });

  const selectedVehicles = initialData?.selectedVehicles || (initialData?.selectedVehicle ? [initialData.selectedVehicle] : []);
  const message = initialData?.message || "Confirm your vehicle selection and provide contact details";

  const onFormSubmit = (formData: any) => {
    onSubmit({
      ...initialData,
      contactInfo: formData,
      selectedVehicles: selectedVehicles,
      confirmed: true,
      nextStep: 'BuyingComplete',
      action: 'contact-submitted',
      intent: 'complete-purchase'
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
        {/* Selected Vehicles Summary */}
        {selectedVehicles.length > 0 && (
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {selectedVehicles.map((vehicle: any, index: number) => (
                <Card key={vehicle.id || index} sx={{ 
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}>
                  {vehicle.imageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={vehicle.imageUrl}
                      alt={`${vehicle.makeName} ${vehicle.modelName}`}
                      sx={{ 
                        objectFit: 'cover',
                        borderBottom: '1px solid #e0e0e0'
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        fontWeight: 600,
                        color: '#1a1a1a'
                      }}
                    >
                      <DirectionsCar sx={{ mr: 1.5, color: '#1e3a8a' }} />
                      {selectedVehicles.length > 1 ? `Vehicle ${index + 1} of ${selectedVehicles.length}` : 'Selected Vehicle'}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: '#1a1a1a' }}>
                        {vehicle.year} {vehicle.makeName} {vehicle.modelName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {vehicle.variantName}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e3a8a' }}>
                        R{vehicle.price?.toLocaleString()}
                      </Typography>
                    </Box>

                    <Stack spacing={1.5} sx={{ pt: 2, borderTop: '1px solid #f0f0f0' }}>
                      {vehicle.fuelType && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocalGasStation sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">Fuel Type:</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {vehicle.fuelType}
                          </Typography>
                        </Box>
                      )}

                      {vehicle.mileage && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Speed sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">Mileage:</Typography>
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {vehicle.mileage.toLocaleString()} km
                          </Typography>
                        </Box>
                      )}

                      {vehicle.provinceName && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Location:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {vehicle.provinceName}
                          </Typography>
                        </Box>
                      )}

                      {vehicle.colour && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Colour:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {vehicle.colour}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
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
                <Person sx={{ mr: 1.5, color: '#1e3a8a' }} />
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
                        backgroundColor: '#1e3a8a',
                        color: '#ffffff',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#1e40af',
                          boxShadow: '0 4px 12px rgba(30, 58, 138, 0.25)'
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
