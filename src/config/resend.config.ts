import { registerAs } from '@nestjs/config';
import { configResend } from './const';

export default registerAs(configResend, () => ({
  apiKey: process.env.RESEND_API_KEY || '',
}));
