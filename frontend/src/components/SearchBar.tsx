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
            className="bg-transparent border-0 border-b border-gray-600 text-gray-200 text-sm px-2 py-2 w-96 focus:outline-none focus:border-red-500 placeholder-gray-500 transition-colors"
        />
    )
}

export default SearchBar