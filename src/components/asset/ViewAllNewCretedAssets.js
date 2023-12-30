import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import NOIMG from "../../assets/images/noImg.jpg";
import { getLongDesc } from "../../Api/Asset/assetApi";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";

const ViewAllNewCreatedAssets = () => {
  // const assetDetails = useSelector((state) => state.assetData.assetDetail);
  const LOCATION = useLocation();
  const changeIn = useState(LOCATION?.state);
  const NAVIGATE = useNavigate();
  const [assets,setAssets] = useState([])
  const [additionalFields, setadditionalFields] = useState({});

  useEffect(() => {
    
  }, []);
  console.log(changeIn)
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
            New Created Assets
          </h2>
          
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
        
      </div>
    </div>
  );
};

export default ViewAllNewCreatedAssets;
