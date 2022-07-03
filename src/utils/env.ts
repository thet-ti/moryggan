import 'dotenv/config';

export const getEnv = (key: string) => (process.env[key]);

export const env = {
  NODE_PORT: Number(getEnv('NODE_PORT')) || 8080,
  NODE_ENV: getEnv('NODE_ENV') || 'development',
  DB_DATABASE: getEnv('DB_DATABASE') || 'moryggan-db',
  DB_USERNAME: getEnv('DB_USERNAME') || 'root',
  DB_PASSWORD: getEnv('DB_PASSWORD') || 'root',
  DB_HOST: getEnv('DB_HOST') || 'localhost',
  HASH_SALT: Number(getEnv('HASH_SALT')) || 8,
  JWT_SECRET: getEnv('JWT_SECRET') || 'a-rose-is-magnific',
  JWT_QR_SECRET: getEnv('JWT_QR_SECRET') || 'a-lily-is-magnific',
};
