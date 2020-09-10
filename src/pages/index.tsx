import React, { useEffect, useState } from "react"
import axios from "axios"

import styles from "./index.module.css"

export default () => {
	const [status, setStatus] = useState("loading")
	const [percentSaved, setPercentSaved] = useState<string>("0")

	const calculatePercentage = (partialValue: number, totalValue: number) => {
		return ((100 * partialValue) / totalValue).toFixed(2)
	}

	useEffect(() => {
		let canceled = false

		if (status !== "loading") return

		axios("/api/get-progress").then(result => {
			if (canceled === true) return

			if (result.status !== 200) {
				console.error("Error loading todos!")
				console.error(result)
				return
			}
			console.log(result.data.progress.totalSaved)
			setPercentSaved(
				calculatePercentage(
					result.data.progress.totalSaved,
					result.data.progress.goal
				)
			)
			setStatus("loaded")
		})

		return () => {
			canceled = true
		}
	}, [status])

	return (
		<main>
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
			<p>Percent Saved: {percentSaved}%</p>
		</main>
	)
}
