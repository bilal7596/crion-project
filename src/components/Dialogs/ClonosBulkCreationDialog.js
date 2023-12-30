import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import { useState } from "react";
import { useEffect } from "react";
import { getAllPermissions, postUserFilters } from "../../Api/User/UserApi";
import { DataGrid } from "@material-ui/data-grid";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CloseOutlined } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { postAssetFilters } from "../../Api/Asset/assetApi";
import { getUser, removeUserSession } from "../../utils/clonosCommon";
import { commonActions } from "../../Store/Reducers/CommonReducer";



const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

export default function SimpleDialog(props) {
  const classes = useStyles();
  const { open, close, ids,type } = props;
  const [users, setUsers] = useState([]);
  const USER_DETAILS = getUser()
  const [allpermissions, setallpermissions] = useState([]);
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch()
  const handleClose = () => {
    close();
  };
  const handleListItemClick = (value) => {
    // onClose(value);
  };

  

  useEffect(() => {
    console.log(ids)
  }, []);

  
  const handleViewUser = (user) => {
    console.log("selectedUser", user);
    // dispatch(userActions.getUserData(user));
    // setOpenUserDetailsDialog(true);
    handleClose()
    if(type === "New users added"){
      NAVIGATE("/view-user", { state: user });
    } 
  };

  const handleViewAsset = (asset) => {
    handleClose();
    NAVIGATE("/view-asset",{state:asset})
  }

  useEffect(() => {
    // getAllPermissions()
    //   .then((res) => {
    //     console.log("getAllPermissions RESPONSE", res);
    //     setallpermissions(res?.data?.result);
    //   })
    //   .catch((err) => console.log("getAllPermissions ERROR".err));

      ids.forEach(element => {
        if(type == "New assets added"){
          postAssetFilters({assetId:element}).then((res) => res.data).then((data) => {
            setUsers(prev=>[...prev, data?.assets[0]])
          }).catch((err) => {
            if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
              dispatch(commonActions.handleExpiryAlert(true));
              removeUserSession();
              localStorage.removeItem("loginUser")
            }
          })
        } else {
          postUserFilters({userId:element}).then(res=>res.data).then(data=>{
             setUsers(prev=>[...prev,data?.users[0]])
          }).catch((err) => {
            if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
              dispatch(commonActions.handleExpiryAlert(true));
              removeUserSession();
              localStorage.removeItem("loginUser")
            }
          })
        }
      });
  }, []);

  const [handlePermission, sethandlePermission] = useState({});

  const currentPermissionsSelector = useSelector(
    (state) => state.userData.loggedUserPermissions
  );

  useEffect(() => {
    allpermissions?.map((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: false,
      }));
    });
    currentPermissionsSelector?.map((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: true,
      }));
    });
  }, [allpermissions, currentPermissionsSelector]);
  
  const usersColumns = [
    { field: 'id', headerName: 'ID', width: 110 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      type: 'email',
      width: 240,
      editable: false,
      renderCell: (val) => {
        return (
          <span
            onClick={() =>
              USER_DETAILS.permissions.includes("usr004")
                ? handleViewUser(val.row)
                : null
            }
            className="user-email"
          >
            {val.row.email},
          </span>
        );
      },
    },
    {
      field: 'phone',
      headerName: 'Phone',
      type: 'text',
      width: 170,
      editable: false,
    },
    {
      field: 'state',
      headerName: 'State',
      type: 'text',
      width: 200,
      editable: false,
    },
    {
      field: 'designation',
      headerName: 'Designation',
      type: 'text',
      width: 170,
      editable: false,
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 165,
      renderCell: (value) => {
        return new Date(`${value.row.createdDate}`).toLocaleDateString();
      },
    },
  ];

  const assetsColumns = [
    {
      field: "id",
      headerName: "S.No",
      width: 120,
      renderCell: (index) => {
        return index.api.getRowIndex(index.row.assetId) + 1;
      },
    },
    {
      field: "tagId",
      headerName: "Tag ID",
      width: 130,
    },
    {
      field: "assetCategory",
      headerName: "Asset Category",
      width: 200,
    },
    {
      field: "assetName",
      headerName: "Asset Name",
      width: 170,
      renderCell: (val) => {
        return (
          <span
            onClick={() =>
              USER_DETAILS.permissions.includes("usr004")
                ? handleViewAsset(val.row)
                : null
            }
            className="user-asset"
          >
            {val.row.assetName},
          </span>
        );
      },
    },
    {
      field: "productName",
      headerName: "Product Name",
      width: 150,
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
    },
    {
      field: "shortDescription",
      headerName: "Short Description",
      width: 150,
    },

    // {
    //   field: "assetImage",
    //   headerName: "Asset Image",
    //   width: 110,
    //   editable: true,
    //   renderCell: (value) => {
    //     console.log("renderCell", value);
    //     return <img src={value} alt={value} />
    //   }
    // },
    // {
    //   field: "assetLayoutImage",
    //   headerName: "Asset Layout Image",
    //   width: 110,
    //   editable: true,
    //   renderCell: (value) => {
    //     const imageasset = new Image();
    //     imageasset.src = value.row.assetLayoutImage;
    //     const dimentions = imageasset.height + " x " + imageasset.width + " px";

    //     const imageDetail = allAssetLayoutImageSource?.filter(
    //       (asset) => asset.assetId === value.row.assetId
    //     );

    //     return (
    //       <div>
    //         <HtmlTooltip
    //           title={
    //             <React.Fragment>
    //               <img
    //                 src={
    //                   value.row.assetLayoutImage
    //                     ? value.row.assetLayoutImage
    //                     : "https://www.ohcampus.com/assets/images/No_image_available.png"
    //                 }
    //                 width="100%"
    //                 height="300px"
    //               ></img>
    //             </React.Fragment>
    //           }
    //         >
    //           <Avatar
    //             onClick={(bool, event) => {
    //               value.row.assetLayoutImage
    //                 ? setImg(value.row.assetLayoutImage)
    //                 : setImg(
    //                     "https://www.ohcampus.com/assets/images/No_image_available.png"
    //                   );
    //               setAssetImgName(imageDetail[0]?.imageName);
    //               setAssetImgDimentions(dimentions);
    //               setAssetImgSize(
    //                 imageDetail[0]
    //                   ? (imageDetail[0]?.imageSize / 1024).toFixed(2) + " KB"
    //                   : "0 KB"
    //               );
    //               setAssetImgType(imageDetail[0]?.imageType);
    //               handleOpenPreview();
    //             }}
    //             src={
    //               value.row.assetLayoutImage
    //                 ? value.row.assetLayoutImage
    //                 : "https://www.ohcampus.com/assets/images/No_image_available.png"
    //             }
    //             variant="square"
    //             style={{
    //               width: "96px",
    //               height: "96px",
    //               border: "3px solid #dadde9",
    //             }}
    //           ></Avatar>
    //         </HtmlTooltip>
    //       </div>
    //     );
    //   }
    // },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 160,
      renderCell: (value) => {
        return new Date(`${value.row.createdDate}`).toLocaleDateString();
      },
    },
    
    // {
    //   field: "xLocation",
    //   headerName: "Location",
    //   width: 180,
    //   valueGetter: (params) => {
    //     return `(x: ${params.row.xLocation || 0}, y: ${params.row.yLocation || 0}, z: ${params.row.zLocation || 0})`
    //   }
    // },
    // {
    //   field: "action",
    //   headerName: "Action",
    //   sortable: false,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {handlePermission.asset_View_Details && (
    //           <Tooltip title="View Asset">
    //             <IconButton
    //               aria-label="view"
    //               onClick={() => handleAssetView(params.row)}
    //             >
    //               <VisibilityIcon />
    //             </IconButton>
    //           </Tooltip>
    //         )}
    //         {handlePermission.document_Manage ? (
    //           <Tooltip title="Manage Documents">
    //             <IconButton
    //               aria-label="Manage Documents"
    //               onClick={() => {
    //                 dispatch(assetActions.getSingleAsset(params.row));
    //                 NAVIGATE("/view-associated-documents", {
    //                   state: params.row,
    //                 });
    //               }}
    //             >
    //               <PostAddIcon />
    //             </IconButton>
    //           </Tooltip>
    //         ) : (
    //           <></>
    //         )}
    //       </>
    //     );
    //   },
    // },
    // {
    //   field: "engineeringData",
    //   headerName: "Engineering Data",
    //   sortable: false,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <Tooltip title="Engineering Data">
    //           <IconButton
    //             aria-label="Engineering Data"
    //             onClick={() => handleEngineeringData(params.row)}
    //             style={{
    //               display: handlePermission.engineering_Data_Page_View
    //                 ? "block"
    //                 : "none",
    //             }}
    //           >
    //             <StorageIcon />
    //           </IconButton>
    //         </Tooltip>
    //       </>
    //     );
    //   },
    // },
    // {

    //   field: "asset3dModel",
    //   headerName: "Asset 3d Model",
    //   sortable: false,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //        { params.row.asset3dModel ? <Tooltip title="Download 3d Model">
    //         <IconButton
    //             aria-label="Download 3d Model"
    //             onClick={() => window.open(`${params.row.asset3dModel}`)}
    //           >
    //             <GetAppIcon />
    //           </IconButton>
    //         </Tooltip> : <Tooltip title="Download 3d Model">
    //         <IconButton
    //             aria-label="Download 3d Model"
    //             disabled={true}
    //           >
    //             <GetAppIcon />
    //           </IconButton>
    //         </Tooltip>}
    //       </>
    //     );
    //   },
    // },
  ];
  console.log(type,"userraaaa")

  return (
    
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      disableBackdropClick={true}
      maxWidth="xl"
      hideActions={true}
    > 
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingRight:"20px"}}>

      <DialogTitle id="simple-dialog-title">New Created {type === "New users added" ? "Users" : "Assets"}</DialogTitle>
      <IconButton onClick={handleClose}>
      <CloseOutlined/>
      </IconButton>
    </div>
      <div style={{minWidth:"1260px",height:"500px"}}>
      <DataGrid
      getRowId={(row) => type === "New users added" ? row.id:row.assetId}
        rows={users}
        columns={type === "New users added" ? usersColumns : assetsColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        // checkboxSelection
        disableSelectionOnClick
      />
      </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

// export default function SimpleDialogDemo() {
//   const [open, setOpen] = React.useState(false);
//   const [selectedValue, setSelectedValue] = React.useState(emails[1]);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = (value) => {
//     setOpen(false);
//     setSelectedValue(value);
//   };

//   return (
//     <div>
//       <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
//       <br />
//       <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//         Open simple dialog
//       </Button>
//       <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
//     </div>
//   );
// }
