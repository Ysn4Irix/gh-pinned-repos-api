import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import favicon from 'serve-favicon'
import responseTime from 'response-time'
import { join } from 'path'
import logger from './helpers/logger.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'
import { rateLimiter } from './middlewares/rateLimiterHandler.js'
import { speedLimiter } from './middlewares/speedLimiterHandler.js'
import { router } from 'express-file-routing'
const app = express()

app.use(responseTime())
app.use(helmet())
app.use(
	cors({
		origin: '*',
		optionsSuccessStatus: 200
	})
)
app.use(compression())
app.use(favicon(join(process.cwd(), 'public', 'favicon.ico')))
app.use(json())
app.use(
	urlencoded({
		extended: false
	})
)

app.use('/api', rateLimiter, speedLimiter, await router())

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
const HOST = process.env.HOST || 'localhost'
app.listen(PORT, () => {
	logger.info(
		`🚀 Server started at ${HOST} on PORT ${PORT} with processId: ${process.pid}`
	)
})

process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
	process.exit(1)
})

process.on('uncaughtException', error => {
	logger.error('Uncaught Exception thrown:', error)
	process.exit(1)
})

export default app
