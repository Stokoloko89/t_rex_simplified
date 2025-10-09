-- Simple T-Rex database initialization for PostgreSQL
-- Database and user are created by Docker environment variables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create workflow_states table (will be managed by Hibernate, but this ensures structure)
CREATE TABLE IF NOT EXISTS workflow_states (
    id BIGSERIAL PRIMARY KEY,
    session_id UUID UNIQUE NOT NULL,
    workflow_type VARCHAR(255) NOT NULL,
    current_step VARCHAR(255) NOT NULL,
    user_data JSONB,
    context JSONB,
    navigation_history JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workflow_states_session_id ON workflow_states(session_id);
CREATE INDEX IF NOT EXISTS idx_workflow_states_workflow_type ON workflow_states(workflow_type);
CREATE INDEX IF NOT EXISTS idx_workflow_states_status ON workflow_states(status);
CREATE INDEX IF NOT EXISTS idx_workflow_states_updated_at ON workflow_states(updated_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workflow_states_updated_at 
    BEFORE UPDATE ON workflow_states 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
INSERT INTO workflow_states (session_id, workflow_type, current_step, user_data, context, navigation_history, status)
VALUES 
    (uuid_generate_v4(), 'buying', 'intent-selection', '{}', '{}', '{}', 'IN_PROGRESS')
ON CONFLICT (session_id) DO NOTHING;
