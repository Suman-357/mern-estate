import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    error : null,
    loading : false,
};

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true
        },
        signInsuccess: (state, action) =>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInfailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        updateuserstart: (state) => {
            state.loading = true;
        },

        updateusersuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },

        updateuserfailure: (state,action) => {
            state.error = action.payload;
            state.loading = false;
        },

        deleteuserstart: (state) => {
            state.loading = true;
        },

        deleteusersuccess: (state, action) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },

        deleteuserfailure: (state,action) => {
            state.error = action.payload;
            state.loading = false;
        },

    }
});

export const {signInStart, signInsuccess, signInfailure, updateuserstart, updateusersuccess, updateuserfailure, deleteuserfailure, deleteusersuccess, deleteuserstart} = userSlice.actions;

export default userSlice.reducer