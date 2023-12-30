import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mainLayoutChildrenPositionsToolkitState: {}
};

const globalEntitiesSlice = createSlice({
    name: "globalEntitiesStateManagement",
    initialState,
    reducers: {
        setMainLayoutChildrenPosition(state, action) {
            state.mainLayoutChildrenPositionsToolkitState = action.payload;
        },
    },
});
export const globalEntitiesActions = globalEntitiesSlice.actions;
export default globalEntitiesSlice.reducer;
