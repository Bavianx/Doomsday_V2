import React from 'react'
import { useState } from 'react'

interface SearchBarProps {
    onSearch: (query: string) => void
}

function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState('')

    return (
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch(query)
            }}
            placeholder="Search threats..."
            className="bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-red-500 placeholder-gray-500"
        />
    )
}

export default SearchBar