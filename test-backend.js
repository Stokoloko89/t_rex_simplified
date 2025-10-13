const axios = require('axios');

const BASE_URL = 'http://localhost:8080/api/workflow';

async function testBackend() {
    try {
        console.log('🧪 Testing Backend API Integration...\n');

        // Test 1: Basic health check
        console.log('1. Testing health endpoint...');
        const healthResponse = await axios.get(`${BASE_URL}/test`);
        console.log('✅ Health check:', healthResponse.data);

        // Test 2: Start workflow
        console.log('\n2. Starting workflow...');
        const startResponse = await axios.post(`${BASE_URL}/start`, {
            workflowType: 'vehicle-valuation',
            sessionId: 'test-session-' + Date.now()
        });
        console.log('✅ Started workflow:', {
            stepId: startResponse.data.stepId,
            componentName: startResponse.data.componentName,
            status: startResponse.data.status
        });

        const sessionId = startResponse.data.sessionId || 'test-session-' + Date.now();

        // Test 3: Test vehicle-valuation-report step
        console.log('\n3. Testing vehicle-valuation-report step...');
        try {
            const valuationResponse = await axios.post(`${BASE_URL}/transition`, {
                sessionId: sessionId,
                currentStep: 'vehicle-search',
                nextStep: 'vehicle-valuation-report',
                data: {
                    action: 'buying',
                    intent: 'buying',
                    valuationData: {
                        make: 'Toyota',
                        model: 'Corolla',
                        year: 2020,
                        marketValue: 285000
                    }
                }
            });
            console.log('✅ Vehicle valuation report step:', {
                stepId: valuationResponse.data.stepId,
                componentName: valuationResponse.data.componentName,
                status: valuationResponse.data.status
            });
        } catch (error) {
            console.log('❌ Vehicle valuation report test failed:', error.response?.data?.message || error.message);
        }

        // Test 4: Test vehicle-purchase-confirmation step with new data structure
        console.log('\n4. Testing vehicle-purchase-confirmation step with new data structure...');
        try {
            const purchaseResponse = await axios.post(`${BASE_URL}/transition`, {
                sessionId: sessionId + '-purchase',
                currentStep: 'vehicle-valuation-report',
                nextStep: 'vehicle-purchase-confirmation',
                data: {
                    action: 'buying',
                    intent: 'buying',
                    vehicleData: {
                        MKT: "MCV",
                        Id: 2324711,
                        usedVehicleStockID: 8570067,
                        year: 2023,
                        makeName: "Toyota",
                        modelName: "Quantum Bus",
                        variantName: "2.8 SLWB bus 14-seater GL",
                        price: 679900.0,
                        currencySymbol: "R",
                        milage: 118640,
                        colour: "White 058"
                    },
                    personData: {
                        name: "John Smith",
                        email: "john.smith@example.com",
                        phone: "+27 82 123 4567"
                    },
                    vehicleInterest: {
                        type: 'purchase',
                        urgency: 'immediate'
                    }
                }
            });
            console.log('✅ Vehicle purchase confirmation step:', {
                stepId: purchaseResponse.data.stepId,
                componentName: purchaseResponse.data.componentName,
                status: purchaseResponse.data.status,
                hasVehicleData: !!purchaseResponse.data.data.vehicleData,
                hasPersonData: !!purchaseResponse.data.data.personData
            });
        } catch (error) {
            console.log('❌ Vehicle purchase confirmation test failed:', error.response?.data?.message || error.message);
        }

        // Test 5: Test vehicle selling form workflow
        console.log('\n5. Testing vehicle selling form workflow...');
        try {
            const sellingResponse = await axios.post(`${BASE_URL}/transition`, {
                sessionId: sessionId + '-selling',
                currentStep: 'has-buyer',
                nextStep: 'vehicle-selling-form',
                data: {
                    has_buyer: 'no_buyer',
                    vehicleData: {
                        MKT: "MCV",
                        year: 2020,
                        makeName: "Honda",
                        modelName: "Civic",
                        price: 320000.0,
                        currencySymbol: "R",
                        milage: 85000,
                        colour: "Silver"
                    },
                    personData: {
                        name: "Jane Doe",  
                        email: "jane.doe@example.com",
                        phone: "+27 84 567 8900"
                    }
                }
            });
            console.log('✅ Vehicle selling form step:', {
                stepId: sellingResponse.data.stepId,
                componentName: sellingResponse.data.componentName,
                status: sellingResponse.data.status,
                hasVehicleData: !!sellingResponse.data.data.vehicleData,
                hasPersonData: !!sellingResponse.data.data.personData
            });
        } catch (error) {
            console.log('❌ Vehicle selling form test failed:', error.response?.data?.message || error.message);
        }

        // Test 6: Test vehicle selling form submission
        console.log('\n6. Testing vehicle selling form submission...');
        try {
            const submissionResponse = await axios.post(`${BASE_URL}/transition`, {
                sessionId: sessionId + '-selling-submit',
                currentStep: 'vehicle-selling-form',
                nextStep: 'dealer-network-complete',
                data: {
                    vehicleData: {
                        MKT: "MCV",
                        year: 2020,
                        makeName: "Honda",
                        modelName: "Civic",
                        variantName: "1.8 Executive",
                        price: 320000.0,
                        currencySymbol: "R",
                        milage: 85000,
                        colour: "Silver",
                        condition: "good",
                        registration: "CA 123 456",
                        provinceName: "Western Cape"
                    },
                    formType: 'vehicle-selling'
                }
            });
            console.log('✅ Vehicle selling form submission:', {
                stepId: submissionResponse.data.stepId,
                componentName: submissionResponse.data.componentName,
                status: submissionResponse.data.status,
                workflowComplete: submissionResponse.data.workflowComplete,
                leadId: submissionResponse.data.data.leadId
            });
        } catch (error) {
            console.log('❌ Vehicle selling form submission test failed:', error.response?.data?.message || error.message);
        }

        console.log('\n🎉 Backend integration tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);
    }
}

testBackend();