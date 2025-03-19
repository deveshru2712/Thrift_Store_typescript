import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: port(),
  JWT_KEY: str(),
  NODE_ENV: str(),
});
