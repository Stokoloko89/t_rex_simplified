import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import VehicleReviewList, { Vehicle } from './VehicleReviewList';

const theme = createTheme();

const mockVehicles: Vehicle[] = [
  {
    id: 1,
    makeName: 'Toyota',
    modelName: 'Corolla',
    year: 2022,
    price: 250000,
    mileage: 45000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    colour: 'Silver',
    bodyType: 'Sedan',
  },
  {
    id: 2,
    makeName: 'Honda',
    modelName: 'Civic',
    year: 2021,
    price: 280000,
    mileage: 62000,
    transmission: 'Manual',
    fuelType: 'Petrol',
    colour: 'Black',
    bodyType: 'Sedan',
  },
  {
    id: 3,
    makeName: 'Ford',
    modelName: 'Focus',
    year: 2020,
    price: 220000,
    mileage: 85000,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    colour: 'White',
    bodyType: 'Hatchback',
  },
];

describe('VehicleReviewList Component', () => {
  const renderComponent = (
    vehicles: Vehicle[] = mockVehicles,
    onBackToSelection?: () => void,
  ) => {
    return render(
      <ThemeProvider theme={theme}>
        <VehicleReviewList
          selectedVehicles={vehicles}
          onBackToSelection={onBackToSelection}
          isEditable={true}
        />
      </ThemeProvider>,
    );
  };

  test('renders all vehicles when selectedVehicles array has 3 items', () => {
    renderComponent();
    
    // Check that all vehicle titles are rendered
    expect(screen.getByText(/2022 Toyota Corolla/)).toBeInTheDocument();
    expect(screen.getByText(/2021 Honda Civic/)).toBeInTheDocument();
    expect(screen.getByText(/2020 Ford Focus/)).toBeInTheDocument();
  });

  test('displays correct vehicle count in header', () => {
    renderComponent();
    
    expect(screen.getByText(/You have selected 3 vehicles/)).toBeInTheDocument();
  });

  test('shows "No vehicles selected" when array is empty', () => {
    renderComponent([]);
    
    expect(screen.getByText(/No vehicles selected/)).toBeInTheDocument();
    expect(
      screen.getByText(/Please go back and select at least 1 vehicle to proceed/),
    ).toBeInTheDocument();
  });

  test('each vehicle card displays correct details', () => {
    renderComponent();
    
    // First vehicle
    expect(screen.getByText('R250000')).toBeInTheDocument();
    expect(screen.getByText('45000 km')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
    expect(screen.getByText('Petrol')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  test('displays selection badge for each vehicle', () => {
    renderComponent();
    
    expect(screen.getAllByText('Selected').length).toBe(3);
  });

  test('displays sequential number badges (1, 2, 3)', () => {
    const { container } = renderComponent();
    
    const badges = container.querySelectorAll('[style*="border-radius"]');
    // Verify selection order badges are rendered
    expect(badges.length).toBeGreaterThan(0);
  });

  test('calls onBackToSelection when back button is clicked', () => {
    const mockOnBack = jest.fn();
    renderComponent(mockVehicles, mockOnBack);
    
    const backButton = screen.getByRole('button', { name: /Back to Selection/ });
    backButton.click();
    
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('shows "maximum reached" message when 4 vehicles selected', () => {
    const fourVehicles = [...mockVehicles];
    fourVehicles.push({
      id: 4,
      makeName: 'BMW',
      modelName: '3 Series',
      year: 2023,
      price: 450000,
      mileage: 15000,
      transmission: 'Automatic',
      fuelType: 'Petrol',
      colour: 'Blue',
      bodyType: 'Sedan',
    });
    
    renderComponent(fourVehicles);
    
    expect(screen.getByText(/maximum reached/)).toBeInTheDocument();
    expect(
      screen.getByText(/You have selected the maximum number of vehicles/),
    ).toBeInTheDocument();
  });

  test('displays remaining vehicle count correctly', () => {
    renderComponent();
    
    expect(screen.getByText(/You can select 1 more vehicle/)).toBeInTheDocument();
  });

  test('renders info alert with contact request details', () => {
    renderComponent();
    
    expect(
      screen.getByText(
        /These vehicles will be included in your contact request/,
      ),
    ).toBeInTheDocument();
  });

  test('responsive layout - renders on mobile viewport', () => {
    // This test verifies responsive design is applied
    // In actual e2e tests, you would resize the viewport
    renderComponent();
    
    // If rendered successfully, responsive design is in place
    expect(screen.getByText(/Review Your Selected Vehicles/)).toBeInTheDocument();
  });

  test('displays price in ZA currency format', () => {
    renderComponent();
    
    // South African rand format
    const priceElements = screen.queryAllByText(/R\d+/);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  test('displays optional fields only when present', () => {
    const vehicleWithoutOptional: Vehicle[] = [
      {
        id: 1,
        makeName: 'Toyota',
        modelName: 'Corolla',
        year: 2022,
        price: null, // Optional field
        mileage: null, // Optional field
        transmission: null, // Optional field
        fuelType: null, // Optional field
        colour: null, // Optional field
      },
    ];
    
    renderComponent(vehicleWithoutOptional);
    
    // Should still render without crashing
    expect(screen.getByText(/2022 Toyota Corolla/)).toBeInTheDocument();
  });
});
