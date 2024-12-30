# AI-Powered Lottery Platform

A decentralized lottery platform powered by AI, built with TypeScript, Node.js, React, and Ethereum smart contracts.

## Features

- 🎫 AI-powered lottery system
- 💰 Ethereum-based transactions
- 🔒 Secure user authentication
- 💳 Credit purchase system
- 🤖 AI prompt interactions
- 📊 Real-time transaction monitoring
- 🎯 Performance monitoring and analytics
- 🔄 Automatic retry mechanisms
- 📱 Responsive web interface

## Tech Stack

### Backend
- Node.js
- TypeScript
- PostgreSQL
- Express.js
- Jest (Testing)
- Ethereum Web3

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Query
- Framer Motion
- React Hot Toast

### Infrastructure
- Docker
- GitHub Actions
- PostgreSQL
- Redis (Caching)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Ethereum Wallet (MetaMask recommended)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jwillz7667/lottery.git
cd lottery
```

2. Install dependencies:
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend (.env)
cp .env.example .env
# Edit .env with your configuration

# Frontend (.env)
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
# In Backend directory
npm run db:setup
```

5. Start the development servers:
```bash
# Backend
npm run dev

# Frontend (in another terminal)
cd ../frontend
npm run dev
```

## Testing

```bash
# Run backend tests
cd Backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Project Structure

```
lottery/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   └── utils/
    ├── tests/
    └── package.json
```

## API Documentation

Detailed API documentation is available in the `Backend/docs/api.md` file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

For security concerns, please email [security@example.com](mailto:security@example.com).

## Support

For support, please open an issue in the GitHub repository. 