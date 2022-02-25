const environmentVariablesMock = {
  PORT: '3000',
  ENV: 'test',
  SUPABASE_URL: 'http://localhost.com',
  SUPABASE_KEY: 'supabase-key',
  SUPABASE_JWT_SECRET: 'supabase-jwt-secret',
};

export default () => (process.env = environmentVariablesMock);
