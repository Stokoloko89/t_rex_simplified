import React, { useEffect, useState, createContext, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';
import { theme, ErrorBoundary, LoadingSpinner } from '@t-rex/shared-ui';
import axios from 'axios';
import StepRenderer from './components/StepRenderer';

// Define types for workflow context and step configuration
interface WorkflowStep {
  stepId: string;
  componentName: string;
  data: any;
  validation?: any;
  nextSteps?: string[];
  previousStep?: string;
  stepNumber?: number;
  totalSteps?: number;
}

interface WorkflowContextType {
  currentStepConfig: WorkflowStep | null;
  navigate: (formData: any) => Promise<void>;
  goBack: () => Promise<void>;
  isLoading: boolean;
  isTransitioning: boolean;
  sessionId: string;
  error: string | null;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflow = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8080/api';

// This provider will manage communication with the backend workflow engine
const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStepConfig, setCurrentStepConfig] = useState<WorkflowStep | null>(null);
  const [nextStepConfig, setNextStepConfig] = useState<WorkflowStep | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => 
    `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    // Simplified flow: Always start with vehicle help question
    const loadInitialStep = async () => {
      setIsLoading(true);
      setError(null);

      // Start with vehicle help question instead of form completion confirmation
      const config = {
        stepId: 'vehicle-help-question',
        componentName: 'VehicleHelpQuestion',
        data: {
          message: 'Can we help you find a vehicle?',
          subMessage: 'Click the button below to start searching for a vehicle.',
          showButton: true,
          buttonText: 'Yes, help me find a vehicle'
        },
        stepNumber: 1,
        totalSteps: 3
      };

      setCurrentStepConfig(config);
      setIsLoading(false);
    };
    loadInitialStep();
  }, [sessionId]);

  const smoothTransition = async (newStepConfig: WorkflowStep) => {
    // Start transition with fade out
    setIsTransitioning(true);
    
    // Wait for fade out animation (increased for smoother feel)
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Update the step content
    setCurrentStepConfig(newStepConfig);
    
    // Wait longer for content to render and settle
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Fade back in
    setIsTransitioning(false);
  };

  const navigate = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // For development, use mock navigation directly to avoid backend dependency
      console.log('Navigating with data:', formData);
      await mockNavigate(formData);
    } catch (error: any) {
      console.error('Error navigating workflow:', error);
      setError('Navigation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/workflow/back`, {
        sessionId,
        currentStep: currentStepConfig?.stepId,
      });
      await smoothTransition(response.data);
    } catch (error: any) {
      console.error('Error going back in workflow:', error);
      setError('Go back failed. Using mock navigation.');
      // Mock back navigation for development
      mockGoBack();
    } finally {
      setIsLoading(false);
    }
  };

  // Mock functions for development
  const mockNavigate = async (formData: any) => {
    console.log('Mock navigate called with:', formData);
    const currentStep = currentStepConfig?.stepId;
    console.log('Current step ID:', currentStep);
    console.log('Form data action:', formData.action);
    let nextStep: WorkflowStep | null = null;

    switch (currentStep) {
      case 'vehicle-help-question':
        // Handle navigation from vehicle help question
        if (formData.action === 'start_vehicle_search') {
          nextStep = {
            stepId: 'vehicle-search',
            componentName: 'VehicleSearch',
            data: {
              message: 'Search for your desired vehicle',
              subMessage: 'Let\'s find the right vehicle for you!'
            },
            stepNumber: 2,
            totalSteps: 3
          };
        }
        break;
      case 'intent-selection':
        if (formData.intent === 'buying') {
          nextStep = {
            stepId: 'vehicle-knowledge',
            componentName: 'VehicleKnowledge',
            data: { intent: formData.intent, message: 'Do you already know which vehicle you want to buy?' },
            stepNumber: 2,
            totalSteps: 6
          };
        } else if (formData.intent === 'selling') {
          nextStep = {
            stepId: 'has-buyer',
            componentName: 'HasBuyer',
            data: { intent: formData.intent, message: 'Do you already have a buyer for your vehicle?' },
            stepNumber: 2,
            totalSteps: 5
          };
        }
        break;
      case 'vehicle-knowledge':
        if (formData.vehicle_knowledge === 'knows_vehicle') {
          nextStep = {
            stepId: 'vehicle-search',
            componentName: 'VehicleSearch',
            data: { ...formData, message: 'Search for your desired vehicle' },
            stepNumber: 3,
            totalSteps: 6
          };
        } else {
          nextStep = {
            stepId: 'carin-analytics',
            componentName: 'CarInAnalytics',
            data: { ...formData, message: 'Let us help you find the right vehicle' },
            stepNumber: 3,
            totalSteps: 7
          };
        }
        break;
      case 'vehicle-search':
        console.log('App.tsx: Navigating from vehicle-search to SearchResults with data:', formData);
        nextStep = {
          stepId: 'search-results',
          componentName: 'SearchResults',
          data: { 
            ...formData, 
            message: 'Here are vehicles matching your criteria',
            vehicleSearch: formData.vehicleSearch // Ensure vehicleSearch data is preserved
          },
          stepNumber: 4,
          totalSteps: 6
        };
        break;
      case 'search-results':
        console.log('App.tsx: Navigating from search-results with action:', formData.action);
        if (formData.action === 'vehicle-selected' && formData.selectedVehicle) {
          nextStep = {
            stepId: 'vehicle-purchase-confirmation',
            componentName: 'VehiclePurchaseConfirmation',
            data: { 
              ...formData,
              vehicleData: formData.selectedVehicle,
              personData: formData.personData || {},
              message: `Complete your purchase request for the ${formData.selectedVehicle.year} ${formData.selectedVehicle.makeName} ${formData.selectedVehicle.modelName}`
            },
            stepNumber: 5,
            totalSteps: 6
          };
        } else {
          // Fallback case
          nextStep = {
            stepId: 'vehicle-purchase-confirmation',
            componentName: 'VehiclePurchaseConfirmation',
            data: { 
              ...formData,
              vehicleData: formData.selectedVehicles?.[0] || formData.selectedVehicle,
              personData: formData.personData || {},
              message: 'Confirm your vehicle selection and provide contact details'
            },
            stepNumber: 5,
            totalSteps: 6
          };
        }
        break;
      case 'vehicle-purchase-confirmation':
        console.log('App.tsx: Navigating from vehicle-purchase-confirmation with action:', formData.action);
        if (formData.action === 'contact-submitted' || formData.action === 'purchase-confirmed') {
          nextStep = {
            stepId: 'buying-complete',
            componentName: 'BuyingComplete',
            data: { 
              ...formData, 
              message: 'Thank you! Your request has been submitted successfully.',
              nextSteps: 'You will receive a confirmation email shortly. A dealership will contact you within 24 hours.',
              leadId: `LEAD-${Date.now()}`
            },
            stepNumber: 6,
            totalSteps: 6
          };
        }
        break;
      case 'has-buyer':
        // Handle HasBuyer transitions
        console.log('HasBuyer form data:', formData);
        if (formData.has_buyer === 'has_buyer') {
          nextStep = {
            stepId: 'buyer-type',
            componentName: 'BuyerType',
            data: { 
              ...formData, 
              message: 'What type of buyer do you have?',
              previousChoice: 'has_buyer'
            },
            stepNumber: 2,
            totalSteps: 4
          };
        } else if (formData.has_buyer === 'no_buyer') {
          nextStep = {
            stepId: 'dealer-network',
            componentName: 'DealerNetwork',  
            data: { 
              ...formData, 
              message: 'Find dealers interested in your vehicle',
              previousChoice: 'no_buyer',
              valuationData: currentStepConfig?.data?.valuationData,
              prePopulateFromValuation: true // Flag to indicate we should pre-populate
            },
            stepNumber: 2,
            totalSteps: 3
          };
        }
        break;
      case 'buyer-type':
        // Handle BuyerType transitions
        console.log('BuyerType form data:', formData);
        if (formData.buyer_type === 'private') {
          nextStep = {
            stepId: 'private-buyer',
            componentName: 'PrivateBuyer',
            data: { 
              ...formData, 
              message: 'Provide details about your private buyer',
              buyerType: 'private'
            },
            stepNumber: 3,
            totalSteps: 4
          };
        } else if (formData.buyer_type === 'dealer') {
          nextStep = {
            stepId: 'dealer-network',
            componentName: 'DealerNetwork',
            data: { 
              ...formData, 
              message: 'Connect with our dealer network',
              buyerType: 'dealer'
            },
            stepNumber: 3,
            totalSteps: 4
          };
        }
        break;
      case 'private-buyer':
        // Handle PrivateBuyer completion
        console.log('PrivateBuyer form data:', formData);
        const financingChoice = formData.private_buyer_details?.financing;
        
        if (financingChoice === 'yes') {
          // Buyer needs financing - collect buyer details
          nextStep = {
            stepId: 'buyer-financing-details',
            componentName: 'BuyerFinancingDetails',
            data: { 
              ...formData, 
              message: 'Buyer financing details required',
              saleType: 'private',
              privateBuyerDetails: formData.private_buyer_details
            },
            stepNumber: 4,
            totalSteps: 5
          };
        } else {
          // No financing needed - go directly to completion
          nextStep = {
            stepId: 'selling-complete',
            componentName: 'SellingComplete',
            data: { 
              ...formData, 
              message: 'Your private sale details have been recorded',
              saleType: 'private',
              privateBuyerDetails: formData.private_buyer_details
            },
            stepNumber: 4,
            totalSteps: 4
          };
        }
        break;
      case 'dealer-network':
        // Handle DealerNetwork completion - check the action/intent to determine next step
        console.log('DealerNetwork form data:', formData);
        
        // If this is a vehicle search action, go to SearchResults
        if (formData.action === 'vehicle-search' || formData.intent === 'search-vehicles') {
          nextStep = {
            stepId: 'search-results',
            componentName: 'SearchResults',
            data: { 
              ...formData, 
              message: 'Here are vehicles matching your criteria'
            },
            stepNumber: 4,
            totalSteps: 6
          };
        } else {
          // Default dealer network completion
          nextStep = {
            stepId: 'dealer-network-complete',
            componentName: 'DealerNetworkComplete',
            data: { 
              ...formData, 
              message: 'We will connect you with our dealer network',
              saleType: 'dealer'
            },
            stepNumber: 4,
            totalSteps: 4
          };
        }
        break;
      case 'vehicle-selling-form':
        // Handle VehicleSellingForm completion
        console.log('VehicleSellingForm form data:', formData);
        nextStep = {
          stepId: 'selling-complete',
          componentName: 'SellingComplete',
          data: { 
            ...formData, 
            message: 'Your vehicle has been submitted to our dealer network',
            saleType: 'dealer-assistance'
          },
          stepNumber: 3,
          totalSteps: 3
        };
        break;
      case 'buyer-financing-details':
        // Handle BuyerFinancingDetails completion
        console.log('BuyerFinancingDetails form data:', formData);
        nextStep = {
          stepId: 'selling-complete',
          componentName: 'SellingComplete',
          data: { 
            ...formData, 
            message: 'Your private sale and buyer financing details have been recorded',
            saleType: 'private-with-financing',
            privateBuyerDetails: formData.private_buyer_details,
            buyerFinancingDetails: formData.buyer_financing_details
          },
          stepNumber: 5,
          totalSteps: 5
        };
        break;
    }

    if (nextStep) {
      console.log('Transitioning to next step:', nextStep);
      await smoothTransition(nextStep);
    } else {
      console.warn('No next step defined for current transition:', { currentStep, formData });
      console.warn('Available cases in switch statement: intent-selection, vehicle-knowledge, vehicle-search, search-results, has-buyer, buyer-type, private-buyer, dealer-network, vehicle-selling-form, buyer-financing-details');
    }
  };

  const mockGoBack = async () => {
    const currentStep = currentStepConfig?.stepId;
    const currentData = currentStepConfig?.data;
    let previousStep: WorkflowStep | null = null;

    switch (currentStep) {
      case 'vehicle-search':
        previousStep = {
          stepId: 'vehicle-help-question',
          componentName: 'VehicleHelpQuestion',
          data: {
            message: 'Can we help you find a vehicle?',
            subMessage: 'Click the button below to start searching for a vehicle.',
            showButton: true,
            buttonText: 'Yes, help me find a vehicle'
          },
          stepNumber: 1,
          totalSteps: 3
        };
        break;
      case 'search-results':
        previousStep = {
          stepId: 'vehicle-search',
          componentName: 'VehicleSearch',
          data: {
            message: 'Search for your perfect vehicle',
            ...currentData // Preserve search criteria
          },
          stepNumber: 3,
          totalSteps: 6
        };
        break;
      case 'vehicle-purchase-confirmation':
        previousStep = {
          stepId: 'search-results',
          componentName: 'SearchResults',
          data: {
            message: 'Here are vehicles matching your criteria',
            vehicleSearch: currentData?.vehicleSearch,
            ...currentData // Preserve all data including selected vehicles
          },
          stepNumber: 4,
          totalSteps: 6
        };
        break;
      case 'buyer-type':
        previousStep = {
          stepId: 'has-buyer',
          componentName: 'HasBuyer',
          data: {
            message: 'Do you already have a buyer for your vehicle?',
            valuationData: currentData?.valuationData,
            ...currentData
          },
          stepNumber: 1,
          totalSteps: 4
        };
        break;
      case 'private-buyer':
        previousStep = {
          stepId: 'buyer-type',
          componentName: 'BuyerType',
          data: {
            message: 'What type of buyer do you have?',
            previousChoice: 'has_buyer',
            ...currentData
          },
          stepNumber: 2,
          totalSteps: 4
        };
        break;
      case 'dealer-network':
        // Check where we came from based on data
        if (currentData?.previousChoice === 'no_buyer') {
          previousStep = {
            stepId: 'has-buyer',
            componentName: 'HasBuyer',
            data: {
              message: 'Do you already have a buyer for your vehicle?',
              valuationData: currentData?.valuationData,
              ...currentData
            },
            stepNumber: 1,
            totalSteps: 3
          };
        } else if (currentData?.buyerType === 'dealer') {
          previousStep = {
            stepId: 'buyer-type',
            componentName: 'BuyerType',
            data: {
              message: 'What type of buyer do you have?',
              previousChoice: 'has_buyer',
              ...currentData
            },
            stepNumber: 2,
            totalSteps: 4
          };
        }
        break;
      case 'buyer-financing-details':
        previousStep = {
          stepId: 'private-buyer',
          componentName: 'PrivateBuyer',
          data: {
            message: 'Provide details about your private buyer',
            buyerType: 'private',
            ...currentData
          },
          stepNumber: 3,
          totalSteps: 5
        };
        break;
      default:
        console.warn('No back navigation defined for step:', currentStep);
        break;
    }

    if (previousStep) {
      await smoothTransition(previousStep);
    }
  };

  return (
    <WorkflowContext.Provider value={{ 
      currentStepConfig, 
      navigate, 
      goBack, 
      isLoading,
      isTransitioning, 
      sessionId,
      error 
    }}>
      {children}
    </WorkflowContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Container maxWidth="md">
          <Box sx={{ py: 4 }}>
            <WorkflowProvider>
              <StepRenderer />
            </WorkflowProvider>
          </Box>
        </Container>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
