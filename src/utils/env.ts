import 'dotenv/config';

export const getEnv = (key: string) => (process.env[key]);

export const env = {
  NODE_PORT: getEnv('NODE_PORT') || 8080,
  NODE_ENV: getEnv('NODE_ENV') || 'development',
  DB_DATABASE: getEnv('DB_DATABASE') || 'moryggan-db',
  DB_USERNAME: getEnv('DB_USERNAME') || 'root',
  DB_PASSWORD: getEnv('DB_PASSWORD') || 'root',
  DB_HOST: getEnv('DB_HOST') || 'localhost',
  HASH_SALT: getEnv('HASH_SALT') || 8,
};
