import rateLimit from 'express-rate-limit'
import { errorResponse } from '../helpers/apiResponse.js'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export const rateLimiter = rateLimit({
	windowMs: 30 * 1000, // 30 seconds
	max: 10, // limit each IP to 10 requests per windowMs
	message: errorResponse(
		getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS),
		StatusCodes.TOO_MANY_REQUESTS,
		{
			message:
				'Too many requests from this IP, please try again after 30 seconds'
		}
	)
})
