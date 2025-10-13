import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Stack, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Person, AttachMoney } from '@mui/icons-material';

interface PrivateBuyerProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const PrivateBuyer: React.FC<PrivateBuyerProps> = ({
  initialData,
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    financing: '',
    buyerInfo: '',
  });

  const handleInputChange = (field: string, value: string) => {
    console.log('PrivateBuyer - Input change:', { field, value });
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('PrivateBuyer - Updated form data:', newData);
      return newData;
    });
  };

  const handleSubmit = () => {
    console.log('PrivateBuyer - handleSubmit called');
    console.log('PrivateBuyer - Current form data:', formData);
    const submissionData = { 
      private_buyer_details: formData,
      buyer_type: 'private'
    };
    console.log('PrivateBuyer - Submitting data:', submissionData);
    onSubmit(submissionData);
  };

  const isFormValid = formData.financing;
  const message = initialData?.message || "Private sale details";

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Person sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Private Sale Details
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={4}>
            <Box>
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel component="legend" sx={{ mb: 2 }}>
                  Does the buyer need financing?
                </FormLabel>
                <RadioGroup
                  value={formData.financing}
                  onChange={(e) => handleInputChange('financing', e.target.value)}
                >
                  <FormControlLabel 
                    value="yes" 
                    control={<Radio />} 
                    label="Yes, buyer needs financing assistance" 
                  />
                  <FormControlLabel 
                    value="no" 
                    control={<Radio />} 
                    label="No, buyer has their own financing" 
                  />
                  <FormControlLabel 
                    value="cash" 
                    control={<Radio />} 
                    label="Cash purchase" 
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Additional Buyer Information (Optional)"
                multiline
                rows={3}
                placeholder="Any additional details about the buyer or sale..."
                value={formData.buyerInfo}
                onChange={(e) => handleInputChange('buyerInfo', e.target.value)}
              />
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
          variant="contained" 
          onClick={handleSubmit}
          disabled={isLoading || !isFormValid}
          sx={{ ml: 'auto' }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default PrivateBuyer;
