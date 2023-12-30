import { useState } from "react";
import Styles from "../../../ModuleStyles/Assets/viewAsset.module.css";
import Modal from "../../CommonComponents/Modal/Modal";
import { ViewAssetHierarchy } from "./ViewAssetHierarchy";
import {
  getFormatedDate,
  getToken,
  handleLoginExpiry,
} from "../../../utils/clonosCommon";
import NOIMAGE from "../../../assets/images/No_image_available.png";
import { useEffect } from "react";
import { getAssetHierarchy, getSingleAsset } from "../../../Api/Asset/assetApi";
import { useDispatch } from "react-redux";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import { CircularProgress, Tooltip } from "@material-ui/core";
import { ImmediateParentChildAssetTree } from "../ImidiateParentChildAssetTree/ImmediateParentChildAssetTree";
import { ImagePreviewModal } from "../../CommonComponents/ImagePreviewModal/ImagePreviewModal";
import { useNavigate } from "react-router-dom";
import configs from "../../../config";
export const ViewAssetGeneralDetails = ({ data }) => {
  console.log(data, "daatta");
  const [assetHierarchyData, setAssetHierarchyData] = useState([]);
  const [assetGeneralDetails, setAssetGeneralDetails] = useState({ ...data });
  const [imageLoader, setImageLoader] = useState(false);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);
  const installationDate = getFormatedDate(data?.installationDate);
  const [parentAsset, setParentAsset] = useState("");
  const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
  const dispatch = useDispatch();

  const handleViewTermsAndCondition = ({ documentId, type }) => {
    const token = getToken();
    if (type == "png" || type == "jpg" || type == "jpeg") {
    } else {
      window.open(
        `${configs.url}/?termsAndConditionsId=${documentId}&token=${token}`
      );
    }
  };
  useEffect(() => {
    setAssetGeneralDetails({ ...data });
  }, [data]);
  return (
    <>
      <div className={Styles.view_ast_details_container}>
        <div className={Styles.view_ast_details_leftcontainer}>
          <div className={Styles.view_ast_general_details}>
            <h4 className={Styles.detail_header}>General Details</h4>
            <div className={Styles.details_listbox}>
              <div>
                <h4 className={Styles.details_listitem_field}>Asset Name</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.assetName || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Asset Number</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.assetNumber || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>
                  Asset Description
                </h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.assetDescription || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Running Mode</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.runningMode?.dropdownValues ||
                    "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Department</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.assetDepartment?.dropdownValues ||
                    "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>
                  Criticality Level
                </h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.criticalityLevel?.dropdownValues ||
                    "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Asset Owner</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.assetOwner?.name ||
                    "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Census Number</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.censusNumber || "Not Available"}
                </h4>
              </div>
            </div>
          </div>
          <div className={Styles.view_ast_general_details}>
            <h4 className={Styles.detail_header}>Specifications</h4>
            <div className={Styles.details_listbox}>
              <div>
                <h4 className={Styles.details_listitem_field}>Asset Make</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.assetMake || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Asset Model</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.assetModel || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Serial Number</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.serialNumber || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Manufacturer</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.manufacturer || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>
                  Installation Date
                </h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.installationDate
                    ? getFormatedDate(assetGeneralDetails?.installationDate)
                    : "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>
                  Service Liquid
                </h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.serviceLiquid || "Not Available"}
                </h4>
              </div>
            </div>
          </div>
          <div className={Styles.view_ast_general_details}>
            <h4 className={Styles.detail_header}>Hazardous Area Details</h4>
            <div className={Styles.details_listbox}>
              <div>
                <h4 className={Styles.details_listitem_field}>
                  Zone Classification
                </h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.hazardousAreaDetails?.zoneClassification || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Gas Group</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.hazardousAreaDetails?.gasGroup || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>
                  Temperature Classification
                </h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.hazardousAreaDetails?.temperatureClassification ||
                    "Not Available"}
                </h4>
              </div>
            </div>
          </div>
          <div className={Styles.view_ast_general_details}>
            <h4 className={Styles.detail_header}>Warranty Details</h4>
            <div className={Styles.details_listbox}>
              <div>
                <h4 className={Styles.details_listitem_field}>Supplier Name</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.supplierName || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>Email Id</h4>
                <h4 className={Styles.details_listitem_value}>
                  {assetGeneralDetails?.supplierEmail || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>
                  Warranty Period
                </h4>
                <h4 className={Styles.details_listitem_value}>
                  {`${assetGeneralDetails?.warrantyPeriodNumber} ${assetGeneralDetails?.warrantyPeriodDurr}` || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>
                  Warranty End Date
                </h4>
                <h4 className={Styles.details_listitem_value}>
                  {getFormatedDate(assetGeneralDetails?.warrantyEndDate) || "Not Available"}
                </h4>
              </div>
              <div>
                <h4 className={Styles.details_listitem_field}>
                  Terms & Conditions
                </h4>
                <h4 className={Styles.details_listitem_value}>
                  {
                    assetGeneralDetails?.assetTermsAndConditions?.length > 0 ? <p
                    onClick={() =>
                      handleViewTermsAndCondition({
                        documentId:assetGeneralDetails?.assetTermsAndConditions[0]
                          ?.termsAndConditionsId,
                        type:assetGeneralDetails?.assetTermsAndConditions[0]
                          ?.termsAndConditionsType
                      })
                    }
                    className={Styles.linkText}
                  >
                    View Document
                  </p> : "Not Available"
                  }
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className={Styles.view_ast_details_rightcontainer}>
          <div className={Styles.astImageContainer}>
            <h4 className={Styles.detail_header}>Asset Image</h4>
            <div className={Styles.thumbnailHolder}>
              <img
                src={
                  assetGeneralDetails?.assetImages?.length > 0
                    ? assetGeneralDetails?.assetImages[0]?.imageUrl
                    : NOIMAGE
                }
                loading="lazy"
              />
            </div>
            <div className={Styles.imgListContainer}>
              {assetGeneralDetails?.assetImages?.length > 1 && (
                <div className={Styles.imgItemBox}>
                  <div className={Styles.imgHolder}>
                    <img
                      src={
                        assetGeneralDetails?.assetImages?.length > 1
                          ? assetGeneralDetails?.assetImages[1]?.imageUrl
                          : NOIMAGE
                      }
                    />
                  </div>
                  <Tooltip
                    title={`${assetGeneralDetails?.assetImages[1]?.imageName}.${assetGeneralDetails?.assetImages[1]?.imageType}`}
                  >
                    <p>
                      {assetGeneralDetails?.assetImages[1]?.imageName}.
                      {assetGeneralDetails?.assetImages[1]?.imageType}
                    </p>
                  </Tooltip>
                </div>
              )}
              {assetGeneralDetails?.assetImages?.length > 2 && (
                <div className={Styles.imgItemBox}>
                  <div className={Styles.imgHolder}>
                    <img
                      src={
                        assetGeneralDetails?.assetImages?.length > 2
                          ? assetGeneralDetails?.assetImages[2]?.imageUrl
                          : NOIMAGE
                      }
                    />
                  </div>
                  <Tooltip
                    title={`${assetGeneralDetails?.assetImages[2]?.imageName}.${assetGeneralDetails?.assetImages[2]?.imageType}`}
                  >
                    <p>
                      {assetGeneralDetails?.assetImages[2]?.imageName}.
                      {assetGeneralDetails?.assetImages[2]?.imageType}
                    </p>
                  </Tooltip>
                </div>
              )}
              {assetGeneralDetails?.assetImages?.length > 3 && (
                <div className={Styles.imgItemBox}>
                  <div
                    style={{
                      height: "120px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <p
                      onClick={() => setShowImagePreviewModal(true)}
                      className={Styles.linkText}
                    >
                      View All
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={Styles.view_location_details_container}>
            <h4 className={Styles.detail_header}>Location Details</h4>
            <div className={Styles.view_location_subcontainer}>
              <div className={Styles.details_listbox}>
                <div>
                  <h4 className={Styles.details_listitem_field}>Location</h4>
                  <h4 className={Styles.details_listitem_value}>
                    {assetGeneralDetails?.location?.name_of_city ||
                      "Not Available"}
                  </h4>
                </div>
                <h4 className={Styles.detail_header}>
                  Geographical Coordinates
                </h4>
                <div>
                  <h4 className={Styles.details_listitem_field}>Latitude</h4>
                  <h4 className={Styles.details_listitem_value}>
                    {assetGeneralDetails?.geoLocation?.latitude ||
                      "Not Available"}
                  </h4>
                </div>
                <div>
                  <h4 className={Styles.details_listitem_field}>Longitude</h4>
                  <h4 className={Styles.details_listitem_value}>
                    {assetGeneralDetails?.geoLocation?.longitude ||
                      "Not Available"}
                  </h4>
                </div>
                <div>
                  <h4 className={Styles.details_listitem_field}>Elevation</h4>
                  <h4 className={Styles.details_listitem_value}>
                    {assetGeneralDetails?.geoLocation?.elevation ||
                      "Not Available"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.view_hierarchy_container}>
            <h4 className={Styles.detail_header}>Hierarchy</h4>
            <div className={Styles.astTreeContainer}>
              <div>
                <ImmediateParentChildAssetTree
                  assetGeneralDetails={assetGeneralDetails}
                  dispatch={dispatch}
                />
              </div>
              {assetGeneralDetails?.parentAsset && (
                <p
                  onClick={() => setShowHierarchyModal(true)}
                  className={Styles.linkText}
                >
                  View Full Hierarchy
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {showHierarchyModal ? (
        <Modal
          isOpen={showHierarchyModal}
          closeModalMethod={() => setShowHierarchyModal(false)}
        >
          <ViewAssetHierarchy
            OnClose={() => setShowHierarchyModal(false)}
            selectedAsset={{
              assetName: data?.assetName,
              assetNumber: data?.assetNumber,
              assetId: data?._id,
            }}
          />
        </Modal>
      ) : (
        <></>
      )}
      <ImagePreviewModal
        open={showImagePreviewModal}
        closeModalMethod={setShowImagePreviewModal}
        images={assetGeneralDetails?.assetImages}
      />
    </>
  );
};
