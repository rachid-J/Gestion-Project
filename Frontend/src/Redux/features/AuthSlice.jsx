<<<<<<< HEAD
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    token : localStorage.getItem("token")||null,
    user : null
} 
const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers : {
        Login:(state,action)=>{
            state.token = action.payload.token
            state.user = action.payload.user
            
            localStorage.setItem("token",action.payload.token)
=======
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
        setUser : (state,action)=>{
            state.user = action.payload.user;
>>>>>>> 5c4b9f466dbfc3abdb2327b4f21f8f04c6e3dbbc
        },

        logOut: (state) => {
            state.token = null;
            state.user = {}; 
            localStorage.removeItem("token");
        }
    }
<<<<<<< HEAD
})
export const  {Login,logOut} = authSlice.actions

export default authSlice.reducer
=======
});

export const { setAuth, logOut ,setUser } = authSlice.actions;

export default authSlice.reducer;
>>>>>>> 5c4b9f466dbfc3abdb2327b4f21f8f04c6e3dbbc
