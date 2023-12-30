import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import NOIMG from "../../assets/images/noImg.jpg";
import { getLongDesc } from "../../Api/Asset/assetApi";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { removeUserSession } from "../../utils/clonosCommon";
import { commonActions } from "../../Store/Reducers/CommonReducer";

const ViewAsset = () => {
  // const assetDetails = useSelector((state) => state.assetData.assetDetail);
  const LOCATION = useLocation();
  const [assetDetails, setassetDetails] = useState(LOCATION?.state);
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch();
  const [additionalFields, setadditionalFields] = useState({});

  useEffect(() => {
    console.log("assetDetails", assetDetails);
    getLongDesc(assetDetails?.assetId)
      .then((res) => {
        console.log("VIEW ASSET getLongDesc RESPONSE", res);
        setadditionalFields(res.data);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
  }, []);
  return (
    <div className="assetSec">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <h2
            style={{
              color: "#3f51b5",
              fontFamily: "calibri",
            }}
          >
            Asset Details:
          </h2>
          <p
            style={{
              color: "#3f51b5",
              fontFamily: "calibri",
              fontSize: "1.5em",
              margin: "12px 0 0 20px"
            }}
          >
            {assetDetails?.assetName}
          </p>
        </div>
        <Button
          variant="contained"
          color="primary"
          endIcon={<ArrowBackIcon>send</ArrowBackIcon>}
          onClick={() => NAVIGATE(-1)}
        >
          Back
        </Button>
      </div>
      <div className="assetBox">
        {Object.keys(assetDetails)?.length > 0 &&
          Object.keys(assetDetails)?.map((detail) => {
            let date = "";
            if (assetDetails[detail]) {
              if (detail === "assetImage" || detail === "updatedDate" || detail === "assetLayoutImage" || detail === "asset3dModel" ) {
                return null;
              } else if (detail === "createdDate") {
                date = new Date(`${assetDetails[detail]}`).toLocaleString();
              }
              return (
                <Grid container style={{ marginTop: "20px" }}>
                  <Grid item lg={4}>
                    <p>
                      <strong>
                        {detail
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, function (str) {
                            return str.toUpperCase();
                          })}
                        :
                      </strong>
                    </p>
                  </Grid>
                  <Grid item lg={4}>
                    <p>
                      {detail === "createdDate" ? date : assetDetails[detail]}
                    </p>
                  </Grid>
                </Grid>
              );
            }
          })}
        {/* {additionalFields && additionalFields?.fields?.length > 0 && (
          <>
            <Grid container style={{ marginTop: "20px" }}>
              <Grid item lg={4}>
                <p>
                  <strong>Engineering Data:</strong>
                </p>
              </Grid>
              <Grid item lg={8}>
                {additionalFields?.fields?.map((field, index) => {
                  return (
                    <Grid container>
                      <Grid item lg={4}>
                        <p>
                          <strong>
                            {index + 1}
                            {")"} {field.fieldName}:
                          </strong>
                        </p>
                      </Grid>
                      <Grid item lg={4}>
                        <p> {field.fieldValue}</p>
                      </Grid>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </>
        )} */}
        <Grid container> 
        <Grid item xs={6}  style={{ marginTop: "20px" }}>
          <Grid item xs={4}>
            <p>
              <strong>Asset Image:</strong>
            </p>
          </Grid>
          <Grid
            item
            xs={8}
            onMouseDown={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              style={{ maxWidth: "500px" }}
              src={assetDetails?.assetImage || NOIMG}
              alt="asset"
            />
          </Grid>
        </Grid>

        <Grid item xs={6} style={{ marginTop: "20px" }}>
          <Grid item xs={4}>
            <p>
              <strong>Asset Layout Image:</strong>
            </p>
          </Grid>
          <Grid
            item
            xs={8}
            onMouseDown={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <img
              style={{ maxWidth: "500px" }}
              src={assetDetails?.assetLayoutImage || NOIMG}
              alt="asset"
            />
          </Grid>
        </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ViewAsset;
