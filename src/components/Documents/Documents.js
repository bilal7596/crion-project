import React, { useContext, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Tooltip from "@material-ui/core/Tooltip";
import ClonosConfirmationDialog from "../Dialogs/ClonosConfirmationDialog";
import { documentActions } from "../../Store/Reducers/ClonosDocumentReducer";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import configs from "../../config";
// import { getAllAssets, getAssetTypes } from "../../Api/Asset/assetApi";
import {
  uploadAssociateDocs,
  getAllAssoDocs,
  deleteDoc,
  viewDoc,
  downloadDoc,
  getAllDocs,
  getDocumentFilters,
  postDocumentFilters,
  getAllDocuments,
} from "../../Api/Documents/DocumentApi";
import {
  createBulkAssets,
  getAssetFilters,
  postAssetFilters,
  deleteAsset,
  downloadAssetTemp,
  getAllAssetImageDetails,
  getAssetTypes,
} from "../../Api/Asset/assetApi";
import Dropdown from "rsuite/Dropdown";
import { CheckPicker } from "rsuite";
import HelpIcon from "@material-ui/icons/Help";

import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import DescriptionIcon from "@material-ui/icons/Description";
import { getToken, getUser, removeUserSession } from "../../utils/clonosCommon";
import { getAllPermissions } from "../../Api/User/UserApi";
// import DatePicker from "react-multi-date-picker";
import { DateRangePicker } from "rsuite";

const Documents = () => {
  const dispatch = useDispatch();
  const user = getUser()
  const NAVIGATE = useNavigate();
  const LOCATION = useLocation();
  const [shwDeleteDialog, setshwDeleteDialog] = useState(false);
  // const assetData = useSelector((state) => state.assetData.assetDetail);
  const [assetData, setassetData] = useState(LOCATION?.state);
  const [alldocs, setalldocs] = useState([]);
  const [renderTable, setrenderTable] = useState(false);
  const [selectedId, setselectedId] = useState([]);
  const [calenderChange, setcalenderChange] = useState(false);
  const [calendarVal, setcalendarVal] = useState([new Date()]);
  const [typevalue, settypevalue] = useState([]);
  const [allAssetImageSource, setAllAssetImageSource] = useState([]);
  const [assetTypes, setassetTypes] = useState([]);
  const [allAssetMessages, setallAssetMessages] = useState([]);
  const [renderUserTable, setrenderUserTable] = useState(false);
  const [openImg, setOpenImg] = useState(false);
  const [documentTypes, setdocumentTypes] = useState([]);

  const handleOpenPreview = () => setOpenImg(true);
  const handleClosePreview = () => setOpenImg(false);
  const [allpermissions, setallpermissions] = useState([]);
  const [filters, setfilters] = useState({});
  const [filteredusers, setfilteredusers] = useState([]);
  const [filterPayload, setfilterPayload] = useState({
    id: "",
    type: "",
    isActive: "",
    createdDate: "",
    documentName: "",
  }); //'id', 'type', 'isActive', 'createdDate', "fileName"
  // useEffect(() => {
  //   getAllPermissions()
  //     .then((res) => {
  //       console.log("getAllPermissions RESPONSE", res);
  //       setallpermissions(res?.data?.result);
  //     })
  //     .catch((err) => console.log("getAllPermissions ERROR".err));
  // }, []);

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

  const handleViewDocument = (docId) => {
    dispatch(commonActions.showApiLoader(true));
    // viewDoc(docId).then((res) => {
    //   console.log("handleViewDocument res",res);
    //   window.open(`${res?.data?.url}`)
    //   dispatch(commonActions.showApiLoader(false));
    // }).catch((err) => {
    //   console.log("handleViewDocument ERROR", err)
    //   dispatch(commonActions.showApiLoader(false));
    // })
    const token = getToken();
    window.open(`${configs.url}?docId=${docId}&token=${token}`);
    dispatch(commonActions.showApiLoader(false));
  };

  const handleDownloadDocument = async (docId) => {
    console.log("handleDownloadDocument docId", docId);
    const doc = await downloadDoc(docId);
    const docUrl = doc.data.downloadUrl;
    dispatch(commonActions.showApiLoader(true));
    // window.open(docUrl)
    window.location.assign(docUrl);
    dispatch(commonActions.showApiLoader(false));
  };
  useEffect(() => {
    console.log("LOCATION?.state?", LOCATION?.state);
    console.log("assetData", assetData);
    getAllDocs(assetData)
      .then((res) => {
        console.log("getAllDocs RESPONSE", res);
        setalldocs(res?.data?.rows);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
  }, [renderTable]);

  const columns = [
    // {
    //   field: "ide",
    //   headerName: "Document Id",
    //   width: 158,
    //   renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    // },
    // { field: "docId", headerName: "Doc ID", width: 150 },

    // { field: "assetId", headerName: "Asset ID", width: 150 },
    { field: "assetName", headerName: "Asset Name", width: 150 },
    {
      field: "documentName",
      headerName: "Document Name",
      width: 250,
      renderCell: (value) => {
        if (value.row.version > 1) {
          return (
            <span>
              {value.row.documentName} - v{value.row.version}
            </span>
          );
        }
        return <span>{value.row.documentName}</span>;
      },
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 200,
      renderCell: (value) => {
        return new Date(`${value.row.createdDate}`).toLocaleDateString();
      },
    },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      renderCell: (val) => {
        return (
          <>
            {user.permissions.includes("doc004") ? (
              <Tooltip title="View">
                <IconButton
                  aria-label="view-document"
                  component="span"
                  disabled={val.row.type === "image"}
                  onClick={() => handleViewDocument(val.row.docId)}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
            {user.permissions.includes("doc008") ? (
              <Tooltip title="Download">
                <IconButton
                  aria-label="download"
                  onClick={() => handleDownloadDocument(val.row.docId)}
                >
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
          </>
        );
      },
    },
  ];

  //filters changes to be made -----------------------------------------------------
  const handleDatechange = (value) => {
    if (value) {
      const data = {
        startDate: new Date(value[0]).toISOString(),
        endDate: new Date(value[1]).toISOString(),
      };

      setcalendarVal(value);

      console.log("handleDatechange data", data);
      setcalenderChange(true);
      setfilterPayload((prev) => ({ ...prev, createdDate: data }));
    } else {
      setcalendarVal([new Date()]);
      setcalenderChange(true);
      setfilterPayload((prev) => ({ ...prev, createdDate: "" }));
    }

    // const date = value.toDate();
    // const ISOString = date.toISOString();
    // var split = ISOString.split("T");
    // var convertedString = `${split[0]}`;
    // console.log("split", split);

    // setcalendarVal(value);
  };
  const handleTitle = (name) => {
    if (name === "isActive") {
      return null;
    } else if (name === "id") {
      return " Id ";
    }
    return name.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  };

  const handleClearFilter = () => {
    setfilterPayload({
      docId: "",
      type: "",
      isActive: "",
      createdDate: "",
      documentName: "",
      assetId: "",
      // tagId: "",
      // productName: "",
    }); //'id', 'type', 'isActive', 'createdDate', "fileName"
    setcalenderChange(false);
    settypevalue([]);
    setcalendarVal([new Date()])
  };
  const renderDropdownitems = (prop, value) => {
    if (prop === "type") {
      return (
        // <>
        //   <Dropdown.Item
        //     onClick={(e) =>
        //       setfilterPayload((prev) => ({ ...prev, [prop]: "all" }))
        //     }
        //   >
        //     All
        //   </Dropdown.Item>
        //   {assetTypes?.map((type) => {
        //     return (
        //       <Dropdown.Item
        //         onClick={(e) =>
        //           setfilterPayload((prev) => ({ ...prev, [prop]: type.name }))
        //         }
        //       >
        //         {type.name}
        //       </Dropdown.Item>
        //     );
        //   })}
        // </>
        null
      );
    } else {
      return (
        <>
          <Dropdown.Item
            onClick={(e) =>
              setfilterPayload((prev) => ({ ...prev, [prop]: "all" }))
            }
            settypevalue
          >
            All
          </Dropdown.Item>
          {value?.map((val) => {
            if (prop === "type") {
              return (
                <>
                  <Dropdown.Item
                    onClick={(e) =>
                      setfilterPayload((prev) => ({ ...prev, [prop]: val }))
                    }
                  >
                    {val}
                  </Dropdown.Item>
                </>
              );
            }
            // if (prop === "type") {
            //   return (
            //     <>
            //       <Dropdown.Item
            //         onClick={(e) =>
            //           setfilterPayload((prev) => ({ ...prev, [prop]: val }))
            //         }
            //       >
            //         {val}
            //       </Dropdown.Item>
            //     </>
            //   );
            // }
            return (
              <>
                <Dropdown.Item
                  onClick={(e) =>
                    setfilterPayload((prev) => ({ ...prev, [prop]: val }))
                  }
                >
                  {val}
                </Dropdown.Item>
              </>
            );
          })}
        </>
      );
    }
  };
  useEffect(() => {
    getDocumentFilters()
      .then((res) => {
        console.log("getDocumentFilters RESPONSE", res);
        const orderData = {
          // docId: res.data.docId,
          // documentName: res.data.documentName,
          // productName: res.data.productName,
          // type: res.data.type,
          // createdDate: [],
          // docId: res.data.docId,
          documentName: res.data.documentName,
          // assetId: res.data.assetId,
          type: res.data.type,
          createdDate: [],
          //'id', 'type', 'isActive', 'createdDate', "fileName"
        };
        setfilters(orderData);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    // getAllAssetImageDetails()
    //   .then((res) => {
    //     console.log("getAllAssetImageDetails res", res);
    //     setAllAssetImageSource(res.data.result);
    //   })
    //   .catch((err) => console.log("getAllAssetsImags err", err));
    getAssetTypes()
      .then((res) => {
        console.log("getAssetTypes RESPONSE", res);
        setassetTypes(res.data.result);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
  }, []);

  useEffect(() => {
    getAllDocs()
      .then((res) => {
        console.log("getAllDocs RESPONSE", res);
        dispatch(documentActions.getAllDocs(res.data.rows));
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    // getAllAssetImageDetails()
    //   .then((res) => {
    //     console.log("getAllAssetImageDetails RESPONSE", res);
    //     setallAssetMessages(res.data.result);
    //   })
    //   .catch((err) => console.log("getAllAssetImageDetails ERROR", err));
  }, [renderUserTable]);

  const tempHeaders = [
    { label: "Document Name", key: "first_name" },
    { label: "Product Name", key: "last_name" },
    { label: "Document ID", key: "email" },
    { label: "Type", key: "phone" },
    // { label: "Height", key: "state" },
    // { label: "Length", key: "BU" },
    // { label: "Breadth", key: "BU" },
    { label: "Short Description", key: "BU" },
  ];
  function toCamel(o) {
    var newO, origKey, newKey, value;
    function camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
    }
    if (o instanceof Array) {
      return o.map(function (value) {
        if (typeof value === "object") {
          value = toCamel(value);
        }
        return value;
      });
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (
            origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey
          )
            .toString()
            .replace(/\s(.)/g, function ($1) {
              return $1.toUpperCase();
            })
            .replace(/\s/g, "")
            .replace(/^(.)/, function ($1) {
              return $1.toLowerCase();
            });
          value = o[origKey];
          if (
            value instanceof Array ||
            (value !== null && value.constructor === Object)
          ) {
            value = toCamel(value);
          }

          newO[newKey] = value;
        }
      }
    }

    return newO;
  }

  const handleCloseDelDialog = () => {
    setshwDeleteDialog(false);
  };

  const handleProceedDelDialog = () => {
    const data = {
      docId: selectedId,
      isDeleted: 1,
      deletedBy:user?.userId
    };
    deleteDoc(data)
      .then((res) => {
        console.log("deleteDoc RESPONSE", res);
        setshwDeleteDialog(false);
        setrenderTable((prev) => !prev);
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: `Document deleted`,
            type: "success",
          })
        );

      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          console.log("deleteDoc err", err);
          setshwDeleteDialog(false);
          setrenderTable((prev) => !prev);
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: `${err.response.data.message}`,
              type: "error",
            })
          );
        }
      });
  };

  const handleApplyFilters = (filters) => {
    return Object.keys(filters).map((name) => {
      if (filters[name] !== "") {
        if (name === "isActive") {
          return (
            <span style={{ marginLeft: "20px" }}>
              <span style={{ fontWeight: "bold" }}>Document Status:</span>
              <span style={{ marginLeft: "10px" }}>
                {filters[name] === 1
                  ? "Active"
                  : `${filters[name] === 0 ? "Inactive" : "All"}`}
              </span>
            </span>
          );
        }
        return (
          <span style={{ marginLeft: "20px" }}>
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {name}:
            </span>
            <span style={{ marginLeft: "10px" }}>{filters[name]}</span>
          </span>
        );
      } else {
        return "-";
      }
    });
  };
  useEffect(() => {
    let data = {};
    Object.keys(filterPayload).forEach((item) => {
      if (filterPayload[item] !== "" && filterPayload[item] !== "all") {
        data[item] = filterPayload[item];
      }
    });
    console.log("postDocumentFilters data", data);
    postDocumentFilters(data)
      .then((res) => {
        console.log("postDocumentFilters RESPONSE", res);
        dispatch(documentActions.getAllDocs(res?.data?.documents || []));
        setalldocs(res?.data?.documents);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    return () => {};
  }, [filterPayload]);

  const handleUploadDocs = (e) => {
    dispatch(commonActions.showApiLoader(true));
    if (e.target.files?.length > 5) {
      dispatch(commonActions.showApiLoader(false));
      dispatch(
        commonActions.handleSnackbar({
          show: true,
          message: `Maximum 5 files can be upload at once`,
          type: "error",
        })
      );
      return;
    } else {
      let formData = new FormData();
      const USER_DETAILS = getUser();
      console.log("USER_DETAILS", USER_DETAILS);
      console.log("e.target.files", e.target.files);
      for (let i = 0; i < e.target.files?.length; i++) {
        if (
          e.target.files[i].type === "application/pdf" ||
          e.target.files[i].type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          e.target.files[i].type === "text/csv"
        ) {
          formData.append(`file${i}`, e.target.files[i]);
        }
      }
      formData.append("assetId", assetData.assetId);
      formData.append("userId", USER_DETAILS.userId);
      formData.append("noOfFiles", e.target.files?.length);

      uploadAssociateDocs(formData)
        .then((res) => {
          console.log("uploadAssociateDocs RESPONSE", res);
          setrenderTable((prev) => !prev);
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: res.data.message,
              type: "success",
            })
          );

        })
        .catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          } else {
            console.log("uploadAssociateDocs ERROR", err);
            setrenderTable((prev) => !prev);
            dispatch(commonActions.showApiLoader(false));
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: `${err.response.data.message}`,
                type: "error",
              })
            );
          }
        });
    }
  };

  return (
    <>
      <div style={{ display: " flex", justifyContent: "space-between" }}>
        <div style={{ display: " flex", justifyContent: "space-between" }}>
          <span>
            <DescriptionIcon style={{ color: "#3f51b5", fontSize: "2.5rem" }} />
          </span>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "calibri",
              marginLeft: "10px",
            }}
          >
            <i style={{ color: "#3f51b5" }}>All Documents</i>
          </h2>
        </div>

        <div>
          {/* <Button
            onClick={() => NAVIGATE(-1)}
            style={{ marginRight: "20px" }}
            variant="contained"
            color="primary"
            component="span"
          >
            Back
          </Button> */}
          <input
            accept=".pdf, .xls, .xlsx, .csv"
            style={{ display: "none" }}
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleUploadDocs}
            onClick={(e) => (e.target.value = null)}
          />
          {/* <label htmlFor="contained-button-file">
            {handlePermission.document_Create ? (<Button variant="contained" color="primary" component="span">
              Upload Document
            </Button>):<></>
            }
            
          </label> */}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems:"center",
          // justifyContent: "flex-start",
          marginBottom: "10px",
          border: "1px solid #bcbcbc",
          borderRadius: "10px",
          padding: "15px 10px",
        }}
      >
        <h5 
        // style={{ position: "relative", top: "25px" }}
        >Filters:</h5>
        <div style={{display:"flex",gridGap:"10px",alignItems:"center"}}>
          {Object.keys(filters).map((item) => {
            if (item === "createdDate") {
              return (
                // <DatePicker
                //   style={{
                //     padding: "15px 15px",
                //     position: "relative",
                //     top: "10px",
                //     left: "10px",
                //     color: !calenderChange ? "#bcbcbc" : "#000",
                //     width: "120px",
                //   }}
                //   placeholder="Created Date"
                //   value={calendarVal}
                //   onChange={handleDatechange}
                // />
                <DateRangePicker
                  value={calendarVal}
                  onChange={handleDatechange}
                  format="dd-MM-yyyy"
                  placeholder="dd-mm-yyyy"
                  cleanable
                />
              );
            } else if (
              item === "docId" ||
              item === "documentName" ||
              item === "assetId"
            ) {
              return (
                <input
                  style={{
                    width: "120px",
                    marginLeft: "10px",
                    // position: "relative",
                    // top: "10px",
                    height: "36px",
                      border:"1px solid #CCCC",
                      borderRadius:"6px",
                      padding:"10px"
                    // left: "10px",
                  }}
                  placeholder={`${
                    item === "id"
                      ? "Document ID"
                      : item
                          .replace(/([A-Z])/g, " $1")
                          .charAt(0)
                          .toUpperCase() +
                        item.replace(/([A-Z])/g, " $1").slice(1)
                  }`}
                  label={`${
                    item
                      .replace(/([A-Z])/g, " $1")
                      .charAt(0)
                      .toUpperCase() + item.replace(/([A-Z])/g, " $1").slice(1)
                  }`}
                  onChange={(e) =>
                    setfilterPayload((prev) => ({
                      ...prev,
                      [item]: e.target.value,
                    }))
                  }
                  type={"text"}
                  id={item}
                  value={filterPayload[item]}
                />
              );
            } else if (item === "isActive") {
              return null;
            } else if (item === "type") {
              return (
                <CheckPicker
                  data={filters?.type?.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  placeholder="Type"
                  style={{ width: 224 }}
                  onChange={(val) => {
                    if (val.length < 1) {
                      setfilterPayload((prev) => ({
                        ...prev,
                        [item]: "",
                      }));
                    } else {
                      setfilterPayload((prev) => ({
                        ...prev,
                        [item]: val,
                      }));
                    }
                    settypevalue(val);
                  }}
                  value={typevalue}
                />
              );
            }
            return (
              <Dropdown
                title={handleTitle(item)}
                style={{ margin: "15px 0 0 20px" }}
              >
                {renderDropdownitems(item, filters[item])}
              </Dropdown>
            );
          })}
        </div>
        <div
          style={{
            marginLeft: "50px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              height: "30px",
              padding: "5px 20px",
              // position: "relative",
              // top: "20px",
              backgroundColor: "#FFCCCB",
            }}
            onClick={handleClearFilter}
          >
            Clear Filter
          </button>
          {/* <Tooltip title="Help">
              <HelpIcon
                onClick={handleOpen}
                style={{
                  marginTop: "20px",
                  marginLeft: "5px",
                  cursor: "pointer",
                }}
              />
            </Tooltip> */}
        </div>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        {selectedId?.length > 0 && (
          <div
            style={{
              backgroundColor: "#3f51b4",
              padding: "0rem 1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h4 style={{ color: "#fff" }}>
              {`${selectedId?.length} ${
                selectedId?.length > 1 ? "rows" : "row"
              }`}{" "}
              selected
            </h4>
            <div>
              {user.permissions.includes("doc003") ? (
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    onClick={() => setshwDeleteDialog(true)}
                  >
                    <DeleteIcon style={{ color: "#fff" }} />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
        <DataGrid
          rows={alldocs}
          columns={columns}
          pageSize={5}
          checkboxSelection={user.permissions.includes("doc003") ? true : false}
          getRowId={(row) => row.docId}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          onSelectionModelChange={(selection) => {
            console.log("onSelectionModelChange", selection);
            setselectedId(selection);
          }}
        />
      </div>
      <ClonosConfirmationDialog
        Open={shwDeleteDialog}
        Title="Delete Document"
        Content="Are you sure, You want to delete this document ?"
        CloseDialog={() => handleCloseDelDialog}
        ProceedDialog={() => handleProceedDelDialog}
      />
      {/* <div style={{ padding: "20px" }}>
        <p style={{ marginBottom: "20px" }}>
          Applied Filters: {handleApplyFilters(filterPayload)}
        </p>
      </div> */}
    </>
  );
};

export default Documents;
