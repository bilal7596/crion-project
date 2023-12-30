import { configureStore } from "@reduxjs/toolkit";
import CommonReducer from "./Reducers/CommonReducer";
import ClonosUserReducer from "./Reducers/ClonosUserReducer";
import ClonosAssetReducer from "./Reducers/ClonosAssetReducer";
import ClonosDocumentReducer from "./Reducers/ClonosDocumentReducer";
import ClonosNotificationsReducer from "./Reducers/ClonosNotificationsReducer";
import ClonosApprovalReducer from "./Reducers/ClonosApprovalReducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import ClonosDynamicFormReducer from "./Reducers/ClonosDynamicFormReducer";
import ClonosCommentsReducer from "./Reducers/ClonosCommentsReducer";
import ClonosWorkOrderReducer from "./Reducers/ClonosWorkOrderReducer";
import ClonosGlobalEntities from "./Reducers/ClonosGlobalEntities";
import ClonosTemplateReducer from "./Reducers/ClonosChecklistAndReportsReducer";
export const store = configureStore({
  reducer: {
    commonData: CommonReducer,
    userData: ClonosUserReducer,
    assetData: ClonosAssetReducer,
    documentData: ClonosDocumentReducer,
    notificationsData: ClonosNotificationsReducer,
    approvalData: ClonosApprovalReducer,
    dynamicFormStateManagement: ClonosDynamicFormReducer,
    commentsStateManagement: ClonosCommentsReducer,
    workOrderStateManagement: ClonosWorkOrderReducer,
    globalEntitiesStateManagement: ClonosGlobalEntities,
    checklistTemplateData:ClonosTemplateReducer
  },
}, composeWithDevTools());
