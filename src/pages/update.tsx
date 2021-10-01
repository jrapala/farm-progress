import React, { useState, useEffect } from "react"
import axios from "axios"
import { navigate } from "@reach/router"

import styles from "./index.module.css"

export default () => {
	const [status, setStatus] = useState<"loading" | "loaded" | "success">(
		"loaded"
	)
	const [totalSaved, setTotalSaved] = useState<number>()

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTotalSaved(Number(e.target.value))
	}

	const handleOnClick = (e: React.MouseEvent) => {
		setStatus("loading")

		axios({
			method: "POST",
			url: "/api/update-progress",
			data: {
				timestamp: String(Date.now()),
				totalSaved,
				goal: 150000,
			},
		}).then(result => {
			if (result.status !== 200) {
				console.error("Error updating progress!")
				console.error(result)
				return
			}

			setStatus("success")
		})
	}

	const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()
	}

	useEffect(() => {
		if (status === "success") {
			navigate("/")
		}
	}, [status])

	return (
		<main>
			<h1>Update Farm Fund Progress</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<fieldset>
					<legend className={styles.visuallyHidden}>
						Update Farm Fund Progress
					</legend>
					<label htmlFor="total">Total Saved:</label>
					<input
						id="total"
						name="total"
						type="number"
						min="0.00"
						step="0.01"
						onChange={handleChange}
						className={styles.outline}
					/>
					<div className={styles.buttonWrapper}>
						<button
							disabled={status === "loading"}
							type="submit"
							className={`${styles.button} ${styles.outline}`}
							onClick={handleOnClick}
						>
							{status === "loading" ? "Submitting..." : "Submit"}
						</button>
					</div>
				</fieldset>
			</form>
		</main>
	)
}
