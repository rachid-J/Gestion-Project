import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/AuthSlice";
export const Store = configureStore({
    reducer : {
        auth : authSlice
    }
})
