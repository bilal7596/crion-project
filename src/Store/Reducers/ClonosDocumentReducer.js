import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchDocuments: [],
  allDocuments: [],
  associatedDocuments: [],
  dynamicFormAttrs: [],
  dynamicFormName: "",
  errAttrId: "",
  addFormAttrs: [],
  singleDocument: {},
  documentTypesDropdownTooltipState: [],
  documentStatusDropdownTooltipState: [],
  uploaderLoader : false
};

const documentSlice = createSlice({
  name: "documentData",
  initialState,
  reducers: {
    getAllDocs(state, action) {
      state.allDocuments = action.payload;
    },
    getAssociatedDocuments(state, action) {
      state.associatedDocuments = action.payload;
    },
    getSingleDocument(state, action) {
      state.singleDocument = action.payload
    },
    setAllSearchDocuments(state, action) {
      state.searchDocuments = action.payload;
    },
    setDynamicFormAttr(state, action) {
      state.dynamicFormAttrs = action.payload;
    },
    setDynamicFormName(state, action) {
      state.dynamicFormName = action.payload;
    },
    setAddFormAttrs(state, action) {
      state.addFormAttrs = action.payload;
    },
    

    // New states for Document Management in ONGC project.
    setDocumentTypesMethod(state, action) {
      state.documentTypesDropdownTooltipState = action.payload
    },
    setDocumentStatusMethod(state, action) {
      state.documentStatusDropdownTooltipState = action.payload
    },
    setDocumentsMethod(state, action) {
      state.documentsTooltipState = action.payload
    },
    setUploaderLoading(state,action) {
      state.uploaderLoader = action.payload
    },
  },
});
export const documentActions = documentSlice.actions;
export default documentSlice.reducer;
