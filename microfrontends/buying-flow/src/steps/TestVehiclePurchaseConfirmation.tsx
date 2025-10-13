import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import VehiclePurchaseConfirmation from './VehiclePurchaseConfirmation';

// Test component to demonstrate prepopulation and validation
const TestVehiclePurchaseConfirmation: React.FC = () => {
  const [showWithData, setShowWithData] = useState(false);

  const samplePersonData = {
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+27 82 123 4567',
    preferredContact: 'email' as const
  };

  const sampleVehicleData = {
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
    comments: "TOYOTA QUANTUM 2.8 GL SLWB 14 SEAT"
  };

  const handleSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    alert('Form submitted successfully! Check console for details.');
  };

  const handleBack = () => {
    console.log('Back button clicked');
  };

  if (showWithData) {
    return (
      <VehiclePurchaseConfirmation
        initialData={{
          personData: samplePersonData,
          vehicleData: sampleVehicleData
        }}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Vehicle Purchase Confirmation Test
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Test the component with and without prepopulated data
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button 
            variant="outlined" 
            onClick={() => setShowWithData(false)}
            disabled={!showWithData}
          >
            Show Empty Form
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setShowWithData(true)}
            disabled={showWithData}
          >
            Show Pre-filled Form
          </Button>
        </Box>

        {!showWithData && (
          <VehiclePurchaseConfirmation
            initialData={{ vehicleData: sampleVehicleData }}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        )}
      </Box>
    </Container>
  );
};

export default TestVehiclePurchaseConfirmation;