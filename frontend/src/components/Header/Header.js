import React from "react";
import headerImage from "./header1.png";
import "./Header.css";

function Header() {
  return (
    <header>
      <img
        src={headerImage}
        alt="KakeboApp logo"
        style={{ width: "100%", height: "auto" }}
      />
    </header>
  );
}

export default Header;
