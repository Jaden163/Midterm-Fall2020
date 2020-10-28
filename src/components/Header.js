import React from "react";
import SearchBar from "../components/SearchBar";

function Header() {
  return (
    <header className="Header">
      <div>
        <h1>StockNews</h1>
      </div>
      <nav>
        <a className="HeaderLabel" href="/?company=Apple">
          Apple
        </a>
        <a className="HeaderLabel" href="/?company=Advanced Micro Devices">
          AMD
        </a>
        <a className="HeaderLabel" href="/?company=Microsoft">
          Microsoft
        </a>
        <a className="HeaderLabel" href="/?company=Tesla">
          Tesla
        </a>
        <SearchBar />
      </nav>
    </header>
  );
}

export default Header;
