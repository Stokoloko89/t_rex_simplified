import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  TextField, 
  Grid, 
  Divider, 
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert
} from '@mui/material';
import { 
  DirectionsCar, 
  Business, 
  Speed, 
  Palette,
  CalendarToday,
  Assessment
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface VehicleData {
  MKT?: string;
  Id?: number;
  usedVehicleStockID?: number;
  year?: number;
  makeName?: string;
  modelName?: string;
  variantName?: string;
  vin?: string;
  registration?: string;
  mmCode?: string | null;
  engineNo?: string;
  milage?: number;
  colour?: string;
  provinceName?: string;
  trim?: string | null;
  condition?: string | null;
  stockCode?: string;
  department?: string;
  currencySymbol?: string;
  price?: number;
  firstPrice?: number;
  franchise?: string;
  extras?: string | null;
  comments?: string;
}

interface VehicleSellingFormProps {
  initialData?: {
    vehicleData?: VehicleData;
    personData?: any;
  };
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const schema = yup.object({
  makeName: yup.string().required('Vehicle make is required'),
  modelName: yup.string().required('Vehicle model is required'),
  year: yup
    .number()
    .required('Year is required')
    .min(1990, 'Year must be 1990 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
  milage: yup
    .number()
    .required('Current mileage is required')
    .min(0, 'Mileage cannot be negative')
    .max(1000000, 'Please enter a valid mileage'),
  condition: yup
    .string()
    .required('Vehicle condition is required')
    .oneOf(['excellent', 'good', 'fair', 'poor'], 'Please select a valid condition'),
  registration: yup.string(),
  colour: yup.string(),
  provinceName: yup.string(),
  comments: yup.string().max(500, 'Comments must be less than 500 characters'),
});

const VehicleSellingForm: React.FC<VehicleSellingFormProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const vehicleData = initialData?.vehicleData || {};

  const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      makeName: vehicleData.makeName || '',
      modelName: vehicleData.modelName || '',
      year: vehicleData.year || new Date().getFullYear(),
      milage: vehicleData.milage || '',
      condition: vehicleData.condition || 'good',
      registration: vehicleData.registration || '',
      colour: vehicleData.colour || '',
      provinceName: vehicleData.provinceName || '',
      comments: vehicleData.comments || '',
    }
  });

  const watchedData = watch();

  const onFormSubmit = (formData: any) => {
    const submissionData = {
      ...vehicleData, // Keep existing vehicle data
      ...formData, // Override with form data
      submittedAt: new Date().toISOString(),
      department: 'Used',
      MKT: 'MCV',
      currencySymbol: 'R',
    };

    onSubmit({
      vehicleData: submissionData,
      formType: 'vehicle-selling',
      nextStep: 'dealer-network'
    });
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', py: 4, px: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: '#333333',
            mb: 2,
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Business sx={{ mr: 2, color: '#ffc107', fontSize: '2rem' }} />
          Dealer Network
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.6 }}
        >
          We'll help you find buyers through our dealer network
        </Typography>
        <Divider />
      </Box>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Stack spacing={4}>
          {/* Vehicle Information Card */}
          <Card sx={{ border: '2px solid #ffc107', boxShadow: '0 4px 12px rgba(255,193,7,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 700,
                  color: '#333333'
                }}
              >
                <DirectionsCar sx={{ mr: 1.5, color: '#ffc107' }} />
                Vehicle Information
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="makeName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Make"
                        placeholder="e.g., Toyota, BMW, Ford"
                        fullWidth
                        error={!!errors.makeName}
                        helperText={errors.makeName?.message}
                        InputProps={{
                          sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="modelName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Model"
                        placeholder="e.g., Corolla, X3, Focus"
                        fullWidth
                        error={!!errors.modelName}
                        helperText={errors.modelName?.message}
                        InputProps={{
                          sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="year"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Year"
                        placeholder="e.g., 2020"
                        fullWidth
                        error={!!errors.year}
                        helperText={errors.year?.message}
                        InputProps={{
                          sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="milage"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Current Mileage (km)"
                        placeholder="e.g., 85000"
                        fullWidth
                        error={!!errors.milage}
                        helperText={errors.milage?.message || "Enter the current odometer reading"}
                        InputProps={{
                          sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' },
                          startAdornment: <Speed sx={{ mr: 1, color: '#ffc107' }} />
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Vehicle Condition Card */}
          <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 700,
                  color: '#333333'
                }}
              >
                <Assessment sx={{ mr: 1.5, color: '#ffc107' }} />
                Vehicle Condition
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Overall condition of your vehicle:
              </Typography>

              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <FormControl component="fieldset" error={!!errors.condition}>
                    <RadioGroup
                      {...field}
                      row={false}
                      sx={{ gap: 2 }}
                    >
                      <FormControlLabel 
                        value="excellent" 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Excellent - Like new, no visible wear
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Minimal use, well maintained, no damage
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel 
                        value="good" 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Good - Minor wear, well maintained
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Normal wear and tear, good mechanical condition
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel 
                        value="fair" 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Fair - Some wear and tear, needs minor repairs
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Visible wear, may need minor maintenance or repairs
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel 
                        value="poor" 
                        control={<Radio />} 
                        label={
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              Poor - Significant wear, needs major repairs
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Major repairs needed, significant wear or damage
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                    {errors.condition && (
                      <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        {errors.condition.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card sx={{ border: '1px solid #e0e0e0' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 3, 
                  fontWeight: 700,
                  color: '#333333'
                }}
              >
                Additional Details (Optional)
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="registration"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Registration Number"
                        placeholder="e.g., CA 123 456"
                        fullWidth
                        InputProps={{
                          sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="colour"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Color"
                        placeholder="e.g., White, Black, Silver"
                        fullWidth
                        InputProps={{
                          sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' },
                          startAdornment: <Palette sx={{ mr: 1, color: '#ffc107' }} />
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="provinceName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Province"
                        placeholder="e.g., Gauteng, Western Cape"
                        fullWidth
                        InputProps={{
                          sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="comments"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Additional Comments"
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Any additional details about your vehicle (optional)..."
                        error={!!errors.comments}
                        helperText={errors.comments?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Vehicle Preview */}
          {(watchedData.makeName || watchedData.modelName || watchedData.year) && (
            <Alert severity="info" sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                Vehicle Summary:
              </Typography>
              <Typography variant="body2">
                {watchedData.year} {watchedData.makeName} {watchedData.modelName}
                {watchedData.milage && ` • ${Number(watchedData.milage).toLocaleString()} km`}
                {watchedData.condition && ` • ${watchedData.condition.charAt(0).toUpperCase() + watchedData.condition.slice(1)} condition`}
                {watchedData.colour && ` • ${watchedData.colour}`}
              </Typography>
            </Alert>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
            {onBack && (
              <Button 
                variant="outlined" 
                onClick={onBack}
                disabled={isLoading}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderColor: '#ddd',
                  color: '#666',
                  '&:hover': { borderColor: '#999', backgroundColor: '#f5f5f5' }
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
                fontWeight: 700,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                backgroundColor: '#ffc107',
                color: '#333333',
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#e6ac00',
                  boxShadow: '0 4px 12px rgba(255,193,7,0.3)'
                },
                '&:disabled': {
                  backgroundColor: '#f0f0f0',
                  color: '#999'
                }
              }}
            >
              Find Buyers Through Dealer Network
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default VehicleSellingForm;