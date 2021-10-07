import React from 'react';
import "./SearchPage.css";
import SearchBar from './Components/SearchBar'

function SearchPage() {
    return (
        <div className="SearchPage">
            <SearchBar placeholder="Enter a song name..." />
        </div>
    )
}

export default SearchPage
