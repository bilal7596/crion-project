import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   : [],
// };

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    getUnReadNotifications(state, action) {
      state.unReadNotifications = action.payload;
    },
    getUnReadNotificationsCount(state, action) {
      state.unReadNotificationsCount = action.payload
    },
    setUnReadNotificationsCount(state, actoin) {
      state.unReadNotificationsCount = actoin.payload
    },
    // New toolkit Methods  
    setAllNotificationsMethod(state, action) {
      state.allNotificationsToolkitState = action.payload
    }
  },
});
export const notificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
