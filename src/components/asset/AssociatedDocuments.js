import React, { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Tooltip from "@material-ui/core/Tooltip";
import ClonosConfirmationDialog from "../Dialogs/ClonosConfirmationDialog";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import BrandingWatermarkIcon from "@material-ui/icons/BrandingWatermark";
import {
  uploadAssociateDocs,
  getAllAssoDocs,
  getAllAssoDocsAndForms,
  deleteDoc,
  viewDoc,
  downloadDoc,
} from "../../Api/Documents/DocumentApi";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import DescriptionIcon from "@material-ui/icons/Description";
import { getToken, getUser } from "../../utils/clonosCommon";
import { getAllPermissions } from "../../Api/User/UserApi";
import configs from "../../config";
import AddDocumentDialog from "./AddDocumentDialog";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import QueueIcon from "@material-ui/icons/Queue";
import { useContext } from "react";
import {MdCommentBank} from "react-icons/md"

const AssociatedDocuments = () => {
  const USER_DETAILS = getUser();
  const dispatch = useDispatch();
  const NAVIGATE = useNavigate();
  const LOCATION = useLocation();
  const user = getUser();
  const [shwDeleteDialog, setshwDeleteDialog] = useState(false);
  // const assetData = useSelector((state) => state.assetData.assetDetail);
  const [assetData, setassetData] = useState(LOCATION?.state);
  const [alldocs, setalldocs] = useState([]);
  const [renderTable, setrenderTable] = useState(false);
  const [selectedId, setselectedId] = useState([]);

  const [allpermissions, setallpermissions] = useState([]);
  const [openAddDocDialog, setopenAddDocDialog] = useState(false);

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
    const token = getToken();
    window.open(`${configs.url}?docId=${docId}&token=${token}`);
    dispatch(commonActions.showApiLoader(false));
  };

  const handleDownloadDocument = async (docId) => {
    const doc = await downloadDoc(docId);
    const docUrl = doc.data.downloadUrl;
    dispatch(commonActions.showApiLoader(true));
    window.location.assign(docUrl);
    dispatch(commonActions.showApiLoader(false));
  };

  const handleViewDataDocument = (asset, row) => {
    NAVIGATE("/document-data", { state: { assoDocData: row, asset } });
  };

  // This function, "handleGotoSetupCanvas", is triggered when a user wants to navigate to the "/setup-canvas" route. It takes in two parameters, "asset" and "row", which are used to pass data along with the navigation.
  const handleGotoSetupCanvas = (asset, row) => {
    // The "NAVIGATE" function is used to navigate to the "/setup-canvas" route.
    // The data is passed through the "state" property as an object with the keys "assoDocData" and "asset".
    NAVIGATE("/setup-canvas", { state: { assoDocData: row, asset } });
  };

  const handleGotoComments = (asset,row) =>{
    NAVIGATE("/comments", { state: { assoDocData: row, asset } });
  }

  useEffect(() => {
    console.log("LOCATION?.state?", LOCATION?.state);
    console.log("assetData", assetData);
    getAllAssoDocsAndForms(assetData.assetId)
      .then((res) => {
        console.log("getAllAssoDocsAndForms RESPONSE", res);
        setalldocs(res?.data?.rows);
      })
      .catch((err) => console.log("getAllAssoDocsAndForms ERROR", err));
  }, [renderTable]);

  const columns = [
    {
      field: "ide",
      headerName: "Id",
      width: 90,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "documentName",
      headerName: "Document Name",
      width: 250,
      renderCell: (value) => {
        if (value.row.extension === "tmp") {
          return <span>{value.row.name}</span>;
        } else {
          if (value.row.version > 1) {
            return (
              <span>
                {value.row.documentName} - v{value.row.version}
              </span>
            );
          }
          return <span>{value.row.documentName}</span>;
        }
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
      width: 300,
      renderCell: (val) => {
        console.log(val);
        return (
          <>
            {val.row.extension === "tmp" && (
              <Tooltip title="Add Checklist Forms Data">
                <IconButton
                  onClick={() =>
                    NAVIGATE("/add-checklist-form-data", { state: val.row })
                  }
                  aria-label="view"
                >
                  <NoteAddIcon  style={{color:"green"}}/>
                </IconButton>
              </Tooltip>
            )}

            {USER_DETAILS.permissions.includes("doc001") ? (
              <Tooltip title="Add Dynamic Forms Data">
                <IconButton
                  aria-label="view-document"
                  component="span"
                  onClick={() =>
                    NAVIGATE("/add-form-data", { state: val.row })
                  }
                >
                  <QueueIcon  style={{color:"blue"}}/>
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
            {USER_DETAILS.permissions.includes("doc004") ? (
              <Tooltip title="View">
                <IconButton
                  aria-label="view-document"
                  component="span"
                  onClick={() =>
                    val.row.extension === "tmp"
                      ? handleViewDataDocument(assetData, val.row)
                      : handleViewDocument(val.row.docId)
                  }
                >
                  <VisibilityIcon  style={{color:"green"}}/>
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
            {USER_DETAILS.permissions.includes("doc008") ? (
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
            {handlePermission.document_View_Details ? (
              <Tooltip title="Canvas">
                <IconButton
                  aria-label="canvas"
                  component="span"
                  onClick={() =>
                    val.row.extension === "tmp"
                      ? handleGotoSetupCanvas(assetData, val.row)
                      : handleViewDocument(val.row.docId)
                  }
                >
                  <BrandingWatermarkIcon style={{color:"blue"}}/>
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}
            {handlePermission.document_View_Details ? (
              <Tooltip title="Comments">
                <IconButton
                  aria-label="comments"
                  component="span"
                  onClick={() =>
                    val.row.extension === "tmp"
                      ? handleGotoComments(assetData, val.row)
                      : handleViewDocument(val.row.docId)
                  }
                >
                  <MdCommentBank style={{color:"#333333"}}/>
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



  const handleCloseDelDialog = () => {
    setshwDeleteDialog(false);
  };

  const handleProceedDelDialog = () => {
    const data = {
      docId: selectedId,
      isDeleted: 1,
      deletedBy: user?.userId,
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
      });
  };

  const handleUploadDocs = (e) => {
    dispatch(commonActions.showApiLoader(true));
    if (e.target.files.length > 5) {
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
      for (let i = 0; i < e.target.files.length; i++) {
        formData.append(`file${i}`, e.target.files[i]);
      }
      formData.append("assetId", assetData.assetId);
      formData.append("userId", USER_DETAILS.id);
      formData.append("noOfFiles", e.target.files.length);

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
          console.log("uploadAssociateDocs ERROR", err);
          setrenderTable((prev) => !prev);
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: `${err.response.data.error}`,
              type: "error",
            })
          );
        });
    }
  };

  const closeAddDocDialog = () => {
    setopenAddDocDialog(false);
    setrenderTable((prev) => !prev);
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
            <i style={{ color: "#3f51b5" }}>Associated Documents</i> -{" "}
            {assetData?.assetName}
          </h2>
        </div>
        <div>
          <Button
            onClick={() => NAVIGATE(-1)}
            style={{ marginRight: "20px" }}
            variant="contained"
            color="primary"
            component="span"
          >
            Back
          </Button>
          {/* <input
            accept=".pdf, .xls, .xlsx, .csv, .dwg, .dxf, image/png, image/gif, image/jpeg, .fbx, .obj"
            style={{ display: "none" }}
            id="contained-button-file"
            multiple
            type="file"
            onChange={handleUploadDocs}
            onClick={(e) => (e.target.value = null)}
          />
          <label htmlFor="contained-button-file">
            {handlePermission.document_Create ? (
              <Button variant="contained" color="primary" component="span">
                Upload Document
              </Button>
            ) : (
              <></>
            )}
          </label> */}
          <Button
            variant="contained"
            color="primary"
            component="span"
            onClick={() => setopenAddDocDialog(true)}
          >
            Add Document
          </Button>
        </div>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        {selectedId.length > 0 && (
          <div
            style={{
              backgroundColor: "#3f51b4",
              padding: "0rem 1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h4 style={{ color: "#fff" }}>
              {`${selectedId.length} ${selectedId.length > 1 ? "rows" : "row"}`}{" "}
              selected
            </h4>
            <div>
              {USER_DETAILS.permissions.includes("doc003") ? (
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
          checkboxSelection={
            USER_DETAILS.permissions.includes("doc003") ? true : false
          }
          getRowId={(row) => row.id}
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
        CloseDialog={() => handleCloseDelDialog()}
        ProceedDialog={() => handleProceedDelDialog()}
      />
      <AddDocumentDialog
        AssetData={assetData}
        OpenModal={openAddDocDialog}
        HandleClose={() => closeAddDocDialog()}
      />
    </>
  );
};

export default AssociatedDocuments;
