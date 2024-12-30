import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { api } from '../api';

const server = setupServer(
  // Auth endpoints
  rest.post('/api/v1/auth/register', (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: 1,
          email: 'test@example.com',
          ethAddress: '0x123',
          promptCredits: 0,
          createdAt: new Date().toISOString(),
        },
        token: 'test-token',
      })
    );
  }),

  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        user: {
          id: 1,
          email: 'test@example.com',
          ethAddress: '0x123',
          promptCredits: 10,
          createdAt: new Date().toISOString(),
        },
        token: 'test-token',
      })
    );
  }),

  // Transaction endpoints
  rest.post('/api/v1/transactions', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        userId: 1,
        txHash: '0x123',
        amountEth: 0.1,
        status: 'pending',
        transactionType: 'credit_purchase',
        createdAt: new Date().toISOString(),
      })
    );
  }),

  // Prompt endpoints
  rest.post('/api/v1/prompts', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        userId: 1,
        promptText: 'test prompt',
        response: null,
        status: 'pending',
        createdAt: new Date().toISOString(),
      })
    );
  }),

  // Lottery endpoints
  rest.get('/api/v1/lottery/pot', (req, res, ctx) => {
    return res(
      ctx.json({
        currentPot: 1.5,
        participantCount: 10,
        lastWinner: null,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ApiService', () => {
  beforeEach(() => {
    api.clearToken();
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const result = await api.register('test@example.com', 'password', '0x123');
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBe('test-token');
    });

    it('should login a user', async () => {
      const result = await api.login('test@example.com', 'password');
      expect(result.user.email).toBe('test@example.com');
      expect(result.token).toBe('test-token');
    });

    it('should handle authentication errors', async () => {
      server.use(
        rest.post('/api/v1/auth/login', (req, res, ctx) => {
          return res(
            ctx.status(401),
            ctx.json({
              error: {
                code: 'AUTH_001',
                message: 'Invalid credentials',
              },
            })
          );
        })
      );

      await expect(api.login('test@example.com', 'wrong')).rejects.toThrow();
    });
  });

  describe('Transactions', () => {
    beforeEach(() => {
      api.setToken('test-token');
    });

    it('should create a transaction', async () => {
      const result = await api.createTransaction('0x123', 0.1, 'credit_purchase');
      expect(result.txHash).toBe('0x123');
      expect(result.status).toBe('pending');
    });

    it('should handle transaction errors', async () => {
      server.use(
        rest.post('/api/v1/transactions', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: {
                code: 'TXN_001',
                message: 'Invalid transaction hash',
              },
            })
          );
        })
      );

      await expect(
        api.createTransaction('invalid', 0.1, 'credit_purchase')
      ).rejects.toThrow();
    });
  });

  describe('Prompts', () => {
    beforeEach(() => {
      api.setToken('test-token');
    });

    it('should submit a prompt', async () => {
      const result = await api.submitPrompt('test prompt');
      expect(result.promptText).toBe('test prompt');
      expect(result.status).toBe('pending');
    });

    it('should handle prompt errors', async () => {
      server.use(
        rest.post('/api/v1/prompts', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({
              error: {
                code: 'PROMPT_002',
                message: 'Insufficient credits',
              },
            })
          );
        })
      );

      await expect(api.submitPrompt('test prompt')).rejects.toThrow();
    });
  });

  describe('Lottery', () => {
    beforeEach(() => {
      api.setToken('test-token');
    });

    it('should get current pot', async () => {
      const result = await api.getCurrentPot();
      expect(result.currentPot).toBe(1.5);
      expect(result.participantCount).toBe(10);
    });

    it('should handle lottery errors', async () => {
      server.use(
        rest.get('/api/v1/lottery/pot', (req, res, ctx) => {
          return res(
            ctx.status(503),
            ctx.json({
              error: {
                code: 'LOTTERY_001',
                message: 'Pot not available',
              },
            })
          );
        })
      );

      await expect(api.getCurrentPot()).rejects.toThrow();
    });
  });
}); 