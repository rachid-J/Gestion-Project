const initialeState = {
    token : localStorage.getItem("token")||null,
    user : null
} 
const authSlice = {
    name:"auth",
    initialeState,
    reducers : {
        Login:(state,action)=>{
            state.token = action.payload.token
            state.user = action.payload.user
            
            localStorage.setItem("token",action.payload.token)
        },

        logOut:(state)=>{
            state.token = null
            state.user = null 

            localStorage.removeItem("token")
        }
    }
}
export const  {Login,logOut} = authSlice.action

export default authSlice.reducers