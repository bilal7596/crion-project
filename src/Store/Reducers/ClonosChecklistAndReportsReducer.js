import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    checklistTemplateAttributes : [],
    checklistGeneralDetailsCreationDetails:{}
}

const ChecklistAndReportsSlice = createSlice({
    name: "ChecklistTemplate",
    initialState,
    reducers: {
      setSelectedAttributesToolkitState(state, action) {
        state.checklistTemplateAttributes = action.payload;
      },
      setChecklistGeneralDetailsCreationDetails(state, action) {
        state.checklistGeneralDetailsCreationDetails = action.payload;
      },
    },
  });
  
  export const ChecklistAndReportsAction =
  ChecklistAndReportsSlice.actions;

  export default ChecklistAndReportsSlice.reducer;