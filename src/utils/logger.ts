import moment from 'moment';
import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.printf(({ level, message }) => `[${moment().format('DD/MM/YYYY - HH:mm')}] ${level}: ${message}`),
  ),
});
