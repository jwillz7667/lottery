# API Documentation

## Overview
The AI Lottery frontend communicates with the backend through a RESTful API. All endpoints are prefixed with `/api/v1`.

## Authentication

### Register User
```typescript
POST /api/v1/auth/register
Content-Type: application/json

// Request
{
  "email": string,
  "password": string,
  "ethAddress": string
}

// Response
{
  "user": {
    "id": number,
    "email": string,
    "ethAddress": string,
    "promptCredits": number,
    "createdAt": string
  },
  "token": string
}
```

### Login User
```typescript
POST /api/v1/auth/login
Content-Type: application/json

// Request
{
  "email": string,
  "password": string
}

// Response
{
  "user": {
    "id": number,
    "email": string,
    "ethAddress": string,
    "promptCredits": number,
    "createdAt": string
  },
  "token": string
}
```

### Verify Token
```typescript
GET /api/v1/auth/verify
Authorization: Bearer <token>

// Response
{
  "user": {
    "id": number,
    "email": string,
    "ethAddress": string,
    "promptCredits": number,
    "createdAt": string
  }
}
```

## Transactions

### Create Transaction
```typescript
POST /api/v1/transactions
Authorization: Bearer <token>
Content-Type: application/json

// Request
{
  "txHash": string,
  "amountEth": number,
  "transactionType": "credit_purchase" | "payout"
}

// Response
{
  "id": number,
  "userId": number,
  "txHash": string,
  "amountEth": number,
  "status": "pending" | "confirmed" | "failed",
  "transactionType": "credit_purchase" | "payout",
  "createdAt": string
}
```

### Get Transaction Status
```typescript
GET /api/v1/transactions/:txHash
Authorization: Bearer <token>

// Response
{
  "id": number,
  "userId": number,
  "txHash": string,
  "amountEth": number,
  "status": "pending" | "confirmed" | "failed",
  "transactionType": "credit_purchase" | "payout",
  "createdAt": string
}
```

### List User Transactions
```typescript
GET /api/v1/transactions/user
Authorization: Bearer <token>

// Response
{
  "transactions": [
    {
      "id": number,
      "userId": number,
      "txHash": string,
      "amountEth": number,
      "status": "pending" | "confirmed" | "failed",
      "transactionType": "credit_purchase" | "payout",
      "createdAt": string
    }
  ]
}
```

## AI Prompts

### Submit Prompt
```typescript
POST /api/v1/prompts
Authorization: Bearer <token>
Content-Type: application/json

// Request
{
  "promptText": string
}

// Response
{
  "id": number,
  "userId": number,
  "promptText": string,
  "response": string | null,
  "status": "pending" | "completed" | "failed",
  "createdAt": string
}
```

### Get Prompt Status
```typescript
GET /api/v1/prompts/:id
Authorization: Bearer <token>

// Response
{
  "id": number,
  "userId": number,
  "promptText": string,
  "response": string | null,
  "status": "pending" | "completed" | "failed",
  "createdAt": string
}
```

### List User Prompts
```typescript
GET /api/v1/prompts/user
Authorization: Bearer <token>

// Response
{
  "prompts": [
    {
      "id": number,
      "userId": number,
      "promptText": string,
      "response": string | null,
      "status": "pending" | "completed" | "failed",
      "createdAt": string
    }
  ]
}
```

## Lottery

### Get Current Pot
```typescript
GET /api/v1/lottery/pot
Authorization: Bearer <token>

// Response
{
  "currentPot": number,
  "participantCount": number,
  "lastWinner": {
    "userId": number,
    "promptText": string,
    "amountWon": number,
    "timestamp": string
  } | null
}
```

### Get User Stats
```typescript
GET /api/v1/lottery/stats
Authorization: Bearer <token>

// Response
{
  "totalParticipations": number,
  "totalWinnings": number,
  "bestPrompt": {
    "promptText": string,
    "amountWon": number,
    "timestamp": string
  } | null
}
```

## Error Handling

### Error Response Format
```typescript
{
  "error": {
    "code": string,
    "message": string,
    "details?: any
  }
}
```

### Common Error Codes
- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Invalid token
- `TXN_001`: Invalid transaction hash
- `TXN_002`: Transaction failed
- `PROMPT_001`: Invalid prompt
- `PROMPT_002`: Insufficient credits
- `LOTTERY_001`: Pot not available

## Rate Limiting
- Authentication endpoints: 5 requests per minute
- Transaction endpoints: 10 requests per minute
- Prompt endpoints: 20 requests per minute
- Lottery endpoints: 30 requests per minute

## Websocket Events

### Transaction Updates
```typescript
// Event: transaction_update
{
  "txHash": string,
  "status": "pending" | "confirmed" | "failed",
  "timestamp": string
}
```

### Prompt Updates
```typescript
// Event: prompt_update
{
  "promptId": number,
  "status": "pending" | "completed" | "failed",
  "response": string | null,
  "timestamp": string
}
```

### Lottery Updates
```typescript
// Event: pot_update
{
  "currentPot": number,
  "participantCount": number,
  "timestamp": string
}
```

## Best Practices
1. Always include authentication token in protected endpoints
2. Handle rate limiting gracefully
3. Implement proper error handling
4. Use websockets for real-time updates
5. Cache responses when appropriate
6. Validate input before sending
7. Handle network errors
8. Implement retry mechanisms
9. Monitor API health
10. Log API interactions 