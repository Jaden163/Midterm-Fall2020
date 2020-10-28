import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faSearch } from "@fortawesome/free-solid-svg-icons";

function SearchBar() {
  return (
    <a className="SearchFormAnchor">
      <form className="SearchForm">
        <input
          className="SearchBox"
          type="text"
          placeholder="Search"
          name="company"
        />
        <button className="SearchIcon" type="submit">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    </a>
  );
}

export default SearchBar;
