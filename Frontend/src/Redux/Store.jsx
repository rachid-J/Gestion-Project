
import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import  projectSlice  from "./features/projectSlice";
export const Store = configureStore({
    reducer : {
        auth : authSlice,
        project : projectSlice
    }
})
