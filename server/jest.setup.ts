jest.mock("pg", () => {
  const mockPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };

  return { Pool: jest.fn(() => mockPool) };
});

process.env.GITHUB_WEBHOOK_SECRET = "test-secret-for-env";
process.env.SESSION_SECRET = "test-session-secret";
process.env.NODE_ENV = "test";
