import React from "react";

function Header() {
  return (
    <header className="Header">
      <div>
        <h1>StockNews</h1>
      </div>
      <nav>
        <a href="/?city=New York City">New York City</a>
        <a href="/?city=Chicago">Chicago</a>
        <a href="/?city=Toronto">Toronto</a>
        <a href="/?city=Shanghai">Shanghai</a>
      </nav>
    </header>
  );
}

export default Header;
