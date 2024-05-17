'use client'
import React, { ChangeEvent, useState } from 'react'

export type SearchProps = {
	onSearch: (value: string) => void
}

const SearchAdmin = ({ onSearch }: SearchProps) => {
	const [value, setValue] = useState('')

	const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value)
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			onSearch(value)
		}
	}

	return (
		<div className="relative w-full">
			<input
				type="search"
				name="search"
				value={value}
				placeholder="Enter search..."
				className="h-10 w-full rounded-full bg-border px-5 pr-10 text-sm focus:outline-none focus-visible:ring-blue-600"
				onChange={searchHandler}
				onKeyDown={handleKeyDown}
			/>
			<button type="submit" className="absolute right-0 top-0 mr-4 mt-3">
				<svg
					className="h-4 w-4 fill-current"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
				>
					<path
						fillRule="evenodd"
						d="M13.53 14.47a8 8 0 111.414-1.414l3.96 3.96a1 1 0 01-1.414 1.414l-3.96-3.96zM8 14a6 6 0 100-12 6 6 0 000 12z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
		</div>
	)
}

export default SearchAdmin
