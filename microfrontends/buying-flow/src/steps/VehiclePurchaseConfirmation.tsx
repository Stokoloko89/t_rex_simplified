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
  Alert, 
  CardMedia,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Chip,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { 
  CheckCircle, 
  Person, 
  Email, 
  Phone, 
  DirectionsCar, 
  LocalGasStation, 
  Speed,
  AccountBalance,
  Security,
  TrendingUp,
  Assignment,
  LocationOn
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface PersonData {
  name?: string;
  email?: string;
  phone?: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp';
  location?: string;
}

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
  loadDate?: string;
  lastTouchDate?: string;
  lastChangedDate?: string;
  soldDate?: string;
  isProgram?: number;
  currencySymbol?: string;
  price?: number;
  firstPrice?: number;
  franchise?: string;
  extras?: string | null;
  comments?: string;
  // Legacy fields for backward compatibility
  make?: string;
  model?: string;
  marketValue?: number;
  currency?: string;
  mileage?: string;
  bodyType?: string;
  color?: string;
  transmission?: string;
  fuelType?: string;
  engineSize?: string;
}

interface VehiclePurchaseConfirmationProps {
  initialData?: {
    personData?: PersonData;
    vehicleData?: VehicleData;
    valuationData?: VehicleData;
  };
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const schema = yup.object({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email format'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number (10-15 digits)')
    .test('phone-format', 'Phone number must contain at least 10 digits', (value) => {
      if (!value) return false;
      const digitsOnly = value.replace(/\D/g, '');
      return digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }),
  preferredContact: yup
    .string()
    .required('Preferred contact method is required')
    .oneOf(['email', 'phone', 'whatsapp'], 'Please select a valid contact method'),
  location: yup
    .string()
    .required('Location is required')
    .oneOf([
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 
      'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
    ], 'Please select a valid South African province'),
  comments: yup
    .string()
    .max(1000, 'Comments must be less than 1000 characters'),
  assistanceTypes: yup
    .array()
    .of(yup.string().oneOf(['financing', 'compliance'], 'Invalid assistance type'))
    .min(1, 'Please select at least one assistance type')
    .required('Assistance selection is required'),
});

