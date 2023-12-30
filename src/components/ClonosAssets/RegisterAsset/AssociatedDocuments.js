import { DataGrid } from "@mui/x-data-grid";
import Styles from "../../../ModuleStyles/Assets/associatedDocs.module.css";
import { Box, Tooltip } from "@mui/material";
import { Delete } from "@material-ui/icons";
import REDTRASH from "../../../assets/UIUX/icons/redTrash.svg";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import { UploadDocumentModal } from "./UploadDocumentModal";

export const AssociatedDocuments = ({ getData, data }) => {
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const defaultColumns = [
    {
      field: "id",
      headerName: "SI.NO",
      width: 100,
      headerClassName: "asso_doc_text_content",
      renderCell: (val) => {
        console.log(val,"bbbbbbb")
        return (
          <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
            {val?.row?.index || "Not Mentioned"}
          </p>
        );
      },
    },
    {
      field: "documentNumber",
      headerName: "DOCUMENT NUMBER",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell: (val) => {
        return (
          <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
            {val?.row?.documentNumber || "Not Mentioned"}
          </p>
        );
      },
    },
    {
      field: "documentName",
      headerName: "DOCUMENT NAME",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell: (val) => {
        return (
          <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
            {val?.row?.documentName || "Not Mentioned"}
          </p>
        );
      },
    },
    {
      field: "documentType",
      headerName: "DOCUMENT TYPE",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell: (val) => {
        return (
          <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
            {val?.row?.documentType?.name || "Not Mentioned"}
          </p>
        );
      },
    },
    {
      field: "status",
      headerName: "DOCUMENT STATUS",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell: (val) => {
        return (
          <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
            {val?.row?.status?.name || "Not Mentioned"}
          </p>
        );
      },
    },
    {
      field: "revisionNumber",
      headerName: "REVISION NUMBER",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell: (val) => {
        return (
          <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
            {val?.row?.revisionNumber || "Not Mentioned"}
          </p>
        );
      },
    },
    {
      field: "viewDoc",
      headerName: "VIEW DOCUMENT",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell: (val) => {
        return (
          <p
            style={{
              color: "#3f51b5",
              textDecoration: val?.row?.file?.name ? "underline" : "none",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {val?.row?.file?.name || "Not Mentioned"}
          </p>
        );
      },
    },
    {
      field: "action",
      headerName: "ACTION",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell: (val) => (
        <p
          onClick={() => {
            getSelectedRow({ ...val.row }, setSelectedRow);
            setShowUploadModal(true);
          }}
          style={{
            textDecoration: "underline",
            color: "#3f51b5",
            fontWeight: "500",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          {val?.row?.file ? "EDIT" : "UPLOAD"}
        </p>
      ),
    },
  ];
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const getSelectedRow = (val, setSelectedRow) => {
    setSelectedRow({ ...val });
  };

  const getDocumentData = (val) => {
    console.log(val, "from >>");
    let documents = rows?.map((document) => {
      if (document.id == val.id) {
        return val;
      } else {
        return document;
      }
    });
    console.log(documents, "from >> doc");
    setRows([...documents]);
    getData({ ...data, documents });
  };

  const handleCloseModal = () => {
    setShowUploadModal(false);
    setSelectedRow({});
  };
  useEffect(() => {
    setRows(data?.documents);
  }, [data?.documents?.length]);

  return (
    <>
      <div className={Styles.associatedDocsContainer}>
        <div className={Styles.associatedDocsSubContainer}>
          {/* <div className={Styles.addRowContainer}>
          <h5 className={Styles.addRowTitle}>+ Add Row</h5>
        </div> */}
          <div className={Styles.datagridContainer}>
            {
              rows?.length > 0 ? <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={rows || []}
                columns={defaultColumns}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box> : <div className={Styles.no_data_error_message}>
              <h4>Oops! It seems there are no documents available for selected Asset Category.</h4>
            </div>
            }
          </div>
        </div>
      </div>
      <UploadDocumentModal
        open={showUploadModal}
        data={selectedRow}
        closeModalMethod={handleCloseModal}
        getDocumentData={getDocumentData}
        getData={getData}
      />
    </>
  );
};
