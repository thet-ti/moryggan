import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import express from 'express';
import { env } from './utils/env';
import { logger } from './utils/logger';
import { router as routes } from './routes/routes';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(errorHandler());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use('/api', routes);

app.listen(env.NODE_PORT, () => logger.info(`Server running on port: ${env.NODE_PORT}`));
