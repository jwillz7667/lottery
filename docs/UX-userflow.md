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