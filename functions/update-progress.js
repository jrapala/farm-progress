const sendQuery = require("./utils/send-query")

const UPDATE_PROGRESS = `
	mutation($id: ID!, $totalSaved: Float!, $goal: Float!) {
		updateProgress(id: $id, data: { totalSaved: $totalSaved, goal: $goal }) {
			_id
			totalSaved
			goal
			timestamp
		}
	}  
`

exports.handler = async event => {
	const { id, totalSaved, goal } = JSON.parse(event.body)
	const { data, errors } = await sendQuery(UPDATE_PROGRESS, {
		id,
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
