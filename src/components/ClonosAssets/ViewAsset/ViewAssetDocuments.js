import { useEffect, useState } from "react";
import { UnderDevelopmentPage } from "../../CommonComponents/UnderDevelopmentPage/UnderDevelopmentPage"
import { getAssetDocuments } from "../../../Api/Asset/assetApi";
import { handleLoginExpiry } from "../../../utils/clonosCommon";
import { useDispatch } from "react-redux";
import ClonosDataGrid from "../../CommonComponents/ClonosDataGrid/ClonosDataGrid";
import ClonosConfirmationDialog from "../../Dialogs/ClonosConfirmationDialog";
import { deleteMultipleDocumentAPI } from "../../../Api/Documents/DocumentApi";

export const ViewAssetDocuments = ({data}) => {
    const [rows,setRows] = useState([])
    const dispatch = useDispatch();
    const [showConfirmationDailog,setShowConfirmationDailog] = useState(false);
    const [selectedRows,setSelectedRows] = useState([])
    const columns = [ 
        {
            field: "index",
            headerName: "SI.NO",
            width: 100,
            headerClassName: "asso_doc_text_content",
            renderCell: (val) => {
              console.log(val,"bbbbbbb")
              return (
                <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
                  {val?.row?.index || "Not Present"}
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
                  {val?.row?.documentNumber || "Not Present"}
                </p>
              );
            },
          },
          {
            field: "documentTitle",
            headerName: "DOCUMENT NAME",
            flex: 1,
            headerClassName: "asso_doc_text_content",
            renderCell: (val) => {
              return (
                <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
                  {val?.row?.documentName || "Not Present"}
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
                  {val?.row?.documentType?.name || "Not Present"}
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
                  {val?.row?.status?.name || "Not Present"}
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
                  {val?.row?.revisionNumber || "Not Present"}
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
                  {val?.row?.documentName || "Not Present"}
                </p>
              );
            },
          },
        //   {
        //     field: "action",
        //     headerName: "ACTION",
        //     flex: 1,
        //     headerClassName: "asso_doc_text_content",
        //     renderCell: (val) => (
        //       <p
        //         onClick={() => {
        //           getSelectedRow({ ...val.row }, setSelectedRow);
        //           setShowUploadModal(true);
        //         }}
        //         style={{
        //           textDecoration: "underline",
        //           color: "#3f51b5",
        //           fontWeight: "500",
        //           fontSize: "16px",
        //           cursor: "pointer",
        //         }}
        //       >
        //         {val?.row?.file ? "EDIT" : "UPLOAD"}
        //       </p>
        //     ),
        //   },
    ]

    const handleDelete = () => {
        deleteMultipleDocumentAPI({payload:selectedRows}).then((res) => {
            console.log(res?.data,"from delete")
        }).catch((err) => {
            handleLoginExpiry(err,dispatch)
        })
    }

    useEffect(() => {
        if(data?._id){
            getAssetDocuments(data?._id).then((res) => {
                console.log(res?.data,"dococco")
                setRows(res?.data?.rows)
            })
            .catch((err) => {
                handleLoginExpiry(err,dispatch);
            })
        }
    },[data?._id])
    console.log(selectedRows,"selected")    
    return <>
        <div style={{width:"80%",margin:"auto",padding:"42px"}}>
            <ClonosDataGrid handleGetSelectedRowsMethod={(val) => setSelectedRows(val?.selectedRows)} rows={rows?.map((row,index) => ({...row,index:index+1}))} columns={columns} uniqueIdField={"docId"}  pageLimit={10} height={600} isEdit={false} isDelete={true} deletePermission="doc003" isDeleteMethod={() => setShowConfirmationDailog(true)}  />
        </div>
        <ClonosConfirmationDialog
                Open={showConfirmationDailog}
                CloseDialog={() => setShowConfirmationDailog(false)}
                Title="Delete Document"
                Content="Are you sure you want to delete?"
                ProceedDialog={handleDelete}
            />
        {/* <UnderDevelopmentPage/> */}
    </>
}