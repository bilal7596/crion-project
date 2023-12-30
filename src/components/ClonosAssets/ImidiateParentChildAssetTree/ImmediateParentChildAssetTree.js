import { Tooltip } from "@material-ui/core";
import Styles from "./ImmediateParentChildAssetTree.module.css";
import { useEffect, useState } from "react";
import { handleLoginExpiry } from "../../../utils/clonosCommon";
import { getSingleAsset } from "../../../Api/Asset/assetApi";
import REDDOTCIRCLE from "../../../assets/UIUX/icons/red-dot-filled.svg";
export const ImmediateParentChildAssetTree = ({
  assetGeneralDetails,
  dispatch,
}) => {
  const [parentAsset, setParentAsset] = useState("");
  useEffect(() => {
    if (assetGeneralDetails?.parentAsset) {
      getSingleAsset(assetGeneralDetails?.parentAsset?.id)
        .then((res) => {
          setParentAsset(res?.data?.result?.assetName);
        })
        .catch((err) => {
          handleLoginExpiry(err, dispatch);
        });
    }
  }, [assetGeneralDetails]);
  console.log(assetGeneralDetails, "daata from comp");
  return (
    <div>
      <div className={Styles.astParentAndChild}>
        {assetGeneralDetails?.parentAsset && parentAsset ? (
          <>
            <div className={Styles.astParent}>
              {/* <div className={Styles.astDot}></div> */}
              <img src={REDDOTCIRCLE} />
              <Tooltip title={parentAsset}>
                <h4 className={Styles.hrchyParentAsset}>{parentAsset}</h4>
              </Tooltip>
            </div>
            <div className={Styles.dotConnector}></div>
          </>
        ) : (
          <></>
        )}
        <div className={Styles.astChild}>
          {/* <div className={Styles.astDot}></div> */}
          <img src={REDDOTCIRCLE} />
          <Tooltip title={assetGeneralDetails?.assetName}>
            <h4 className={Styles.hrchyCurrentAsset}>
              {assetGeneralDetails?.assetName}
            </h4>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
