import { ClonosStepperEditAsset } from "./ClonosStepperEditAsset";
import Styles from "../../../ModuleStyles/Assets/assets.module.css";
import { getUser, handleLoginExpiry, handleShowErrorAndWarning, updateLayout } from "../../../utils/clonosCommon";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAssetDocuments, getReferenceManualForAsset, getSingleAsset } from "../../../Api/Asset/assetApi";
import { useDispatch, useSelector } from "react-redux";
import { optionalParamsForSingleAsset } from "../../../utils/AssetsMethods/constants";
import { referenceManualsOptionalParams } from "../../../SharedEnums/ReferencemanualsEnums";
export const EditAsset = () => {
  const user = getUser();
  const Location = useLocation();
  const dispatch = useDispatch();
  const { mainLayoutChildrenPositionsToolkitState } = useSelector(
    (store) => store.globalEntitiesStateManagement
  );
  const [assetDetails, setAssetDetails] = useState({});
  const [technicalSpecificationsOfAsset, setTechnicalSpecificationsOfAsset] =
    useState([]);
  useEffect(() => {
    getSingleAsset(Location?.state?.assetId, optionalParamsForSingleAsset).then((res) => {
      let temp = { ...res?.data?.result };
      const dropDrowns = ["assetMode","runningMode","assetDepartment","criticalityLevel","functionalArea","assetCategory"];
      dropDrowns?.forEach((dropdown) => {
        temp[dropdown] = {...temp[dropdown],["name"]:temp[dropdown]?.dropdownValues,["id"]:temp[dropdown]?.dropdownId}
      })
      temp["location"] = {...temp?.location,name:temp?.location?.name_of_city,id:temp?.location?.locationId}
      if(temp?.warrantyPeriod){
        const [warrantyPeriodNumber,warrantyPeriodDurr] = temp?.warrantyPeriod.split(" ");
        temp.warrantyPeriodNumber = Number(warrantyPeriodNumber);
        temp.warrantyPeriodDurr = warrantyPeriodDurr
      } 
      if(temp?.asset3DModel?.position){
        let position = temp?.asset3DModel?.position;
        temp.asset3DmodelPosition = position
      }
      if(temp?.asset3DModel?.rotation){
        let rotation = temp?.asset3DModel?.rotation;
        temp.asset3DmodelRotation = rotation
      }  
      if(temp?.asset3DModel?.modelId){
        let tempModel = {...temp.asset3DModel,docId:temp?.asset3DModel?.modelId}
        temp.asset3DModel = tempModel
      }
      if(temp?.isWarrantyIncluded){
        temp.warrantyPeriodDurr = {id:temp?.warrantyPeriodDurr.toLowerCase(),name:temp?.warrantyPeriodDurr}
      }
        

        getReferenceManualForAsset(Location?.state?.assetId,referenceManualsOptionalParams).then((res) => {
          setAssetDetails(({...temp,referenceManuals:res?.data?.result}))
        }).catch((err) => {
          handleLoginExpiry(err,dispatch);
          if(err?.response?.data?.status != 401){
            handleShowErrorAndWarning({dispatch,message:"Encountered a server error while fetching asset documents.",type:"error",showTime:"5000"})
          }
        })
    });
  }, [Location]);
  useEffect(() => {
    updateLayout({ dispatch });
  }, []);
  console.log(assetDetails, "assetDetails");
  if (user.permissions.includes("ast001"))
    return (
      <div
        className={Styles.assetRegContainer}
        style={{
          height:
            mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart
              ?.height,
        }}
      >
        <div className={Styles.assetRegSubContainer}>
          <ClonosStepperEditAsset
            data={assetDetails}
            technicalSpecificationsOfAsset={technicalSpecificationsOfAsset}
            page={Location?.state?.activePage}
            limit={Location?.state?.limit}
          />
        </div>
      </div>
    );

  return (
    <div>
      <h2>
        You don't have permission to create as asset. Please contact admin.{" "}
      </h2>
    </div>
  );
};
