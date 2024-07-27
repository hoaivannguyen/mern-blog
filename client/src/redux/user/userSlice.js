import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signinStart: (state) => {
            state.loading = true
            state.error = null
        },
        signinSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.currentUser = action.payload
        },
        signinFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateStart: (state) => {
            state.loading = true
            state.error = null
        },
        updateSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.currentUser = action.payload
        },
        updateFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        deleteUserStart: (state) => {
            state.loading = true
            state.error = null
        },
        deleteUserSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.currentUser = null
        },
        deleteUserFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        }
    }
});

export const { 
    signinStart, 
    signinSuccess, 
    signinFailure, 
    updateStart, 
    updateSuccess, 
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure
 } = userSlice.actions;

export default userSlice.reducer;