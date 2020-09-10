const sendQuery = require("./utils/send-query")

const GET_PROGRESS = `
	query {
		progress {
			_id
			totalSaved
			goal
			timestamp
		}
	}
`

exports.handler = async () => {
	const { data, errors } = await sendQuery(GET_PROGRESS)

	if (errors) {
		return {
			statusCode: 500,
			body: JSON.stringify(errors),
		}
	}

	return {
		statusCode: 200,
		body: JSON.stringify({ progress: data.progress }),
	}
}
