import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Search from "./components/Search/Search";
import Home from "./components/Home/Home";
import Account from "./components/Account/Account";
import Categories from "./components/Categories/Categories";
import Cart from "./components/Cart/Cart";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Search />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
