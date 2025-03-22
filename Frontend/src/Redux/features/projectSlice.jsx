import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    projects: [],
    selectedProject: {},
 
};

const projectSlice = createSlice({
    name: 'Project',
    initialState,
    reducers: {
        setProject: (state, action) => {
            state.projects = action.payload;
        },
        setselectedProject: (state, action) => {
            state.selectedProject = action.payload;
        }
    }
});
export const {  setProject , setselectedProject } = projectSlice.actions;

export default projectSlice.reducer;