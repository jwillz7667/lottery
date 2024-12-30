-- Database Schema for Lottery Application

-- 1. Users Table
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,                       -- Unique ID for each user
    email VARCHAR(255) UNIQUE NOT NULL,          -- User's email (must be unique)
    password_hash VARCHAR(255) NOT NULL,         -- Hashed password
    eth_address VARCHAR(255) UNIQUE,             -- User's Ethereum wallet address (optional but unique if provided)
    prompt_credits INT DEFAULT 0,                -- Number of credits available for AI interaction
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- User registration timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Transactions Table
CREATE TABLE Transactions (
    id SERIAL PRIMARY KEY,                       -- Unique transaction ID
    user_id INT REFERENCES Users(id) ON DELETE CASCADE, -- Associated user ID
    tx_hash VARCHAR(255) UNIQUE NOT NULL,        -- Ethereum transaction hash (must be unique)
    amount_eth DECIMAL(18, 8) NOT NULL,          -- Amount of ETH involved in the transaction
    transaction_type VARCHAR(50) NOT NULL,      -- Type of transaction: "credit_purchase", "payout", etc.
    status VARCHAR(50) DEFAULT 'pending',       -- Status: "pending", "confirmed", "failed", etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of the transaction
);

-- 3. Prompts Table
CREATE TABLE Prompts (
    id SERIAL PRIMARY KEY,                       -- Unique prompt ID
    user_id INT REFERENCES Users(id) ON DELETE CASCADE, -- Associated user ID
    prompt_text TEXT NOT NULL,                   -- Text of the prompt submitted by the user
    response_text TEXT,                          -- AI's response to the prompt
    result VARCHAR(50),                          -- Outcome: "success", "failure", "release_code", etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of prompt submission
);

-- 4. Lottery Table
CREATE TABLE Lottery (
    id SERIAL PRIMARY KEY,                       -- Unique lottery ID
    current_pot DECIMAL(18, 8) DEFAULT 0.00,     -- Current Ethereum pot value
    last_winner_id INT REFERENCES Users(id),     -- ID of the last winner (nullable)
    payout_tx_hash VARCHAR(255),                 -- Ethereum transaction hash for the last payout
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of lottery initialization
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. Logs Table
CREATE TABLE Logs (
    id SERIAL PRIMARY KEY,                       -- Unique log ID
    log_type VARCHAR(50) NOT NULL,               -- Type: "auth", "payment", "ai_interaction", "error", etc.
    description TEXT NOT NULL,                   -- Detailed description of the log
    user_id INT REFERENCES Users(id) ON DELETE SET NULL, -- Associated user ID (nullable)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of the log entry
);

-- 6. Wallets Table (Optional, for internal or service wallets)
CREATE TABLE Wallets (
    id SERIAL PRIMARY KEY,                       -- Unique wallet ID
    wallet_address VARCHAR(255) NOT NULL UNIQUE, -- Ethereum wallet address
    wallet_type VARCHAR(50) NOT NULL,            -- Type: "pot", "service", "user", etc.
    private_key_encrypted TEXT,                  -- Encrypted private key (only for service/internal wallets)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of wallet creation
);

-- 7. AI Agents Table (Optional, for multi-agent setups)
CREATE TABLE AIAgents (
    id SERIAL PRIMARY KEY,                       -- Unique agent ID
    name VARCHAR(100) NOT NULL,                  -- Name of the AI agent
    role VARCHAR(50) NOT NULL,                   -- Role: "policy", "security", "release", etc.
    model_version VARCHAR(50) NOT NULL,          -- Version of the AI model
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of last update
);

-- Indexes for Performance
CREATE INDEX idx_user_email ON Users(email);
CREATE INDEX idx_tx_hash ON Transactions(tx_hash);
CREATE INDEX idx_prompt_user_id ON Prompts(user_id);
CREATE INDEX idx_logs_user_id ON Logs(user_id);

-- Foreign Key Relationships
ALTER TABLE Transactions ADD CONSTRAINT fk_user_transactions FOREIGN KEY (user_id) REFERENCES Users(id);
ALTER TABLE Prompts ADD CONSTRAINT fk_user_prompts FOREIGN KEY (user_id) REFERENCES Users(id);
ALTER TABLE Logs ADD CONSTRAINT fk_user_logs FOREIGN KEY (user_id) REFERENCES Users(id);

-- Default Entries (Optional, for initialization)
INSERT INTO Wallets (wallet_address, wallet_type) VALUES
('0xPotWalletAddressHere', 'pot'),
('0xServiceWalletAddressHere', 'service');
