const sendQuery = require("./utils/send-query")

const UPDATE_PROGRESS = `
	mutation($timestamp: String!, $totalSaved: Float!, $goal: Float!) {
		updateProgress(id: 276208369898881536, data: { timestamp: $timestamp, totalSaved: $totalSaved, goal: $goal }) {
			totalSaved
		}
	}  
`

exports.handler = async event => {
	const { timestamp, totalSaved, goal } = JSON.parse(event.body)
	const { data, errors } = await sendQuery(UPDATE_PROGRESS, {
		timestamp,
		totalSaved,
		goal,
	})

	if (errors) {
		return {
			statusCode: 500,
			body: JSON.stringify(errors),
		}
	}

	return {
		statusCode: 200,
		body: JSON.stringify({ updatedProgress: data.updateProgress }),
	}
}
