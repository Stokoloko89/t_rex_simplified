import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Alert, Box, Fade, CircularProgress, Typography } from '@mui/material';
import { LoadingSpinner, StepperComponent } from '@t-rex/shared-ui';
import { useWorkflow } from '../App';

// Step component imports
import IntentSelection from '../steps/IntentSelection';
import VehicleSearch from '../steps/VehicleSearch';
import VehicleDetails from '../steps/VehicleDetails';
import PersonalInfo from '../steps/PersonalInfo';
import Confirmation from '../steps/Confirmation';

// New Core Application Flow components
import VehicleKnowledge from '../steps/VehicleKnowledge';
import CarInAnalytics from '../steps/CarInAnalytics';
import SearchResults from '../steps/SearchResults';
import CarInResults from '../steps/CarInResults';
import BuyingConfirmation from '../steps/BuyingConfirmation';
import BuyingComplete from '../steps/BuyingComplete';

// Selling flow components
import HasBuyer from '../steps/HasBuyer';
import BuyerType from '../steps/BuyerType';
import PrivateBuyer from '../steps/PrivateBuyer';
import DealerNetwork from '../steps/DealerNetwork';
import ReplacementCheck from '../steps/ReplacementCheck';
import SellingComplete from '../steps/SellingComplete';
import NoAssistanceNeeded from '../steps/NoAssistanceNeeded';
import FinancingAssistanceComplete from '../steps/FinancingAssistanceComplete';
import DealerNetworkComplete from '../steps/DealerNetworkComplete';

// Component mapping for dynamic loading
const stepComponents: Record<string, React.ComponentType<any>> = {
  // Original components
  IntentSelection,
  VehicleSearch,
  VehicleDetails,
  PersonalInfo,
  Confirmation,
  
  // Enhanced buying flow
  VehicleKnowledge,
  CarInAnalytics,
  SearchResults,
  CarInResults,
  BuyingConfirmation,
  BuyingComplete,
  
  // Selling flow
  HasBuyer,
  BuyerType,
  PrivateBuyer,
  DealerNetwork,
  ReplacementCheck,
  SellingComplete,
  NoAssistanceNeeded,
  FinancingAssistanceComplete,
  DealerNetworkComplete,
};

const StepRenderer: React.FC = () => {
  const { currentStepConfig, navigate, goBack, isLoading, isTransitioning, error } = useWorkflow();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto');
  const [isHeightTransitioning, setIsHeightTransitioning] = useState(false);

  // Capture current height before transition starts
  useEffect(() => {
    if (isTransitioning && contentRef.current) {
      const currentHeight = contentRef.current.scrollHeight;
      setContainerHeight(currentHeight);
      setIsHeightTransitioning(true);
    }
  }, [isTransitioning]);

  // Smooth height adjustment after new content loads
  useEffect(() => {
    if (!isTransitioning && isHeightTransitioning && contentRef.current) {
      const newHeight = contentRef.current.scrollHeight;
      
      // Animate to new height
      setContainerHeight(newHeight);
      
      // Reset to auto after animation completes
      const timer = setTimeout(() => {
        setContainerHeight('auto');
        setIsHeightTransitioning(false);
      }, 600); // Longer for smoother transitions
      
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, isHeightTransitioning, currentStepConfig?.stepId]);

  if (isLoading || !currentStepConfig) {
    return <LoadingSpinner message="Loading step..." />;
  }

  if (error) {
    return (
      <Box mb={2}>
        <Alert severity="warning">{error}</Alert>
      </Box>
    );
  }

  const StepComponent = stepComponents[currentStepConfig.componentName];

  if (!StepComponent) {
    return (
      <Alert severity="error">
        Unknown step component: {currentStepConfig.componentName}
      </Alert>
    );
  }

  // Show transition loading overlay
  if (isTransitioning) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        width: '100%',
        textAlign: 'center',
        py: 8
      }}>
        <CircularProgress size={48} sx={{ mb: 2, color: '#007AFF' }} />
        <Typography variant="body1" color="text.secondary">
          Loading next step...
        </Typography>
      </Box>
    );
  }

  // Dynamic stepper based on workflow type and progress
  const getDynamicSteps = () => {
    const stepId = currentStepConfig.stepId;
    const totalSteps = currentStepConfig.totalSteps;
    
    // If we have dynamic total steps, create a generic stepper
    if (typeof totalSteps === 'string' && (totalSteps as string).includes('-')) {
      const [min, max] = (totalSteps as string).split('-').map(Number);
      const currentStep = currentStepConfig.stepNumber || 1;
      const estimatedTotal = Math.min(max, Math.max(min, currentStep + 2));
      
      return Array.from({ length: estimatedTotal }, (_, i) => `Step ${i + 1}`);
    }
    
    // Fallback to original stepper for backward compatibility
    return ['Intent', 'Search', 'Details', 'Info', 'Confirm'];
  };

  const steps = getDynamicSteps();
  const activeStep = Math.min((currentStepConfig.stepNumber || 1) - 1, steps.length - 1);

  return (
    <Box>
      <StepperComponent 
        steps={steps} 
        activeStep={activeStep} 
      />
      
      <Box 
        ref={containerRef}
        sx={{
          height: containerHeight,
          transition: 'height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Box 
          ref={contentRef}
          sx={{
            position: containerHeight !== 'auto' ? 'absolute' : 'relative',
            width: '100%',
            top: 0,
            left: 0
          }}
        >
          <Fade in={!isTransitioning} timeout={500}>
            <Box>
              <Suspense fallback={<LoadingSpinner message="Loading component..." />}>
                <StepComponent
                  initialData={currentStepConfig.data}
                  onSubmit={navigate}
                  onBack={(currentStepConfig as any).canGoBack ? goBack : undefined}
                  isLoading={isLoading}
                />
              </Suspense>
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default StepRenderer;
