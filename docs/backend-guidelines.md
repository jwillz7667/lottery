```markdown
# backend-guidelines.md

## 1. Overview

This backend handles:

1. **User Authentication** (sign-up, login).  
2. **Ethereum Payment Verification** (for prompt credits).  
3. **Lottery Pot Management** (storing ETH in a dedicated pot wallet).  
4. **AI Interaction** via a team of Security Llama 3.3 agents (coordinated by a specialized service).  
5. **Payout Logic** (75% to winner, 25% to our service fee).

We’ll use **Node.js** (TypeScript) + **Express** + **PostgreSQL** to store user data and transaction logs. The Ethereum wallet logic is implemented with **ethers.js**, and the AI logic delegates to the LLM service (the Security Llama 3.3 “team”) described elsewhere.

---

## 2. Step-by-Step Implementation

### 2.1 Project Initialization

1. **Create a Folder** named `backend`.

2. **Initialize NPM**:
   ```bash
   cd backend
   npm init -y
   ```

3. **Install Dependencies**:
   ```bash
   npm install express typescript ts-node-dev ethers pg bcrypt jsonwebtoken cors dotenv
   npm install --save-dev @types/express @types/node @types/bcrypt @types/jsonwebtoken @types/cors
   ```
   - **express**: HTTP framework.  
   - **typescript** + **ts-node-dev**: For TypeScript development with live reload.  
   - **ethers**: Ethereum library.  
   - **pg**: PostgreSQL client.  
   - **bcrypt**: For hashing passwords securely.  
   - **jsonwebtoken**: For generating/validating user auth tokens.  
   - **cors**: Cross-origin resource sharing.  
   - **dotenv**: Loads environment variables from `.env`.

4. **Initialize TypeScript**:
   ```bash
   npx tsc --init
   ```
   - This creates a `tsconfig.json`.  
   - Adjust settings, e.g., `"outDir": "dist"` and enable `"strict": true` for safer TypeScript.

---

### 2.2 Directory Structure

```
backend/
  ├─ src/
  │   ├─ config/
  │   │   ├─ db.ts
  │   │   ├─ ethereum.ts
  │   ├─ controllers/
  │   │   ├─ authController.ts
  │   │   ├─ paymentController.ts
  │   │   ├─ aiController.ts
  │   │   └─ lotteryController.ts
  │   ├─ middleware/
  │   │   └─ authMiddleware.ts
  │   ├─ models/
  │   │   ├─ User.ts
  │   │   ├─ Transaction.ts
  │   │   ├─ Prompt.ts
  │   ├─ services/
  │   │   ├─ aiService.ts
  │   │   ├─ ethereumService.ts
  │   │   └─ ...
  │   ├─ app.ts
  │   └─ index.ts
  ├─ package.json
  ├─ tsconfig.json
  ├─ .env
  └─ Dockerfile
```

- **index.ts**: Starts the Express server.  
- **app.ts**: Configures routes and middleware.  
- **db.ts**: Connects to PostgreSQL.  
- **ethereum.ts**: Sets up the pot wallet logic via **ethers.js** (loading private key from `.env`).

---

### 2.3 Configuration Files

#### 2.3.1 `.env`

Store private keys and database credentials here:

```
DATABASE_URL=postgresql://username:password@host:port/dbname
ETH_PRIVATE_KEY=0xABC...
ETH_PROVIDER_URL=https://mainnet.infura.io/v3/YOUR_KEY
POT_WALLET_ADDRESS=0x123...
SERVICE_WALLET_ADDRESS=0x456...
JWT_SECRET=someSecretToken
```

> **Never** commit `.env` to version control.  

#### 2.3.2 `db.ts` (Database Connection)

```ts
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export default pool;
```

#### 2.3.3 `ethereum.ts` (Ethereum Connection)

```ts
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

export const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER_URL);
export const potWallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY as string, provider);
```

---

### 2.4 Database Models

You’ll typically have three key tables (or an equivalent via ORM):

1. **User**  
   - Fields: `id`, `email`, `password_hash`, `eth_address`, `prompt_credits`, etc.
2. **Prompt**  
   - Fields: `id`, `user_id`, `prompt_text`, `response_text`, `timestamp`.
3. **Transaction**  
   - Fields: `id`, `user_id`, `tx_hash`, `amount_eth`, `transaction_type`, `timestamp`.

---

### 2.5 Controllers & Services

#### 2.5.1 Auth Controller

- **Register**  
  1. Validate incoming data (`email`, `password`, optional `ethAddress`).  
  2. Hash `password` using bcrypt.  
  3. Insert into `User` table.  
  4. Return success or a signed JWT token.

- **Login**  
  1. Find user by `email`.  
  2. Compare hashed `password`.  
  3. If match, sign a JWT with `JWT_SECRET`.  
  4. Return token (or store in an HTTP-only cookie).

```ts
// authController.ts

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// ... import DB connection, models, etc.

