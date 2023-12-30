import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSnackbar: {
    show: false,
    message: "",
    type: "",
    verticalPosition:"",
    toastType:''
  },
  showLoader: false,
  refreshApp: false,
  showExpiryAlert:false,
};

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    handleSnackbar(state, action) {
      state.showSnackbar = action.payload;
    },
    showApiLoader(state, action) {
      state.showLoader = action.payload;
    },
    setRefresh(state, action) {
      state.refreshApp = action.payload;
    },
    handleExpiryAlert(state,action) {
      state.showExpiryAlert = action.payload
    }
  },
});
export const commonActions = commonSlice.actions;
export default commonSlice.reducer;
