import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fieldTypeDataToolkitState: [],
  addedFieldTypeDataToolkitState: [],
  recordOfPositionsOfAttributesToolkitState: {},
  activeFormIdToolkitState: "",
  assoDocDataToolkitState: [],
  // Image State 
  recordOfHeightAndWidthOfImagesToolkitState: {},
  //  Line States 
  recordOfLinesCoordinatesToolkitState: {},
  undoLinesToolkitState : [],
  redoLinesToolkitState : [],
  recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState : {},
  recordOfUndoLinesAreAvailableInToolkit: {},
  recordOfUndoLinesCoordinatesToolkitState: {},

};

const dynamicFormStateManagementSlice = createSlice({
  name: "dynamicFormStateManagement",
  initialState,
  reducers: {
    setFieldTypeDataMethod(state, action) {
      state.fieldTypeDataToolkitState = action.payload;
    },
    setAddedFieldTypeDataMethod(state, action) {
      state.addedFieldTypeDataToolkitState = action.payload;
    },
    setRecordOfPositionsOfAttributesMethod(state, action) {
      state.recordOfPositionsOfAttributesToolkitState = action.payload;
    },
    setActiveFormIdMethod(state, action) {
      state.activeFormIdToolkitState = action.payload;
    },
    setAssoDocDataMethod(state, action) {
      state.assoDocDataToolkitState = action.payload
    },
    setRecordOfHeightAndWidthOfImagesMethod(state, action) {
      state.recordOfHeightAndWidthOfImagesToolkitState = action.payload
    },
    setRecordOfLinesCoordinatesMethod(state, action) {
      state.recordOfLinesCoordinatesToolkitState = action.payload
    },
    setUndoLinesMethod(state,action) {
      state.undoLinesToolkitState = action.payload
    },
    setRedoLinesMethod(state,action) {
      state.redoLinesToolkitState = action.payload
    },
    setRecordOfHowManyLinesAreAvailableIntoTheCanvasMethod(state, action) {
      state.recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState = action.payload
    },
    setRecordOfUndoLinesAreAvailableInToolkitStateMethod(state, action) {
      state.recordOfUndoLinesAreAvailableInToolkit = action.payload
    },
    setRecordOfUndoLinesCoordinatesMethod(state,action){
      state.recordOfUndoLinesCoordinatesToolkitState = action.payload
    }
  },
});

export const dynamicFormStateManagementActions =
  dynamicFormStateManagementSlice.actions;
export default dynamicFormStateManagementSlice.reducer;

