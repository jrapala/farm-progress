import React, { useEffect, useState } from "react"
import axios from "axios"

import styles from "./index.module.css"

function numberWithCommas(x: number) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export default () => {
	const [status, setStatus] = useState("loading")
	const [percentSaved, setPercentSaved] = useState<string>("0")
	const [totalSaved, setTotalSaved] = useState<string>("0")
	const [timestamp, setTimestamp] = useState<string | null>(null)

	const calculatePercentage = (partialValue: number, totalValue: number) => {
		return ((100 * partialValue) / totalValue).toFixed(2)
	}

	useEffect(() => {
		let canceled = false

		if (status !== "loading") return

		axios("/api/get-progress").then(result => {
			if (canceled === true) return

			if (result.status !== 200) {
				console.error("Error loading progress!")
				console.error(result)
				return
			}

			setPercentSaved(
				calculatePercentage(
					result.data.progress.totalSaved,
					result.data.progress.goal
				)
			)

			setTotalSaved(numberWithCommas(result.data.progress.totalSaved))

			setTimestamp(
				new Date(
					parseInt(result.data.progress.timestamp)
				).toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				})
			)
			setStatus("loaded")
		})

		return () => {
			canceled = true
		}
	}, [status])

	return (
		<main>
			<div>
				<h1>
					<span role="img" aria-label="female farmer">
						👩🏻‍🌾
					</span>{" "}
					Farm Savings Progress Meter{" "}
					<span role="img" aria-label="male farmer">
						👨🏻‍🌾
					</span>
				</h1>
				<div className={`${styles.bar} ${styles.animate}`}>
					<span style={{ width: `${percentSaved}%` }}>
						{parseInt(percentSaved) > 5 && (
							<span className={styles.percentage}>
								{percentSaved}%
							</span>
						)}
					</span>
				</div>
				{/* <p>Total Saved: ${totalSaved}</p> */}
				<p>Percent Saved: {percentSaved}%</p>
			</div>
			<div className={styles.last}>
				{timestamp && (
					<p className={styles.date}>Last Updated: {timestamp}</p>
				)}
			</div>
		</main>
	)
}
