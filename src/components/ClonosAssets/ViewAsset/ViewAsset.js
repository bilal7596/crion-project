import { useLocation, useNavigate } from "react-router-dom";
import Styles from "../../../ModuleStyles/Assets/viewAsset.module.css";
import CommonNavigator from "../../CommonComponents/Navigator/Navigator";
import { ViewAssetGeneralDetails } from "./ViewAssetGeneralDetails";
import { useEffect } from "react";
import { getSingleAsset } from "../../../Api/Asset/assetApi";
import { useDispatch, useSelector } from "react-redux";
import { assetActions } from "../../../Store/Reducers/ClonosAssetReducer";
import { useState } from "react";
import { ViewAssetHistory } from "./ViewAssetHistory";
import { ViewAssetPerformanceData } from "./ViewAssetPerforamanceData";
import { ViewAssetDocuments } from "./ViewAssetDocuments";
import { ViewAssetSparesAndInventory } from "./ViewAssetSparesAndInventory";
import { Tooltip } from "@material-ui/core";
import DELETEICON from "../../../assets/UIUX/icons/deleteIcon.svg";
import EDITICON from "../../../assets/UIUX/icons/editIcon.svg";
import { getUser, handleAllowDirectAccessPage, handleEncryptionURLKeys, handleSegregateURL, updateLayout } from "../../../utils/clonosCommon";
import { ViewAsset3DDetails } from "./ViewAsset3DDetails";
import Subbar from "../../WorkOrder/Subbar";
import ClonosConfirmationDialog from "../../Dialogs/ClonosConfirmationDialog";
import {
  handleDeleteAsset,
  handleEditAsset,
} from "../../../utils/AssetsMethods/AssetRegister";
import { optionalParamsForSingleAsset } from "../../../utils/AssetsMethods/constants";
import { lcHandleDummyEncryption } from "../../../utils/WorkOrderMethods/WorkOrderMethods";
import ViewAssetParameters from "./ViewAssetParameters";
import ViewAssetReferenceManuals from "./ViewAssetReferenceManuals";
import { ViewMaintenanceTask } from "./ViewMaintenanceTask";
export const ViewAsset = () => {
  const { mainLayoutChildrenPositionsToolkitState } = useSelector(
    (store) => store.globalEntitiesStateManagement
  );
  const navigatorValues = [
    { value: "General Details", status: true },
    { value: "Parameters", status: false },
    { value: "Reference Manuals", status: false },
    { value: "3D", status: false },
    { value: "History", status: false },
    { value: "Performance Data", status: false },
    { value: "Spares & Inventory", status: false },
    { value: "Documents", status: false },
    { value: "Maintenance Task", status: false },
  ];
  const [selectedFilter, setSelectedFilter] = useState("General Details");
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const user = getUser();
  const [assetDetails, setAssetDetails] = useState({});
  const [showDeleteDailog, setShowDeleteDailog] = useState(false);
  const Location = useLocation();
  const handleDecommission = () => {
    const currentDate = new Date();
    const isoFormattedDate = currentDate.toISOString();
    handleEditAsset({
      assetId: assetDetails?._id,
      formData: { assetStatus: "Draft", decommissionedDate: isoFormattedDate },
      loggedUser: user?.userId,
      dispatch,
      Navigate,
      page: 1,
      limit: 10
    });
  };
  console.log('assetDetails:', assetDetails)

  const buttons = [
    {
      isActive: true,
      buttonMethod: handleDecommission,
      buttonText:
        assetDetails?.assetStatus === "decommissioned"
          ? "Retired"
          : assetDetails?.assetStatus === "scheduled"
            ? "Decommission"
            : "Decommission",
    },
  ];
  const getSelectedValue = (value) => {
    setSelectedFilter(value);
  };
  useEffect(() => {


    //Segregate URL parameters
    const URL = handleSegregateURL();

    //Check if Unity is enabled in the URL
    if (URL?.unity == 1) {
      (async () => {
        try {
          //Allow direct access and fetch the asset ID
          const assetId = await handleAllowDirectAccessPage({ keyName: "assetId" });
          //Get and update the single asset based on the obtained ID
          getSingleAsset(assetId, optionalParamsForSingleAsset).then(
            (res) => {
              console.log(res?.data?.result, "from >>>>");
              setAssetDetails(res?.data?.result);
            }
          );
        } catch (err) {
          console.log('err:', err);
        }
      })();
    } else {
      getSingleAsset(Location?.state?.assetId, optionalParamsForSingleAsset).then(
        (res) => {
          console.log(res?.data?.result, "from >>>>");
          setAssetDetails(res?.data?.result);
        }
      );
    }
    updateLayout({ dispatch });
    const encryptedValue = handleEncryptionURLKeys({ needToEncrypt: Location?.state?.assetId })
    console.log('encryptedValue:', encryptedValue)

  }, []);
  console.log(Location, "asd");

  return (
    <>
      <div
        className={Styles.viewAssetMainContainer}
        style={{
          height:
            mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart
              ?.height,
        }}
      >
        {/* <div className={Styles.v_a_header}>
        <Tooltip title={assetDetails?.assetName}>
        <h4 className={Styles.v_a_title}>{assetDetails?.assetName}</h4>
        </Tooltip>
        <div style={{display:"flex",gridGap:"16px",alignItems:"center"}}>
        <p style={{color:"red",fontSize:"16px"}}>Mark as Retired</p>
        <img src={EDITICON} onClick={() => Navigate("/edit-asset",{ state: {assetId:assetDetails?._id,activePage:Location?.state?.activePage,limit:Location?.state?.limit} })}/>
        <img src={DELETEICON}/>
        </div>
      </div> */}
        <div style={{height:"70px"}}>
          <Subbar
            isStatus={true}
            isCreatedOn={true}
            isDelete={true}
            isDeleteMethod={() => setShowDeleteDailog(true)}
            isEdit={true}
            isEditMethod={() =>
              Navigate("/edit-asset", {
                state: {
                  assetId: assetDetails?._id,
                  activePage: Location?.state?.activePage,
                  limit: Location?.state?.limit,
                },
              })
            }
            isHollow={true}
            subbarData={assetDetails}
            buttonText={"Decommission"}
            buttons={buttons}
          />
        </div>
        <div className={Styles.v_a_contentContainer} style={{ height: `${mainLayoutChildrenPositionsToolkitState?.pixelUnit?.remainingPart?.height.split("p")[0] - 70}px` }}>
          <CommonNavigator
            values={navigatorValues}
            getSelectedValue={getSelectedValue}
          />
          <div className={Styles.v_a_tab_content_wrapper}  style={{ height: `${mainLayoutChildrenPositionsToolkitState?.pixelUnit?.remainingPart?.height.split("p")[0] - 164}px` }}>
            {selectedFilter === "General Details" ? (
              <ViewAssetGeneralDetails data={assetDetails} />
            ) : (
              <></>
            )}
            {selectedFilter === "3D" ? (
              <ViewAsset3DDetails data={assetDetails} />
            ) : (
              <></>
            )}
            {selectedFilter === "History" ? (
              <ViewAssetHistory data={assetDetails} />
            ) : (
              <></>
            )}
            {selectedFilter === "Performance Data" ? (
              <ViewAssetPerformanceData data={assetDetails} />
            ) : (
              <></>
            )}
            {selectedFilter === "Spares & Inventory" ? (
              <ViewAssetSparesAndInventory data={assetDetails} />
            ) : (
              <></>
            )}
            {selectedFilter === "Parameters" ? (
              <ViewAssetParameters data={assetDetails} />
            ) : (
              <></>
            )}
            {selectedFilter === "Reference Manuals" ? (
              <ViewAssetReferenceManuals data={assetDetails} />
            ) : (
              <></>
            )}
            {selectedFilter === "Documents" ?  <ViewAssetDocuments data={assetDetails}/> : <></>}
            {selectedFilter === "Maintenance Task" ?  <ViewMaintenanceTask data={assetDetails}/> : <></>}
          </div>
        </div>
      </div>
      <ClonosConfirmationDialog
        Open={showDeleteDailog}
        CloseDialog={() => {
          setShowDeleteDailog(false);
        }}
        Title="Delete Asset"
        Content={"Are you sure you want to delete"}
        ProceedDialog={() => {
          handleDeleteAsset({
            payload: { assetIds: [assetDetails?._id], updatedBy: user?.userId },
            activePage: 1,
            imit: 10,
            dispatch,
            setShowDeleteDailog,
            Navigate,
          });
        }}
      />
    </>
  );
};
