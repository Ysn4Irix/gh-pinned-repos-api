export const successResponse = (statusMessage, statusCode, response) => {
	return {
		isError: false,
		statusMessage,
		statusCode,
		response
	}
}

export const errorResponse = (statusMessage, statusCode, error) => {
	return {
		isError: true,
		statusMessage,
		statusCode,
		error
	}
}
