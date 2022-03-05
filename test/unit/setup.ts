const environmentVariablesMock = {
  PORT: '3000',
  ENV: 'test',
  SUPABASE_URL: 'http://localhost.com',
  SUPABASE_KEY: 'supabase-key',
  SUPABASE_JWT_SECRET: 'supabase-jwt-secret',
  SUPABASE_EMAIL_CONFIRMATION: 'false',
  USER_RABBITMQ_URI: 'http://localhost.com',
  DB_HOST: 'http://localhost.com',
  DB_PORT: '3000',
  DB_NAME: 'database',
  DB_USERNAME: 'username',
  DB_PASSWORD: 'password',
};

export default () => (process.env = environmentVariablesMock);
