import { useState } from "react";
import Styles from "../../../ModuleStyles/Assets/viewAsset.module.css";
import NOIMAGE from "../../../assets/images/No_image_available.png";
import { useEffect } from "react";
import { Tooltip } from "@material-ui/core";
export const ViewAsset3DDetails = ({ data }) => {
  const [assetGeneralDetails, setAssetGeneralDetails] = useState({ ...data });

  useEffect(() => {
    setAssetGeneralDetails({ ...data });
  }, [data]);
  return (
    <div className={Styles.view_ast3d_details_container}>
      <div className={Styles.view_ast3d_details_leftcontainer}>
        <div className={Styles.viewpositionContainer}>
          <h4 className={Styles.ast3d_detail_header}>Position</h4>
          <div className={Styles.ast3d_details_listbox}>
            <div>
              <h4 className={Styles.ast3d_details_listitem_field}>X</h4>
              <h4 className={Styles.ast3d_details_listitem_value}>
                {assetGeneralDetails?.asset3DModel?.position?.x || "Not Available"}
              </h4>
            </div>
            <div>
              <h4 className={Styles.ast3d_details_listitem_field}>Y</h4>
              <h4 className={Styles.ast3d_details_listitem_value}>
                {assetGeneralDetails?.asset3DModel?.position?.y || "Not Available"}
              </h4>
            </div>
            <div>
              <h4 className={Styles.ast3d_details_listitem_field}>Z</h4>
              <h4 className={Styles.ast3d_details_listitem_value}>
                {assetGeneralDetails?.asset3DModel?.position?.z || "Not Available"}
              </h4>
            </div>
          </div>
        </div>
        <div className={Styles.viewRotationContainer}>
          <h4 className={Styles.ast3d_detail_header}>Rotation</h4>
          <div className={Styles.ast3d_details_listbox}>
            <div>
              <h4 className={Styles.ast3d_details_listitem_field}>X</h4>
              <h4 className={Styles.ast3d_details_listitem_value}>
                {assetGeneralDetails?.asset3DModel?.rotation?.x || "Not Available"}
              </h4>
            </div>
            <div>
              <h4 className={Styles.ast3d_details_listitem_field}>Y</h4>
              <h4 className={Styles.ast3d_details_listitem_value}>
                {assetGeneralDetails?.asset3DModel?.rotation?.y || "Not Available"}
              </h4>
            </div>
            <div>
              <h4 className={Styles.ast3d_details_listitem_field}>Z</h4>
              <h4 className={Styles.ast3d_details_listitem_value}>
                {assetGeneralDetails?.asset3DModel?.rotation?.z || "Not Available"}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className={Styles.view_ast3d_details_rightcontainer}>
        <div className={Styles.astLayoutImageContainer}>
          <h4 className={Styles.ast3d_detail_header}>Layout Image</h4>
          <div className={Styles.thumbnailHolder}>
            <img
              src={
                assetGeneralDetails?.assetLayoutImage
                  ? assetGeneralDetails?.assetLayoutImage?.imageUrl
                  : NOIMAGE
              }
              loading="lazy"
            />
          </div>
        </div>
        <div className={Styles.ast3DModelContainer}>
          <h4 className={Styles.ast3d_detail_header}>3D Model</h4>
          <div className={Styles.ast3DModelHolder}>
            <img
              src={
                assetGeneralDetails?.asset3DModel
                  ? assetGeneralDetails?.asset3DModel?.modelUrl
                  : NOIMAGE
              }
              loading="lazy"
            />
            {assetGeneralDetails?.asset3DModel && (
              <Tooltip
                title={`${assetGeneralDetails?.asset3DModel?.modelName}.${assetGeneralDetails?.asset3DModel?.modelType}`}
              >
                <p>
                  {assetGeneralDetails?.asset3DModel?.modelName}.
                  {assetGeneralDetails?.asset3DModel?.modelType}
                </p>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
