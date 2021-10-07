import React from 'react';
import "./SearchBar.css";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";

function SearchBar({ placeholder, data }) {
    return (
        <div className="SearchBar" >
            <div className="searchInputs" >
                <input type="text" />
                <div className="searchIcon"> 
                    <SearchIcon />
                </div>
            </div>
        </div>
    )
}

export default SearchBar