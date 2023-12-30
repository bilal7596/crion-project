import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workOrderToolkitState: [],
  singleWorkOrderToolkitState: [],
  workOrderPriorityDropdownToolkitState: [],
  workOrderStatusDropdownToolkitState: [],
  workOrderDepartmentDropdownToolkitState: [],
};

const workOrderStateManagementSlice = createSlice({
  name: "workOrderStateManagement",
  initialState,
  reducers: {
    setWorkOrderMethod(state, action) {
      state.workOrderToolkitState = action.payload;
    },
    setSingleWorkOrderMethod(state, action) {
      state.singleWorkOrderToolkitState = action.payload;
    },
    setWorkOrderPriorityDropdownMethod(state, action) {
      state.workOrderPriorityDropdownToolkitState = action.payload;
    },
    setWorkOrderStatusDropdownMethod(state, action) {
      state.workOrderStatusDropdownToolkitState = action.payload;
    }
  },
});

export const workOrderStateManagementActions =
  workOrderStateManagementSlice.actions;
export default workOrderStateManagementSlice.reducer;

