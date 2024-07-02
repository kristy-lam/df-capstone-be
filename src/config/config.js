import { config } from "dotenv";

const loadConfig = () => {
  const env = process.env.NODE_ENV;
  config({
    path: `.env${env !== `prod` ? `.${env}` : ``}`,
  });
};

export default loadConfig;