export async function register(req: Request, res: Response) {
  try {
    const { email, password, ethAddress } = req.body;
    // 1) Validate input
    // 2) Hash password with bcrypt
    // 3) Insert user into DB
    // 4) Generate token or return success
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    // 1) Check user in DB
    // 2) Compare with bcrypt
    // 3) If valid, sign JWT
    // 4) Return token
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

---

#### 2.5.2 Payment Controller

- **confirmEth**:  
  1. Receives a `transactionHash` from the frontend.  
  2. Calls `ethereumService.verifyTransaction(txHash, "0.01")`.  
  3. If verified, increments the user’s `prompt_credits`.

---

#### 2.5.3 AI Controller

- **submitPrompt**:  
  1. Check user’s `prompt_credits`. If 0, refuse.  
  2. Deduct 1 credit.  
  3. Call `aiService.sendPrompt(userPrompt, userId)` to the “Security Llama 3.3” orchestrator.  
  4. If the AI indicates a jailbreak (detect “RELEASE_POT_NOW:[USER_ID]”), call `lotteryController.payout(userId)`.

---

#### 2.5.4 Lottery Controller

- **payout(winnerUserId)**:  
  1. Determine total pot (on-chain or from local track).  
  2. 25% → `SERVICE_WALLET_ADDRESS`, 75% → `winnerUser.eth_address`.  
  3. Use `potWallet` to sign transactions.  
  4. Log the event in `Transaction` table.

---

### 2.6 Ethereum Service (`ethereumService.ts`)

```ts
import { ethers } from 'ethers';
import { provider, potWallet } from '../config/ethereum';

export async function verifyTransaction(txHash: string, expectedAmountEth: string) {
  const tx = await provider.getTransaction(txHash);
  if (!tx) throw new Error("Transaction not found");

  // Check recipient
  if (tx.to?.toLowerCase() !== potWallet.address.toLowerCase()) {
    throw new Error("Transaction not sent to pot wallet");
  }

  // Check value
  const valueInEth = ethers.utils.formatEther(tx.value);
  if (valueInEth !== expectedAmountEth) {
    throw new Error("Transaction value mismatch");
  }

  // Wait for confirmation
  const receipt = await tx.wait(1);
  if (!receipt.status) {
    throw new Error("Transaction failed on-chain");
  }
  return true;
}

export async function sendPayout(
  winnerAddress: string,
  winnerAmountEth: string,
  serviceAddress: string,
  serviceAmountEth: string
) {
  // 1) Send to winner
  let tx = await potWallet.sendTransaction({
    to: winnerAddress,
    value: ethers.utils.parseEther(winnerAmountEth),
  });
  await tx.wait(1);

  // 2) Send to service
  tx = await potWallet.sendTransaction({
    to: serviceAddress,
    value: ethers.utils.parseEther(serviceAmountEth),
  });
  await tx.wait(1);

  return true;
}
```

---

### 2.7 Running & Testing

1. **Set Up DB**: Create your PostgreSQL tables (e.g., `Users`, `Prompts`, `Transactions`).  
2. **Set Up .env**: Provide DB URL, ETH private key, addresses, etc.  
3. **Start Dev Server**:
   ```bash
   npx ts-node-dev src/index.ts
   ```
4. **Test Endpoints**:
   - **Auth** (Register, Login) via Postman or cURL.  
   - **Payment** (confirmEth) with a testnet transaction.  
   - **AI** (submitPrompt) to see if it deducts credits and calls the orchestrator.  
5. **Check** on-chain confirmations (e.g., Etherscan for Goerli testnet).

---

### 2.8 Deployment

1. **Dockerize**:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   CMD ["node", "dist/index.js"]
   ```

2. **Push** to a registry (Docker Hub or DigitalOcean Registry).  
3. **Spin Up** a DigitalOcean Droplet or a container in DOKS (Kubernetes).  
4. **Set** environment variables in the cloud environment.  
5. **Scale** horizontally if needed (multiple containers behind a load balancer).

```
