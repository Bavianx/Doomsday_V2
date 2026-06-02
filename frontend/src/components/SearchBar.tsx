import React from 'react'
import { useState } from 'react'

interface SearchBarProps {         //TS blueprint which defines the prop which must take a string as a query and returns nothing
    onSearch: (query: string) => void
}

function SearchBar({ onSearch }: SearchBarProps) { //take input query and send it over to the function App for json return 
    const [query, setQuery] = useState('')// user input of data 

    return (
        <input
            type="text"
            value={query}   // value returns the data related to the query
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch(query)  // triggers onsearch for the current query alerting the setSearchQuery within the app to update the parents state
            }}
            placeholder="Search threats..."
            className="bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-red-500 placeholder-gray-500"
        />
    )
}

export default SearchBar