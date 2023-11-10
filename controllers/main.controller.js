import { successResponse } from '../helpers/apiResponse.js'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import logger from '../helpers/logger.js'
import axios from 'axios'
import cheerio from 'cheerio'
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
	size: 500,
	max: 500,
	ttl: 1000 * 60 * 60 * 24 * 7 // 1 week
})

/**
 * @param {import('@types/express').Request} _
 * @param {import('@types/express').Response} res
 * @param {import('@types/express').NextFunction} next
 * @returns {object} object
 */
export const healthcheck = (_, res, next) => {
	try {
		res.status(StatusCodes.OK).json(
			successResponse(
				getReasonPhrase(StatusCodes.OK),
				res.statusCode,
				'Server is up and running'
			)
		)
	} catch (err) {
		logger.error(err.message)
		next(err)
	}
}

/**
 * @param {import('@types/express').Request} req
 * @param {import('@types/express').Response} res
 * @param {import('@types/express').NextFunction} next
 * @returns {object} object
 */
export const getPinnedRepos = async (req, res, next) => {
	try {
		const { username } = req.query
		if (!username) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				code: StatusCodes.BAD_REQUEST,
				status: getReasonPhrase(StatusCodes.BAD_REQUEST),
				error: 'Username is required'
			})
		}

		if (cache.has(username)) {
			const cached = cache.get(username)
			return res
				.status(StatusCodes.OK)
				.json(
					successResponse(
						getReasonPhrase(StatusCodes.OK),
						res.statusCode,
						cached
					)
				)
		} else {
			const response = await axios(`https://github.com/${username}`)

			const $ = cheerio.load(response.data)

			const element = $('.js-pinned-item-list-item').toArray()

			if (!element || element.length === 0) {
				return res.status(StatusCodes.NOT_FOUND).json({
					code: StatusCodes.NOT_FOUND,
					status: getReasonPhrase(StatusCodes.NOT_FOUND),
					error: 'No pinned repositories found'
				})
			}

			const pinnedRepos = []

			for (const [index, el] of element.entries()) {
				const name = getName($, el)
				const repo = getRepo($, el)
				const description = getDescription($, el)
				const demo = await getRepoWebsite(repo)
				const language = {
					name: getLanguage($, el),
					color: getLanguageColor($, el)
				}
				const stars = getStars($, el)
				const forks = getForks($, el)

				pinnedRepos[index] = {
					name,
					repo,
					description,
					demo,
					language,
					stars: stars ? convertHumanReadableNumber(stars) : 0,
					forks: forks ? convertHumanReadableNumber(forks) : 0
				}
			}

			cache.set(username, pinnedRepos)
			res.status(StatusCodes.OK).json(
				successResponse(
					getReasonPhrase(StatusCodes.OK),
					res.statusCode,
					pinnedRepos
				)
			)
		}
	} catch (error) {
		logger.error(error.message)
		if (error.status === StatusCodes.NOT_FOUND) {
			return res.status(StatusCodes.NOT_FOUND).json({
				code: StatusCodes.NOT_FOUND,
				status: getReasonPhrase(StatusCodes.NOT_FOUND),
				error: 'User not found'
			})
		}

		next(error)
	}
}

const getName = ($, element) => {
	try {
		return $(element).find('span.repo').text().trim()
	} catch (error) {
		return 0
	}
}

const getRepo = ($, element) => {
	try {
		return 'https://github.com' + $(element).find('a').attr('href').trim()
	} catch (error) {
		return 0
	}
}

const getRepoWebsite = async repo => {
	const html = await axios(repo)
	const $ = cheerio.load(html.data)
	const demo = $(
		'#repo-content-pjax-container > div > div > div.Layout.Layout--flowRow-until-md.Layout--sidebarPosition-end.Layout--sidebarPosition-flowRow-end > div.Layout-sidebar > div > div.BorderGrid-row.hide-sm.hide-md > div > div.my-3.d-flex.flex-items-center > span > a'
	).attr('href')

	return demo
}

const getDescription = ($, element) => {
	try {
		return $(element)
			.find('p.pinned-item-desc.color-fg-muted.text-small.mt-2.mb-0')
			.text()
			.trim()
	} catch (error) {
		return 0
	}
}

const getForks = ($, element) => {
	try {
		return $(element).find('p > a:nth-child(3)').text().trim()
	} catch (error) {
		return 0
	}
}

const getStars = ($, element) => {
	try {
		return $(element).find('a[href$="stargazers"]').text().trim()
	} catch (error) {
		return 0
	}
}

const getLanguage = ($, element) => {
	try {
		return $(element)
			.find('span[itemprop="programmingLanguage"]')
			.text()
			.trim()
	} catch (error) {
		return 0
	}
}

const getLanguageColor = ($, element) => {
	try {
		return $(element).find('.repo-language-color').css('background-color')
	} catch (error) {
		return 0
	}
}

const convertHumanReadableNumber = humanReadableNumber => {
	const units = {
		k: 1000,
		m: 1000000
	}
	const match = humanReadableNumber.match(/^(\d+(\.\d+)?)([km])?$/i)
	if (!match) {
		// Invalid format
		return NaN
	}
	const [, numberPart, decimalPart, unit] = match
	const multiplier = units[unit?.toLowerCase()] || 1

	return parseFloat(numberPart) * multiplier
}
