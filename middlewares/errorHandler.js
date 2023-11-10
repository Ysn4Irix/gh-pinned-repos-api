import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { errorResponse } from '../helpers/apiResponse.js'
const { NODE_ENV } = process.env

/**
 * @param {import('@types/express').Request} req
 * @param {import('@types/express').Response} res
 */
export const notFound = (req, res, next) => {
	res.status(StatusCodes.NOT_FOUND)
	const err = new Error(`requested url ${req.originalUrl} not found`)
	next(err)
}

/**
 *
 * @param {import('@types/express').ErrorRequestHandler} err
 * @param {import('@types/express').Request} req
 * @param {import('@types/express').Response} res
 * @param {import('@types/express').NextFunction} next
 */
export const errorHandler = (err, req, res, next) => {
	const statusCode =
		res.statusCode === 200
			? StatusCodes.INTERNAL_SERVER_ERROR
			: res.statusCode

	res.status(statusCode).json(
		errorResponse(getReasonPhrase(statusCode), statusCode, {
			message:
				statusCode === StatusCodes.INTERNAL_SERVER_ERROR
					? 'Oops! there was an error while processing your request 😢'
					: err.message,
			stack: NODE_ENV === 'prod' ? '🙄🙄' : err.stack
		})
	)
}
