import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allAssets: [],
  assetDetail: {},
  searchAssetValue: "",
  assetDetailEngData: {},
  assetDropdownToolkitState: [],
  assetData: {},
  generalDetailsOfAsset: {},
  specificationsOfAsset: {},
  locationsOfAsset: {},
  technicalSpecificationsOfAsset: [],
  showAssetCreationLoading:false,
  showAssetDraftLoading:false
};

const assetSlice = createSlice({
  name: "assetData",
  initialState,
  reducers: {
    getAllAssets(state, action) {
      state.allAssets = action.payload
    },
    getSingleAsset(state, action) {
      state.assetDetail = action.payload
    },
    getTechSpecsOfAsset(state, action) {
      state.technicalSpecificationsOfAsset = action.payload
    },
    setSearchAssetValue(state, action) {
      state.searchAssetValue = action.payload
    },
    setAssetEngData(state, action) {
      state.assetDetailEngData = action.payload
    },
    setAssetDropdownMethod(state, action) {
      state.assetDropdownToolkitState = action.payload;
    },
    setGeneralDetails(state, action) {
      state.generalDetailsOfAsset = action.payload
    },
    setSpecifications(state, action) {
      state.specificationsOfAsset = action.payload
    },
    setLocations(state, action) {
      state.locationsOfAsset = action.payload
    },
    setAssetData(state, action) {
      state.assetData = action.payload
    },
    setAssetCreationLoading(state, action) {
      state.showAssetCreationLoading = action.payload
    },
    setAssetDraftLoading(state, action) {
      state.showAssetCreationLoading = action.payload
    },
  },
});
export const assetActions = assetSlice.actions;
export default assetSlice.reducer;
