import React from 'react';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Box, 
  Typography 
} from '@mui/material';

interface StepperComponentProps {
  steps: string[];
  activeStep: number;
  orientation?: 'horizontal' | 'vertical';
}

const StepperComponent: React.FC<StepperComponentProps> = ({ 
  steps, 
  activeStep, 
  orientation = 'horizontal' 
}) => {
  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Stepper activeStep={activeStep} orientation={orientation}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              <Typography variant="body2">{label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StepperComponent;