const VehiclePurchaseConfirmation: React.FC<VehiclePurchaseConfirmationProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [showThankYou, setShowThankYou] = useState(false);

  // Extract person data from initialData for prepopulation
  const personData = initialData?.personData || {};
  
  // Mock user data for prepopulation (in real app, this would come from user session/profile)
  const mockUserData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@gmail.com',
    phone: '+27 83 456 7890',
    location: 'Western Cape',
    preferredContact: 'whatsapp' as const
  };
  
  const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: personData.name || mockUserData.name,
      email: personData.email || mockUserData.email,
      phone: personData.phone || mockUserData.phone,
      location: personData.location || mockUserData.location,
      preferredContact: personData.preferredContact || mockUserData.preferredContact,
      comments: '',
      assistanceTypes: ['financing'], // Default to financing assistance
    }
  });

  // Get vehicle data from initialData with proper structure
  const vehicleData: VehicleData = initialData?.vehicleData || initialData?.valuationData || {
    // New data structure fields
    MKT: "MCV",
    Id: 2324711,
    usedVehicleStockID: 8570067,
    year: 2023,
    makeName: "Toyota",
    modelName: "Quantum Bus",
    variantName: "2.8 SLWB bus 14-seater GL",
    vin: "JTFEB9CP106040993",
    registration: "LC03YCGP",
    mmCode: null,
    engineNo: "1GD9078319",
    milage: 118640,
    colour: "White 058",
    provinceName: "Gauteng",
    trim: null,
    condition: null,
    stockCode: "0173USP040993",
    department: "Used",
    loadDate: "2025-07-11 08:42:00.850000000",
    lastTouchDate: "2025-07-15 18:08:14.300000000",
    lastChangedDate: "2025-07-12 08:43:58.733000000",
    soldDate: "1900-01-01 00:00:00",
    isProgram: -1,
    currencySymbol: "R",
    price: 679900.0,
    firstPrice: 679900.0,
    franchise: "Toyota,Toyota Commercial",
    extras: null,
    comments: "TOYOTA QUANTUM 2.8 GL SLWB 14 SEAT",
    // Legacy fields for backward compatibility
    make: "Toyota",
    model: "Quantum Bus",
    marketValue: 679900,
    currency: "R",
    mileage: "118,640 km",
    bodyType: "Bus",
    color: "White",
    transmission: "Manual",
    fuelType: "Diesel",
    engineSize: "2.8L"
  };

  // Helper function to get display values with fallbacks
  const getVehicleDisplayData = () => {
    return {
      make: vehicleData.makeName || vehicleData.make || 'Unknown Make',
      model: vehicleData.modelName || vehicleData.model || 'Unknown Model',
      year: vehicleData.year || new Date().getFullYear(),
      variant: vehicleData.variantName || '',
      price: vehicleData.price || vehicleData.marketValue || 0,
      currency: vehicleData.currencySymbol || vehicleData.currency || 'R',
      mileage: vehicleData.milage ? `${vehicleData.milage.toLocaleString()} km` : (vehicleData.mileage || 'Unknown'),
      color: vehicleData.colour || vehicleData.color || 'Unknown',
      condition: vehicleData.condition || 'Good',
      department: vehicleData.department || 'Used',
      stockCode: vehicleData.stockCode || '',
      vin: vehicleData.vin || '',
      registration: vehicleData.registration || '',
      province: vehicleData.provinceName || '',
      franchise: vehicleData.franchise || ''
    };
  };

  const displayData = getVehicleDisplayData();

  const selectedAssistanceTypes = watch('assistanceTypes') || [];

  const onFormSubmit = (formData: any) => {
    // Validate the form data before submission
    try {
      schema.validateSync(formData, { abortEarly: false });
      
      setShowThankYou(true);
      // After showing thank you, complete the process
      setTimeout(() => {
        onSubmit({
          contactInfo: {
            ...formData,
            submittedAt: new Date().toISOString(),
            validatedData: true
          },
          vehicleData: vehicleData,
          assistanceRequested: formData.assistanceTypes,
          confirmed: true,
          nextStep: 'PurchaseComplete'
        });
      }, 3000);
    } catch (validationError) {
      console.error('Form validation failed:', validationError);
      // The form validation should prevent this, but handle edge cases
    }
  };

  const handleStartNew = () => {
    window.location.reload();
  };

  // Thank You Screen
  if (showThankYou) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto', p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 3 }} />
          <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold' }}>
            Request Submitted Successfully!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Your vehicle purchase inquiry has been received and our team will contact you within 24 hours.
          </Typography>
        </Box>

        <Card sx={{ mb: 4, border: '2px solid #4caf50' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Request Summary
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Vehicle:</strong> {displayData.year} {displayData.make} {displayData.model}
              {displayData.variant && ` ${displayData.variant}`}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Estimated Value:</strong> {displayData.currency}{displayData.price?.toLocaleString()}
            </Typography>
            {displayData.stockCode && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Stock Code:</strong> {displayData.stockCode}
              </Typography>
            )}
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Assistance Requested:</strong> {selectedAssistanceTypes.join(', ')}
            </Typography>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={handleStartNew}
            size="large"
            sx={{ 
              backgroundColor: '#ffc107',
              color: '#333',
              fontWeight: 'bold',
              px: 4,
              py: 2,
              '&:hover': { backgroundColor: '#e6ac00' }
            }}
          >
            Start New Request
          </Button>
        </Box>
      </Box>
    );
  }

  // Main Form
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: '#333333',
            mb: 2,
            letterSpacing: '-0.02em'
          }}
        >
          Vehicle Purchase Request
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}
        >
          Complete your purchase request and select the assistance you need
        </Typography>
        <Divider />
      </Box>

      <Grid container spacing={4}>
        {/* Vehicle Summary */}
        <Grid item xs={12} md={5}>
          <Card sx={{ 
            height: '100%',
            border: '2px solid #ffc107',
            boxShadow: '0 4px 12px rgba(255,193,7,0.1)'
          }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&crop=center"
              alt={`${vehicleData.make} ${vehicleData.model}`}
              sx={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderBottom: '1px solid #e0e0e0'
              }}
            />
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 700,
                  color: '#333333'
                }}
              >
                <DirectionsCar sx={{ mr: 1.5, color: '#ffc107' }} />
                Selected Vehicle
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#333333' }}>
                  {displayData.year} {displayData.make} {displayData.model}
                </Typography>
                {displayData.variant && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {displayData.variant}
                  </Typography>
                )}
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ffc107' }}>
                  {displayData.currency}{displayData.price?.toLocaleString()}
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ pt: 2, borderTop: '1px solid #f0f0f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Department:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayData.department}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Color:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayData.color}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Mileage:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayData.mileage}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Condition:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayData.condition}</Typography>
                </Box>
                {displayData.registration && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Registration:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayData.registration}</Typography>
                  </Box>
                )}
                {displayData.province && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Province:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{displayData.province}</Typography>
                  </Box>
                )}
                {displayData.franchise && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Franchise:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>{displayData.franchise}</Typography>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Form & Assistance Selection */}
        <Grid item xs={12} md={7}>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <Stack spacing={4}>
              {/* Contact Information Card */}
              <Card sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        fontWeight: 700,
                        color: '#333333'
                      }}
                    >
                      <Person sx={{ mr: 1.5, color: '#ffc107' }} />
                      Contact Information
                    </Typography>
                    {(personData.name || personData.email || personData.phone) && (
                      <Chip 
                        label="Pre-filled" 
                        size="small" 
                        color="success" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Full Name"
                            placeholder="Enter your full name as it appears on your ID"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message || "Required for identity verification"}
                            InputProps={{
                              sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Phone Number"
                            placeholder="+27 XX XXX XXXX"
                            fullWidth
                            error={!!errors.phone}
                            helperText={errors.phone?.message || "Include country code for international numbers"}
                            InputProps={{
                              sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email Address"
                            type="email"
                            placeholder="your.email@example.com"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message || "We'll send vehicle documents and updates here"}
                            InputProps={{
                              sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' }
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.location}>
                            <InputLabel id="location-label">Location (Province) *</InputLabel>
                            <Select
                              {...field}
                              labelId="location-label"
                              label="Location (Province) *"
                              sx={{ backgroundColor: field.value ? '#f8f9fa' : 'white' }}
                            >
                              <MenuItem value="Eastern Cape">Eastern Cape</MenuItem>
                              <MenuItem value="Free State">Free State</MenuItem>
                              <MenuItem value="Gauteng">Gauteng</MenuItem>
                              <MenuItem value="KwaZulu-Natal">KwaZulu-Natal</MenuItem>
                              <MenuItem value="Limpopo">Limpopo</MenuItem>
                              <MenuItem value="Mpumalanga">Mpumalanga</MenuItem>
                              <MenuItem value="Northern Cape">Northern Cape</MenuItem>
                              <MenuItem value="North West">North West</MenuItem>
                              <MenuItem value="Western Cape">Western Cape</MenuItem>
                            </Select>
                            {errors.location && (
                              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                {errors.location.message}
                              </Typography>
                            )}
                            {!errors.location && (
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
                                Required - Select your province for local dealer matching
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="preferredContact"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            select
                            label="Preferred Contact Method"
                            fullWidth
                            error={!!errors.preferredContact}
                            helperText={errors.preferredContact?.message || "How would you like us to contact you?"}
                            SelectProps={{ native: true }}
                            InputProps={{
                              sx: { backgroundColor: field.value ? '#f8f9fa' : 'white' }
                            }}
                          >
                            <option value="email">📧 Email</option>
                            <option value="phone">📞 Phone Call</option>
                            <option value="whatsapp">💬 WhatsApp</option>
                          </TextField>
                        )}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Assistance Selection Card */}
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
                    <Assignment sx={{ mr: 1.5, color: '#ffc107' }} />
                    Select Assistance Needed
                  </Typography>

                  <Controller
                    name="assistanceTypes"
                    control={control}
                    render={({ field }) => (
                      <FormControl component="fieldset" error={!!errors.assistanceTypes}>
                        <FormGroup>
                          <FormControlLabel 
                            control={
                              <Checkbox 
                                checked={field.value?.includes('financing')}
                                onChange={(e) => {
                                  const currentValue = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...currentValue, 'financing']);
                                  } else {
                                    field.onChange(currentValue.filter((v: string) => v !== 'financing'));
                                  }
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <AccountBalance sx={{ mr: 1, color: '#ffc107' }} />
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Finance Assistance
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                  Help with vehicle financing, bank applications, and loan approvals
                                </Typography>
                              </Box>
                            }
                          />
                          
                          <FormControlLabel 
                            control={
                              <Checkbox 
                                checked={field.value?.includes('compliance')}
                                onChange={(e) => {
                                  const currentValue = field.value || [];
                                  if (e.target.checked) {
                                    field.onChange([...currentValue, 'compliance']);
                                  } else {
                                    field.onChange(currentValue.filter((v: string) => v !== 'compliance'));
                                  }
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Security sx={{ mr: 1, color: '#ffc107' }} />
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Compliance Assistance
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                                  FICA documentation, vehicle registration, and legal compliance support
                                </Typography>
                              </Box>
                            }
                          />
                        </FormGroup>
                        {errors.assistanceTypes && (
                          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                            {errors.assistanceTypes.message}
                          </Typography>
                        )}
                      </FormControl>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Additional Comments */}
              <Card sx={{ border: '1px solid #e0e0e0' }}>
                <CardContent sx={{ p: 4 }}>
                  <Controller
                    name="comments"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Additional Comments or Questions (Optional)"
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Any specific requirements, timeline, or questions about the vehicle or process..."
                      />
                    )}
                  />
                </CardContent>
              </Card>

              {/* Disclaimer & Actions */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  By submitting this request, you agree to be contacted by our team and partner network regarding this vehicle purchase inquiry. Your personal information will be used in accordance with our privacy policy.
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  Submit Purchase Request
                </Button>
              </Box>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VehiclePurchaseConfirmation;