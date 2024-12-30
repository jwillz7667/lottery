```markdown
# frontend-guidelines.md

## 1. Overview

These guidelines explain how to build the **front-end** for an AI-based lottery/competition web app where users pay in Ethereum to attempt “jailbreaking” a team of Security Llama 3.3 AI agents. The user experience (UX) must be **clear**, **intuitive**, and **secure**, focusing on:

- **Registration/Login** (with JWT-based or cookie-based auth).  
- **Ethereum Payments** (to purchase prompt credits).  
- **Chat/Prompt Interface** (for interacting with the AI).  
- **Detailed User Flow** to ensure users understand each step, from landing on the site to potentially winning the pot.

We’ll use **React** (TypeScript) + **Vite** + **TailwindCSS** for the front-end. We’ll integrate **ethers.js** for wallet interactions (e.g., MetaMask).

---

## 2. Step-by-Step Implementation Instructions

### 2.1 Project Setup

1. **Create a React + TypeScript Project**  
   ```bash
   npm create vite@latest my-frontend -- --template react-ts
   cd my-frontend
   npm install
   ```
2. **Install Additional Libraries**  
   ```bash
   npm install axios tailwindcss postcss autoprefixer ethers
   npx tailwindcss init -p
   ```
   - **axios** – for calling back-end APIs.  
   - **ethers** – for Ethereum wallet interactions.  
   - **tailwindcss**, **postcss**, **autoprefixer** – for styling with Tailwind.  

3. **Configure Tailwind**  
   - In `tailwind.config.js`, add:
     ```js
     module.exports = {
       content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
       theme: {
         extend: {},
       },
       plugins: [],
     }
     ```
   - Import Tailwind in your main CSS file (e.g., `src/index.css`):
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

4. **Directory Structure**  
   ```
   my-frontend/
     ├─ src/
     │   ├─ components/
     │   │   ├─ Auth/
     │   │   ├─ Payment/
     │   │   └─ ChatInterface/
     │   ├─ pages/
     │   │   ├─ Home.tsx
     │   │   ├─ Dashboard.tsx
     │   ├─ services/
     │   │   ├─ api.ts
     │   │   └─ ethereum.ts
     │   ├─ App.tsx
     │   ├─ main.tsx
     │   └─ index.css
     ├─ package.json
     ├─ tailwind.config.js
     ├─ vite.config.ts
     └─ tsconfig.json
   ```

---

## 3. Detailed User Flow / UX

### 3.1 Landing Page (Home)

1. **Show Current Pot**  
   - Fetch from the back-end or read an on-chain value to display the current ETH pot.  
   - Provide a quick summary of the rules: each prompt is 0.01 ETH, AI controls the pot, 75%/25% payout split on “jailbreak.”

2. **Call to Action**  
   - Prominent “Sign Up” / “Log In” buttons.  
   - Explanation of how to connect a wallet if the user is new to MetaMask or Web3.

3. **Navigation**  
   - Basic header or nav bar with links to “Buy Prompt Credits,” “Submit Prompt,” “Dashboard,” etc.  
   - Possibly show a “How It Works” or FAQ section.

---

### 3.2 Registration / Login

1. **Register**  
   - A form asking for `email`, `password`, and (optionally) an `ETH address`.  
   - On submission, call `POST /api/auth/register`.  
   - If success, store returned token in a cookie or localStorage.

2. **Login**  
   - A form asking for `email` + `password`.  
   - On success, user receives a token (or a cookie-based session).  
   - Redirect to the user’s dashboard or home.

3. **Auth State**  
   - A global context or Redux store can track whether the user is logged in.  
   - If no token found, certain routes should redirect to login.

---

### 3.3 Dashboard

1. **User Information**  
   - Display `email`, `ETH address` (if provided), and `prompt_credits`.  
   - Show a transaction or purchase history if desired.

2. **Buy Prompt Credits**  
   - A button or link to the payment process (see Payment Flow below).  
   - Real-time reflection of user’s `prompt_credits` after a successful purchase.

3. **User’s Prompt History** (Optional)  
   - List of previous AI interactions, timestamps, etc.

---

### 3.4 Buying Prompt Credits (Payment Flow)

1. **Connect Wallet**  
   - User clicks “Buy Prompt Credit.”  
   - If they haven’t connected MetaMask, prompt them to do so (request accounts).

2. **Ethereum Payment**  
   - The user sends **0.01 ETH** (or the set cost) to the pot’s wallet address.  
   - This is done by calling a function (e.g., `purchasePromptCredit`) in `ethereum.ts` that uses `ethers.js`.

3. **Transaction Confirmation**  
   - On success, you get a `transactionHash`.  
   - Immediately call `POST /api/payments/confirmEth` with that `transactionHash`.  
   - The back-end verifies on-chain that 0.01 ETH arrived at the pot address.  
   - If verified, the user’s `prompt_credits` is incremented.

4. **UX Feedback**  
   - Show a loading spinner while waiting for the transaction to confirm.  
   - On success, show “Purchase Successful! Your new prompt credits: X.”  
   - On error, show “Transaction failed or canceled.”

---

### 3.5 Chat / Prompt Submission

1. **Chat Interface**  
   - A text box or text area for the user to input a prompt.  
   - A “Send” button that is **only enabled** if `prompt_credits > 0`.

2. **Submitting a Prompt**  
   - Deduct 1 `prompt_credit` in the UI for immediate feedback (or after success response from the back-end).  
   - Call `POST /api/ai/submit` with the user’s prompt.  
   - Display a spinner or “AI is thinking…” message while waiting.

3. **AI Response Display**  
   - On success, show the AI’s response in a “chat bubble.”  
   - If the AI is “jailbroken” (the back-end detects a special “release code”), the user might see a special message like “Congrats! You’ve triggered the pot release.”  
   - Otherwise, it’s a normal response or refusal.

4. **Potential Jackpot**  
   - If the AI is compromised, the pot is automatically transferred: 75% to the user’s ETH address, 25% to the service’s.  
   - The user can see a confirmation in their wallet (and possibly a success message).

---

### 3.6 Overall UX Considerations

- **Responsive Layout**:  
  - Use Tailwind utility classes for mobile, tablet, and desktop breakpoints.
- **Error Handling**:  
  - Provide clear messages for network errors, insufficient credits, or missing wallet.  
  - Distinguish between user mistakes (“No metamask installed”) vs. server errors.
- **Visual Indicators**:  
  - Show the number of user credits in a top bar or corner.  
  - Real-time pot updates if possible (e.g., poll the back-end every few seconds).
- **Security & Warnings**:  
  - Encourage users to keep their wallet’s private key safe.  
  - Clearly label “0.01 ETH will be sent to the pot address.”

---

## 4. Example Code Snippets

### 4.1 `ethereum.ts` in `src/services/ethereum.ts`

```ts
import { ethers } from 'ethers';

