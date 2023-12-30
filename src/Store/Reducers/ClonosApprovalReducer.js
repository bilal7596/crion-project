import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allApprovals: [],
  pendingApprovals: [],
};

 const approvalSlice = createSlice({
  name: "approvalData",
  initialState,
  reducers: {
      getAllChanges(state, action) {
        state.allApprovals = action.payload
      },
      getPendingApprovals(state, action) {
        state.pendingApprovals = action.payload
      },
  },
});
export const approvalActions = approvalSlice.actions;
export default approvalSlice.reducer;
