import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    commentsToolkitState: []
}

const commentsStateManagementSlice = createSlice({
    name: "commentsStateManagement",
    initialState,
    reducers: {
        setCommentsMethod(state, action) {
            state.commentsToolkitState = action.payload;
        },
    },
})


export const commentsStateManagementActions =
    commentsStateManagementSlice.actions;
export default commentsStateManagementSlice.reducer;