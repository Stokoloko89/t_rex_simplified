import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Divider,
  Chip
} from '@mui/material';
import { Button } from '@t-rex/shared-ui';

interface VehicleValuationReportProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const VehicleValuationReport: React.FC<VehicleValuationReportProps> = ({ 
  initialData, 
  onSubmit, 
  onBack, 
  isLoading 
}) => {
  console.log('VehicleValuationReport component loaded!', { initialData, isLoading });
  
  // Set clean document title without emoji and hide external icons
  React.useEffect(() => {
    document.title = 'Vehicle Valuation Report';
    
    // Try to hide any external modal icons/emojis
    const style = document.createElement('style');
    style.textContent = `
      /* Hide modal title icons/emojis */
      [class*="modal-title"] svg,
      [class*="modal-header"] svg,
      [class*="dialog-title"] svg,
      .modal-title::before,
      .dialog-title::before,
      [aria-label*="Vehicle Valuation Report"]::before {
        display: none !important;
      }
      
      /* Hide any emoji characters in modal titles */
      [class*="modal-title"]:first-letter,
      [class*="dialog-title"]:first-letter {
        font-size: 0 !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const vehicleData = {
    make: 'CHEVROLET',
    model: 'Sonic',
    variant: '1.4 LS',
    year: 2012,
    yearRange: '[2012-2013]',
    mileage: 'Pc5o12003',
    condition: 'Good',
    marketValue: 82900,
    retailEstimateLow: 75700,
    retailEstimateHigh: 90200,
    tradeEstimate: 66400,
    tradeEstimateLow: 60600,
    tradeEstimateHigh: 72200,
    msrpValue: 156900,
    currency: 'R',
    vin: '',
    licenseNumber: '',
    registrationNumber: '',
    engineNumber: '',
    colour: '',
    type: 'CHEV Sonic',
    smartID: 'Pc5o12003',
    power: '',
    bodyShape: 'Sedan',
    driveType: '4x2',
    fuelType: 'Petrol',
    reportDate: new Date().toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    reportId: '4d8c1d4c-5a74-43e3-b1c8-0a432ef1db'
  };

  const handleContinue = (action: string) => {
    console.log(`User selected: ${action} for ${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`);
    
    switch (action) {
      case 'buy':
        // Route to new Vehicle Purchase Confirmation component
        onSubmit({ 
          nextStep: 'VehiclePurchaseConfirmation', 
          action: 'buying',
          intent: 'buying',
          vehicleInterest: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
          valuationData: vehicleData
        });
        break;
      case 'sell':
        // Route to HasBuyer to start selling workflow
        onSubmit({ 
          nextStep: 'HasBuyer', 
          action: 'selling',
          intent: 'selling',
          vehicleToSell: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
          valuationData: vehicleData
        });
        break;
      case 'dealers':
        // Route to DealerNetwork for dealer search
        onSubmit({ 
          nextStep: 'DealerNetwork', 
          action: 'dealer-search',
          intent: 'dealer-network',
          vehicleInterest: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
          valuationData: vehicleData
        });
        break;
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 1000, 
      mx: 'auto', 
      py: 2, 
      px: 2,
      backgroundColor: '#ffffff',
      minHeight: '500px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header matching the reference report */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 3,
        pb: 2,
        borderBottom: '1px solid #ddd'
      }}>
        <Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: '#000',
            fontSize: '16px',
            mb: 0.5,
            textTransform: 'uppercase'
          }}>
            AUTOMOTIVE
          </Typography>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            color: '#000',
            fontSize: '16px',
            textTransform: 'uppercase'
          }}>
            VALUATION REPORT
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" sx={{ 
            color: '#666',
            fontSize: '10px',
            fontStyle: 'italic',
            mb: 0.5
          }}>
            brought to you by
          </Typography>
          
          {/* Lightstone Logo SVG */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
            <svg width="120" height="25" viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg">
              {/* Lightstone text */}
              <text x="0" y="25" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="normal" fill="#2c5aa0">
                Lightstone
              </text>
              
              {/* Colored underline bars */}
              <rect x="0" y="28" width="25" height="3" fill="#e74c3c" />
              <rect x="25" y="28" width="25" height="3" fill="#f39c12" />
              <rect x="50" y="28" width="25" height="3" fill="#27ae60" />
              <rect x="75" y="28" width="25" height="3" fill="#3498db" />
              <rect x="100" y="28" width="25" height="3" fill="#9b59b6" />
            </svg>
          </Box>
          
          <Typography variant="body2" sx={{ 
            color: '#666',
            fontSize: '9px',
            fontStyle: 'italic'
          }}>
            We simplify the complex
          </Typography>
        </Box>
      </Box>

      {/* Vehicle Title and Image Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 'bold', 
          color: '#000',
          fontSize: '14px',
          mb: 2
        }}>
          {vehicleData.year} {vehicleData.make} {vehicleData.model} {vehicleData.variant} {vehicleData.yearRange}
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{
              height: '150px',
              border: '1px solid #ddd',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5'
            }}>
              <Box
                component="img"
                src="https://news-site-za.s3.af-south-1.amazonaws.com/images/2021/02/2012-Chevrolet-Sonic-Sedan.jpg"
                alt="Blue Chevrolet Sonic"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '12px' }}>
              Searched
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>VIN #:</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.vin || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>License #:</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.licenseNumber || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>Register #:</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.registrationNumber || '-'}</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '12px' }}>
              Returned
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>VIN #:</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.vin || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>Engine #:</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.engineNumber || '-'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>Colour:</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.colour || '-'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Generic and Definitions Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '12px', color: '#000' }}>
            GENERIC
          </Typography>
          <Box sx={{ border: '1px solid #ddd', backgroundColor: '#f9f9f9' }}>
            {/* Generic data table */}
            <Box sx={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
              <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ddd', backgroundColor: '#e9e9e9' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Make</Typography>
              </Box>
              <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.make}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
              <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ddd', backgroundColor: '#e9e9e9' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Type</Typography>
              </Box>
              <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.type}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
              <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ddd', backgroundColor: '#e9e9e9' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Model</Typography>
              </Box>
              <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.model} {vehicleData.variant} {vehicleData.yearRange}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
              <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ddd', backgroundColor: '#e9e9e9' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Year</Typography>
              </Box>
              <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.year}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
              <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ddd', backgroundColor: '#e9e9e9' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>SmartID</Typography>
              </Box>
              <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.smartID}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
              <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ddd', backgroundColor: '#e9e9e9' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Power (kW)</Typography>
              </Box>
              <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.power || '-'}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
              <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ddd', backgroundColor: '#e9e9e9' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Body shape</Typography>
              </Box>
              <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.bodyShape}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
              <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ddd', backgroundColor: '#e9e9e9' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Drive type</Typography>
              </Box>
              <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.driveType}</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ flex: 1, p: 1, borderRight: '1px solid #ddd', backgroundColor: '#e9e9e9' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Fuel type</Typography>
              </Box>
              <Box sx={{ flex: 2, p: 1 }}>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>{vehicleData.fuelType}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, fontSize: '12px', color: '#000' }}>
            DEFINITIONS
          </Typography>
          <Box sx={{ border: '1px solid #ddd', p: 2, backgroundColor: '#f9f9f9', fontSize: '11px' }}>
            <Typography variant="body2" sx={{ fontSize: '11px', mb: 1 }}>
              <strong>Retail Estimated Value</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '10px', mb: 2, lineHeight: 1.3 }}>
              This is the price you see advertised on a car's windshield at the dealership. As such, 
              it is the highest price that the car could be sold for based on its make, model, 
              and condition.
            </Typography>
            
            <Typography variant="body2" sx={{ fontSize: '11px', mb: 1 }}>
              <strong>Trade Estimated Value</strong>
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '10px', lineHeight: 1.3 }}>
              This value is determined by the average value that motor dealers and trading 
              services would pay for a similar vehicle. The Trade Value is typically lower than 
              Retail Value as motor dealers still need to add costs to get the vehicle in showroom 
              condition and to advertise the vehicle and add a profit margin to this value.
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Valuation Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 2, fontSize: '12px', color: '#000' }}>
          VALUATION
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ border: '1px solid #ddd' }}>
              <Box sx={{ backgroundColor: '#e9e9e9', p: 1, borderBottom: '1px solid #ddd' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>
                  Retail Estimated Value
                </Typography>
              </Box>
              <Box sx={{ p: 1, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Retail Estimate</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>R {vehicleData.marketValue.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ p: 1, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Retail Estimate Low</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>R {vehicleData.retailEstimateLow.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Retail Estimate High</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>R {vehicleData.retailEstimateHigh.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ border: '1px solid #ddd' }}>
              <Box sx={{ backgroundColor: '#e9e9e9', p: 1, borderBottom: '1px solid #ddd' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>
                  Trade Estimated Value
                </Typography>
              </Box>
              <Box sx={{ p: 1, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Trade Estimate</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>R {vehicleData.tradeEstimate.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ p: 1, borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Trade Estimate Low</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>R {vehicleData.tradeEstimateLow.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>Trade Estimate High</Typography>
                <Typography variant="body2" sx={{ fontSize: '11px' }}>R {vehicleData.tradeEstimateHigh.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, p: 1, backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
          <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold', mb: 1 }}>
            Launch Manufacturer Suggested Retail Price
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ fontSize: '11px' }}>
              MSRP excl VAT at launch (16/01/2012) for Sonic 1.4 LS
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '11px', fontWeight: 'bold' }}>
              R {vehicleData.msrpValue.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Action Selection */}
      <Box sx={{ 
        mb: 4, 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        padding: 4,
        borderRadius: 2,
        border: '1px solid #e9ecef'
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#333333' }}>
          What would you like to do next?
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666', mb: 4, fontSize: '1.1rem' }}>
          Based on this valuation, choose your preferred action for this {vehicleData.year} {vehicleData.make} {vehicleData.model}
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6, justifyContent: 'center' }}>
        {/* Purchase Option */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            cursor: 'pointer',
            height: '100%',
            transition: 'all 0.3s ease',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            '&:hover': {
              borderColor: '#ffc107',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)',
              backgroundColor: '#fefefe'
            }
          }}
          onClick={() => handleContinue('buy')}>
            <CardContent sx={{ p: 4, textAlign: 'left' }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#ffc107',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <Box
                    component="svg"
                    sx={{ width: 24, height: 24, fill: '#fff' }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333333' }}>
                  I want to buy this Vehicle
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.5, mb: 2 }}>
                  We offer financing assistance to help you purchase this vehicle
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 2,
                borderTop: '1px solid #f0f0f0'
              }}>
                <Typography variant="body2" sx={{ 
                  color: '#ffc107', 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px'
                }}>
                  Start Process
                </Typography>
                <Box
                  component="svg"
                  sx={{ width: 16, height: 16, fill: '#ffc107' }}
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sell Option */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            cursor: 'pointer',
            height: '100%',
            transition: 'all 0.3s ease',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            '&:hover': {
              borderColor: '#ffc107',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)',
              backgroundColor: '#fefefe'
            }
          }}
          onClick={() => handleContinue('sell')}>
            <CardContent sx={{ p: 4, textAlign: 'left' }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#ffc107',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <Box
                    component="svg"
                    sx={{ width: 24, height: 24, fill: '#fff' }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H11.5v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.65c.1 1.7 1.36 2.66 2.85 2.97V19h1.71v-1.69c1.61-.32 2.89-1.34 2.89-2.91-.01-2.2-1.9-2.96-3.79-3.26z"/>
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333333' }}>
                  I want to sell this Vehicle
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.5, mb: 2 }}>
                  Connect with buyers and get professional selling assistance
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 2,
                borderTop: '1px solid #f0f0f0'
              }}>
                <Typography variant="body2" sx={{ 
                  color: '#ffc107', 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px'
                }}>
                  Start Process
                </Typography>
                <Box
                  component="svg"
                  sx={{ width: 16, height: 16, fill: '#ffc107' }}
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Find Vehicle Option */}
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{
            cursor: 'pointer',
            height: '100%',
            transition: 'all 0.3s ease',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            '&:hover': {
              borderColor: '#ffc107',
              boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
              transform: 'translateY(-2px)',
              backgroundColor: '#fefefe'
            }
          }}
          onClick={() => handleContinue('dealers')}>
            <CardContent sx={{ p: 4, textAlign: 'left' }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#ffc107',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}>
                  <Box
                    component="svg"
                    sx={{ width: 24, height: 24, fill: '#fff' }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333333' }}>
                  Find other Vehicles
                </Typography>
                <Typography variant="body2" sx={{ color: '#666666', lineHeight: 1.5, mb: 2 }}>
                  Browse our inventory to find similar vehicles available for purchase
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 2,
                borderTop: '1px solid #f0f0f0'
              }}>
                <Typography variant="body2" sx={{ 
                  color: '#ffc107', 
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px'
                }}>
                  Browse Inventory
                </Typography>
                <Box
                  component="svg"
                  sx={{ width: 16, height: 16, fill: '#ffc107' }}
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Report Footer Information */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '11px', color: '#666' }}>
            Report Date: {vehicleData.reportDate}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '11px', color: '#666' }}>
            Report ID: {vehicleData.reportId}
          </Typography>
        </Box>
        
        <Box sx={{ p: 2, backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}>
          <Typography variant="body2" sx={{ fontSize: '10px', color: '#666', mb: 1, fontWeight: 'bold' }}>
            DISCLAIMER:
          </Typography>
          <Typography variant="body2" sx={{ fontSize: '9px', color: '#666', lineHeight: 1.4 }}>
            The information contained in this report is compiled from sources believed to be reliable and accurate. However, 
            Lightstone Auto makes no warranty as to the accuracy or completeness of such information and accepts no liability 
            for any loss or damage that may arise from reliance on information contained in this report. The valuation estimates 
            provided are based on market data and should be used as a guide only. Actual selling prices may vary depending on 
            condition, location, and market factors at the time of sale.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default VehicleValuationReport;