// This function is triggered when user clicks "Buy Prompt Credit"
export async function purchasePromptCredit(potAddress: string, amountEth = "0.01") {
  if (!window.ethereum) {
    throw new Error("No Ethereum wallet (e.g., MetaMask) found.");
  }
  
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  
  const signer = provider.getSigner();
  const tx = await signer.sendTransaction({
    to: potAddress,
    value: ethers.utils.parseEther(amountEth),
  });
  
  // tx.hash can be submitted to the backend for on-chain verification
  return tx;
}
```

### 4.2 `Payment` Component

```tsx
import React, { useState } from 'react';
import api from '../services/api';
import { purchasePromptCredit } from '../services/ethereum';

function Payment({ potAddress }: { potAddress: string }) {
  const [loading, setLoading] = useState(false);
  
  const handleBuyCredit = async () => {
    try {
      setLoading(true);
      const tx = await purchasePromptCredit(potAddress);
      // Send tx.hash to backend
      await api.post('/api/payments/confirmEth', { txHash: tx.hash });
      alert('Prompt credit purchased successfully!');
    } catch (err: any) {
      alert(`Error: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <button onClick={handleBuyCredit} disabled={loading}>
        {loading ? 'Processing...' : 'Buy Prompt Credit'}
      </button>
    </div>
  );
}

export default Payment;
```

### 4.3 `ChatInterface` Component

```tsx
import React, { useState } from 'react';
import api from '../services/api';

function ChatInterface({ initialCredits }: { initialCredits: number }) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [promptCredits, setPromptCredits] = useState(initialCredits);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    if (promptCredits <= 0) {
      alert("No credits left, please buy more!");
      return;
    }

    setLoading(true);
    try {
      // Deduct one credit (optimistic UI)
      setPromptCredits(promptCredits - 1);

      // Add user message to chat
      setMessages([...messages, { role: 'user', content: prompt }]);

      // Call the AI endpoint
      const { data } = await api.post('/api/ai/submit', { prompt });

      // Add AI response
      setMessages(msgs => [...msgs, { role: 'ai', content: data.response }]);
    } catch (err: any) {
      alert(`Error: ${err.message || err}`);
      // If error, maybe re-add that credit (depends on your logic)
      setPromptCredits(promptCredits + 1);
    } finally {
      setPrompt('');
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages-area">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'user-bubble' : 'ai-bubble'}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your attempt..."
        />
        <button onClick={handleSend} disabled={loading || promptCredits <= 0}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <p>Your current credits: {promptCredits}</p>
    </div>
  );
}

export default ChatInterface;
```

---

## 5. Deployment

1. **Build**  
   ```bash
   npm run build
   ```  
   Produces an optimized `dist/` folder of static files.

2. **Serve**  
   - Deploy these static files on any web server, e.g., Nginx, or a Node-based static server.
   - Example Dockerfile:
     ```dockerfile
     FROM node:18-alpine as build
     WORKDIR /app
     COPY package*.json ./
     RUN npm install
     COPY . .
     RUN npm run build

     FROM nginx:alpine
     COPY --from=build /app/dist /usr/share/nginx/html
     EXPOSE 80
     CMD ["nginx", "-g", "daemon off;"]
     ```

3. **Domain & HTTPS**  
   - Map your domain to the server’s IP.  
   - Use Let’s Encrypt or another solution for SSL certificates.

---

## 6. Final Notes

- **Security**: Keep your API URLs, pot address, or any other sensitive info in environment variables.  
- **Usability**: Provide tooltips and instructions for new crypto users (e.g., how to install MetaMask).  
- **Scalability**: For heavy traffic, consider a CDN for static files, load balancing for your back-end, etc.  
- **Future Enhancements**: Add leaderboards, partial bounties for near misses, or real-time websockets for pot updates.

By following these **frontend-guidelines.md**, you’ll build a **responsive**, **clear**, and **user-friendly** front-end for an Ethereum-based AI lottery that seamlessly integrates with the back-end and the Security Llama 3.3 “team” of AI agents. 
```