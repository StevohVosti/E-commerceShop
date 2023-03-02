import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  HomeOutlined,
  SearchOutlined,
  Search,
  AccountCircle,
  AccountCircleOutlined,
} from "@mui/icons-material";
import "./Header.css";
import ListAltIcon from '@mui/icons-material/ListAlt';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';


function Header() {
  const [tab, setTab] = useState(window.location.pathname);
  return (
    <div className="header">
      <div className="header-logo">
        <img src="" alt="logo" />
      </div>
      <Link to="/" onClick={() => setTab("/")}>
        {tab === "/" ? <Home style={{ color: "black" }} /> : <HomeOutlined />}
      </Link>

      <Link to="/categories" onClick={() => setTab("/newpost")}>
        {tab === "/categories" ? (
          <ListAltIcon style={{ color: "black" }} />
        ) : (
          <ListAltOutlinedIcon />
        )}
      </Link>

      <Link to="/search" onClick={() => setTab("/search")}>
        {tab === "/search" ? (
          <Search style={{ color: "black" }} />
        ) : (
          <SearchOutlined />
        )}
      </Link>

      <Link to="/cart" onClick={() => setTab("/cart")}>
        {tab === "/cart" ? (
          <Search style={{ color: "black" }} />
        ) : (
          <SearchOutlined />
        )}
      </Link>

      <Link to="/account" onClick={() => setTab("/account")}>
        {tab === "/account" ? (
          <AccountCircle style={{ color: "black" }} />
        ) : (
          <AccountCircleOutlined />
        )}
      </Link>
    </div>
  );
}

export default Header;
