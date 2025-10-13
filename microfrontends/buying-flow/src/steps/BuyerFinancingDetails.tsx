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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert
} from '@mui/material';
import { AccountBalance, Person, Phone, Email } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface BuyerFinancingDetailsProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const schema = yup.object({
  buyerName: yup
    .string()
    .required('Buyer name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  buyerEmail: yup
    .string()
    .required('Buyer email is required')
    .email('Please enter a valid email address'),
  buyerPhone: yup
    .string()
    .required('Buyer phone number is required')
    .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
  buyerIdNumber: yup
    .string()
    .required('Buyer ID number is required')
    .matches(/^[0-9]{13}$/, 'Please enter a valid 13-digit South African ID number'),
  employmentStatus: yup
    .string()
    .required('Employment status is required')
    .oneOf(['employed', 'self-employed', 'pensioner', 'unemployed'], 'Please select a valid employment status'),
  monthlyIncome: yup
    .number()
    .required('Monthly income is required')
    .min(1000, 'Monthly income must be at least R1,000')
    .max(1000000, 'Monthly income seems too high'),
  financingAmount: yup
    .number()
    .required('Financing amount is required')
    .min(10000, 'Financing amount must be at least R10,000')
    .max(2000000, 'Financing amount seems too high'),
  additionalInfo: yup
    .string()
    .max(500, 'Additional information must be less than 500 characters')
});

const BuyerFinancingDetails: React.FC<BuyerFinancingDetailsProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      buyerIdNumber: '',
      employmentStatus: '',
      monthlyIncome: '',
      financingAmount: '',
      additionalInfo: ''
    }
  });

  const onFormSubmit = (formData: any) => {
    console.log('BuyerFinancingDetails - Form submitted:', formData);
    onSubmit({
      buyer_financing_details: {
        ...formData,
        submittedAt: new Date().toISOString()
      },
      buyer_type: 'private',
      financing_required: true,
      ...initialData
    });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 3, px: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <AccountBalance sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Buyer Financing Details
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Please provide the buyer's information for financing assistance
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        This information will be used to pre-qualify your buyer for vehicle financing. 
        All details are kept confidential and secure.
      </Alert>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={4}>
              {/* Personal Information Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Person sx={{ mr: 1, color: 'primary.main' }} />
                  Buyer Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="buyerName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Full Name"
                          placeholder="Enter buyer's full name"
                          fullWidth
                          error={!!errors.buyerName}
                          helperText={errors.buyerName?.message}
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="buyerIdNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="ID Number"
                          placeholder="13-digit SA ID number"
                          fullWidth
                          error={!!errors.buyerIdNumber}
                          helperText={errors.buyerIdNumber?.message}
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="buyerEmail"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email Address"
                          type="email"
                          placeholder="buyer@example.com"
                          fullWidth
                          error={!!errors.buyerEmail}
                          helperText={errors.buyerEmail?.message}
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="buyerPhone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Phone Number"
                          placeholder="+27 XX XXX XXXX"
                          fullWidth
                          error={!!errors.buyerPhone}
                          helperText={errors.buyerPhone?.message}
                          required
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Employment & Income Section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <AccountBalance sx={{ mr: 1, color: 'primary.main' }} />
                  Employment & Income Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Controller
                      name="employmentStatus"
                      control={control}
                      render={({ field }) => (
                        <FormControl component="fieldset" error={!!errors.employmentStatus}>
                          <FormLabel component="legend">Employment Status *</FormLabel>
                          <RadioGroup {...field} row sx={{ mt: 1 }}>
                            <FormControlLabel value="employed" control={<Radio />} label="Employed" />
                            <FormControlLabel value="self-employed" control={<Radio />} label="Self-employed" />
                            <FormControlLabel value="pensioner" control={<Radio />} label="Pensioner" />
                            <FormControlLabel value="unemployed" control={<Radio />} label="Unemployed" />
                          </RadioGroup>
                          {errors.employmentStatus && (
                            <Typography variant="caption" color="error">
                              {errors.employmentStatus.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="monthlyIncome"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Monthly Income (ZAR)"
                          type="number"
                          placeholder="25000"
                          fullWidth
                          error={!!errors.monthlyIncome}
                          helperText={errors.monthlyIncome?.message || "Gross monthly income before deductions"}
                          required
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>R</Typography>
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="financingAmount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Financing Amount Required (ZAR)"
                          type="number"
                          placeholder="150000"
                          fullWidth
                          error={!!errors.financingAmount}
                          helperText={errors.financingAmount?.message || "Amount needed for vehicle financing"}
                          required
                          InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>R</Typography>
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Controller
                      name="additionalInfo"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Additional Information (Optional)"
                          multiline
                          rows={3}
                          placeholder="Any additional information about the buyer's financial situation..."
                          fullWidth
                          error={!!errors.additionalInfo}
                          helperText={errors.additionalInfo?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          {onBack && (
            <Button 
              variant="outlined" 
              onClick={onBack}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          <Button 
            type="submit"
            variant="contained" 
            disabled={isLoading || !isValid}
            sx={{ ml: 'auto' }}
          >
            Complete Financing Application
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default BuyerFinancingDetails;