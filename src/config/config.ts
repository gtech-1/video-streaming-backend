import { config as conf } from "dotenv";
conf();

interface AppConfig {
    port: string | undefined;
    mongoDbConnection: string | undefined;
    jwtSecret: string;
}

const _config: AppConfig = {
    port: process.env.PORT,
    mongoDbConnection: process.env.MONGO_CONNECTION_URL,
    jwtSecret: process.env.JWT_SECRET || '8f45d7e9b2c1a3f6e8d0c4b7a2e5f9d3c6b8a1e4f7d0c3b6a9e2f5d8c1b4a7e0'
};

if (!_config.jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export const config = Object.freeze(_config);
