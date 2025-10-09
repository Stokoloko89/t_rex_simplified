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
    // Initial load of the workflow
    const loadInitialStep = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${API_BASE_URL}/workflow/start`, { 
          sessionId,
          workflowType: 'buying'
        });
        setCurrentStepConfig(response.data);
      } catch (error: any) {
        console.error('Error starting workflow:', error);
        setError('Failed to start workflow. Using mock data for development.');
        // Mock data for development when backend is not available
        setCurrentStepConfig({
          stepId: 'intent-selection',
          componentName: 'IntentSelection',
          data: { message: 'What would you like to do today?' },
          stepNumber: 1,
          totalSteps: 5
        });
      } finally {
        setIsLoading(false);
      }
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
      const response = await axios.post(`${API_BASE_URL}/workflow/transition`, {
        sessionId,
        currentStep: currentStepConfig?.stepId,
        data: formData,
      });
      await smoothTransition(response.data);
    } catch (error: any) {
      console.error('Error navigating workflow:', error);
      setError('Navigation failed. Using mock transition.');
      // Mock navigation for development
      mockNavigate(formData);
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
    const currentStep = currentStepConfig?.stepId;
    let nextStep: WorkflowStep | null = null;

    switch (currentStep) {
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
            data: { ...formData, message: 'Let us help you find the perfect vehicle' },
            stepNumber: 3,
            totalSteps: 7
          };
        }
        break;
      case 'vehicle-search':
        nextStep = {
          stepId: 'search-results',
          componentName: 'SearchResults',
          data: { ...formData, message: 'Here are vehicles matching your criteria' },
          stepNumber: 4,
          totalSteps: 6
        };
        break;
      case 'search-results':
        nextStep = {
          stepId: 'buying-confirmation',
          componentName: 'BuyingConfirmation',
          data: { ...formData, message: 'Confirm your vehicle selection and provide contact details' },
          stepNumber: 5,
          totalSteps: 6
        };
        break;
    }

    if (nextStep) {
      await smoothTransition(nextStep);
    }
  };

  const mockGoBack = async () => {
    const currentStep = currentStepConfig?.stepId;
    let previousStep: WorkflowStep | null = null;

    switch (currentStep) {
      case 'vehicle-knowledge':
        previousStep = {
          stepId: 'intent-selection',
          componentName: 'IntentSelection',
          data: { message: 'What would you like to do today?' },
          stepNumber: 1,
          totalSteps: 6
        };
        break;
      case 'vehicle-search':
        previousStep = {
          stepId: 'vehicle-knowledge',
          componentName: 'VehicleKnowledge',
          data: { message: 'Do you already know which vehicle you want to buy?' },
          stepNumber: 2,
          totalSteps: 6
        };
        break;
      case 'search-results':
        previousStep = {
          stepId: 'vehicle-search',
          componentName: 'VehicleSearch',
          data: { message: 'Search for your desired vehicle' },
          stepNumber: 3,
          totalSteps: 6
        };
        break;
      case 'buying-confirmation':
        previousStep = {
          stepId: 'search-results',
          componentName: 'SearchResults',
          data: { message: 'Here are vehicles matching your criteria' },
          stepNumber: 4,
          totalSteps: 6
        };
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
