import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducers";
import { productsReducer } from "./reducers/productReducers";

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productsReducer,
  },
});

export default store;
