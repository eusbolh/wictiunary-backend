import { cleanEnv, port, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    MONGO_DATABASE_NAME: str(),
    MONGO_PASSWORD: str(),
    MONGO_USER_NAME: str(),
    JWT_SECRET: str(),
  });
};

export default validateEnv;
