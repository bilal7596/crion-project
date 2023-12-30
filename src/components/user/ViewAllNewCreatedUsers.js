import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import NOIMG from "../../assets/images/noImg.jpg";
import { getLongDesc } from "../../Api/Asset/assetApi";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { postUserFilters } from "../../Api/User/UserApi";
import { DataGrid } from "@material-ui/data-grid";
import { removeUserSession } from "../../utils/clonosCommon";
import { commonActions } from "../../Store/Reducers/CommonReducer";

const ViewAllNewCreatedUsers = () => {
  // const assetDetails = useSelector((state) => state.assetData.assetDetail);
  const LOCATION = useLocation();
  const changeIn = useState(LOCATION?.state);
  const usersIds = changeIn[0].userId
  const NAVIGATE = useNavigate();
  const [users,setUsers] = useState([])
  const [additionalFields, setadditionalFields] = useState({});
  const dispatch = useDispatch()

  const columns = [
    { field: "userId", headerName: "ID", width: 96 },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      // renderCell: (val) => {
      //   return <span onClick={() =>handlePermission.user_View_Details? handleViewUser(val.row):null} className="user-email">{val.row.email},</span>
      // }
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
    },
    {
      field: "businessUnit",
      headerName: "Business Unit",
      width: 200,
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 180,
    },
    
  ];
  useEffect(() => {
    usersIds?.length && usersIds?.map((id) =>{ 
        postUserFilters({userId:id}).then((res) =>{
            setUsers(prev => ([...prev, res?.data?.users[0]]))
            console.log(res,"res")
        }).catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
    })
}, []);
console.log(users)
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
        <DataGrid 
        rows={users}
        columns={columns}
        pageSize={5}
        // getRowId={(row) => row.id}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        
        />
      </div>
    </div>
  );
};

export default ViewAllNewCreatedUsers;
