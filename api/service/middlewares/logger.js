import logger from 'morgan';

// Create request logger middleware with 'dev' format
const requestLogger = logger('dev');

export default requestLogger;