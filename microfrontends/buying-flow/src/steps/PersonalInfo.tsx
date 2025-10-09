import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button as MuiButton,
} from '@mui/material';
import { Button } from '@t-rex/shared-ui';
import { Person } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface PersonalInfoProps {
  initialData: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup.string().required('ZIP code is required'),
  creditScore: yup.string().required('Credit score range is required'),
  employmentStatus: yup.string().required('Employment status is required'),
  annualIncome: yup.string().required('Annual income is required'),
  agreeToTerms: yup.boolean().oneOf([true], 'You must agree to the terms'),
});

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      creditScore: '',
      employmentStatus: '',
      annualIncome: '',
      agreeToTerms: false,
    },
  });

  const onFormSubmit = (formData: any) => {
    onSubmit({
      ...initialData,
      personalInfo: formData,
    });
  };

  return (
    <Card>
      <CardContent>
        <Box textAlign="center" mb={4}>
          <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Personal Information
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please provide your information to complete the application
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="First Name"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Last Name"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone Number"
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address"
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="City"
                    error={!!errors.city}
                    helperText={errors.city?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.state}>
                    <InputLabel>State</InputLabel>
                    <Select {...field} label="State">
                      <MenuItem value="CA">California</MenuItem>
                      <MenuItem value="NY">New York</MenuItem>
                      <MenuItem value="TX">Texas</MenuItem>
                      <MenuItem value="FL">Florida</MenuItem>
                      {/* Add more states as needed */}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                name="zipCode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="ZIP Code"
                    error={!!errors.zipCode}
                    helperText={errors.zipCode?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="creditScore"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.creditScore}>
                    <InputLabel>Credit Score Range</InputLabel>
                    <Select {...field} label="Credit Score Range">
                      <MenuItem value="excellent">Excellent (750+)</MenuItem>
                      <MenuItem value="good">Good (700-749)</MenuItem>
                      <MenuItem value="fair">Fair (650-699)</MenuItem>
                      <MenuItem value="poor">Poor (600-649)</MenuItem>
                      <MenuItem value="bad">Bad (Below 600)</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="employmentStatus"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.employmentStatus}>
                    <InputLabel>Employment Status</InputLabel>
                    <Select {...field} label="Employment Status">
                      <MenuItem value="employed">Employed Full-Time</MenuItem>
                      <MenuItem value="parttime">Employed Part-Time</MenuItem>
                      <MenuItem value="selfemployed">Self-Employed</MenuItem>
                      <MenuItem value="retired">Retired</MenuItem>
                      <MenuItem value="student">Student</MenuItem>
                      <MenuItem value="unemployed">Unemployed</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="annualIncome"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.annualIncome}>
                    <InputLabel>Annual Income</InputLabel>
                    <Select {...field} label="Annual Income">
                      <MenuItem value="under30k">Under $30,000</MenuItem>
                      <MenuItem value="30k-50k">$30,000 - $50,000</MenuItem>
                      <MenuItem value="50k-75k">$50,000 - $75,000</MenuItem>
                      <MenuItem value="75k-100k">$75,000 - $100,000</MenuItem>
                      <MenuItem value="over100k">Over $100,000</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="agreeToTerms"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox {...field} checked={field.value} />}
                    label="I agree to the terms and conditions and privacy policy"
                  />
                )}
              />
              {errors.agreeToTerms && (
                <Typography variant="caption" color="error" display="block">
                  {errors.agreeToTerms.message}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="space-between" mt={4}>
            {onBack && (
              <MuiButton variant="outlined" onClick={onBack}>
                Back
              </MuiButton>
            )}
            <Box flex={1} />
            <Button
              type="submit"
              variant="contained"
              size="large"
              loading={isLoading}
            >
              Submit Application
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
