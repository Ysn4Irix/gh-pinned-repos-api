import slowDown from 'express-slow-down'

export const speedLimiter = slowDown({
	windowMs: 30 * 1000, // 30 seconds
	delayAfter: 5, // allow 5 requests per 30 seconds, then...
	delayMs: 500 // begin adding 500ms of delay per request above 10:
	// request # 11 is delayed by  500ms
	// request # 12 is delayed by 1000ms
	// request # 13 is delayed by 1500ms
	// etc.
})
