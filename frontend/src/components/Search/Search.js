import React, { useState } from "react";
import { Home, SearchOutlined } from "@mui/icons-material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link } from "react-router-dom";
import "./Search.css";

function Search() {
  const [tab, setTab] = useState(window.location.pathname);
  return (
    <div className="search">
      <form>
        <SearchOutlined />
        <input type="text" placeholder="Search on E-commerce" />
      </form>

      <Link to="/cart" onClick={() => setTab("/")}>
        {tab === "/cart" ? (
          <Home style={{ color: "black" }} />
        ) : (
          <ShoppingCartOutlinedIcon />
        )}
      </Link>
    </div>
  );
}

export default Search;
