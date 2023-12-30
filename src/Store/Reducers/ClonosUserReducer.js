import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetail: {},
  allUsers: [],
  allRoles: [],
  allDepartments: [],
  loggedUserPermissions: [],
  assignedPermissions: {},
  allUsersDropdownToolkitState: [],
  teamsDropdownToolkitState: [],
  tokenToolkitState: {}
};

const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    getUserData(state, action) {
      state.userDetail = action.payload
    },
    getAllUsers(state, action) {
      state.allUsers = action.payload
    },
    setUsersDropdownMethod(state, action) {
      state.allUsersDropdownToolkitState = action.payload;
    },
    setTeamDropdownMethod(state, action) {
      state.teamsDropdownToolkitState = action.payload;
    },
    getAllRoles(state, action) {
      state.allRoles = action.payload
    },
    getAllDepartments(state, action) {
      state.allDepartments = action.payload
    },
    setLoggedUsersPermissions(state, action) {
      state.loggedUserPermissions = action.payload
    },
    setAssignedPermissions(state, action) {
      state.assignedPermissions = action.payload
    },
    setTokenMethod(state, action) {
      state.tokenToolkitState = action.payload
    },
  },
});
export const userActions = userSlice.actions;
export default userSlice.reducer;
