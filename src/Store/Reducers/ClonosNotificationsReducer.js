import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unReadNotifications: [],
  unReadNotificationsCount: 0,
  readNotifications: [],
  skippedNotifications: [],
  // New Toolkit States 
  allNotificationsToolkitState: [],
  alarmsDropdown : [],
  communicationChannels : [],
  MAMSDropdownValues:[],
  urgencyLevels : [],
  alertTypes : []
};

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
    },
    getAlarmsDropdownMethos(state,action) {
      state.alarmsDropdown = action.payload
    },
    getCommunicationChannelsDropdownMethos(state,action) {
      state.communicationChannels = action.payload
    },
    getUrgencyLevelDropdownMethos(state,action) {
      state.urgencyLevels = action.payload
    },
    getAlertTypeDropdownMethos(state,action) {
      state.urgencyLevels = action.payload
    },
    getMAMSDropdownValues(state,action) {
      state.MAMSDropdownValues = action.payload
    }
  },
});
export const notificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
