import { Command } from 'commander';
import dotenv from 'dotenv';

const program = new Command();
program.option('--mode <mode>', 'Work mode', 'DEVELOPMENT');
program.parse();

dotenv.config({
  path: program.opts().mode === 'DEVELOPMENT' ? './.env.development' : './.env.production',
});

export default {
  port: process.env.PORT,
  mongoPassword: process.env.MONGODB_PASSWORD,
  githubSecret: process.env.GITHUB_LOGIN_SECRET,
  persistence: process.env.PERSISTENCE,
  googleEmail: process.env.GOOGLE_EMAIL,
  googlePass: process.env.GOOGLE_PASS,
  twilioSID: process.env.TWILIO_ACCOUNT_SID,
  twilioToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  loggerEnv: process.env.LOGGER_ENV,
  apiUrl: process.env.API_URL,
};