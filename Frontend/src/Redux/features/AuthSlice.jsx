import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") || null,
    user: {} 
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("token", action.payload.token);
        },

        logOut: (state) => {
            state.token = null;
            state.user = {}; 
            localStorage.removeItem("token");
        }
    }
});

export const { setAuth, logOut } = authSlice.actions;

export default authSlice.reducer;
