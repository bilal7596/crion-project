import { DataGrid } from "@mui/x-data-grid";
import Styles from "../../../ModuleStyles/Assets/associatedDocs.module.css";
import { Box, Tooltip } from "@mui/material";
import { Delete } from "@material-ui/icons";
import REDTRASH from "../../../assets/UIUX/icons/redTrash.svg";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import { UploadDocumentModal } from "../RegisterAsset/UploadDocumentModal";
import { getAssetDocuments } from "../../../Api/Asset/assetApi";
import { handleLoginExpiry, handleShowErrorAndWarning } from "../../../utils/clonosCommon";
import ClonosDataGrid from "../../CommonComponents/ClonosDataGrid/ClonosDataGrid";
const getSelectedRow = (val,setSelectedRow) => {
  setSelectedRow({...val})
}
export const EditAssociatedDocuments = ({ getData, data,getChangedValues,changedData }) => {
  const dispatch = useDispatch();
  const [showUploadModal,setShowUploadModal] = useState(false);
  const [rows, setRows] = useState();
  const [selectedRow,setSelectedRow] = useState(null)
  const columns = [
    {
      field: "index",
      headerName: "SI.NO",
      width: 100,
      headerClassName: "asso_doc_text_content",
    },
    {
      field: "documentNumber",
      headerName: "DOCUMENT NUMBER",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell:(val) => {
        return <p style={{color:"#000",fontSize:"16px",fontWeight:"500"}}>{val?.row?.documentNumber || ""}</p>
      }
    },
    {
      field: "documentName",
      headerName: "DOCUMENT NAME",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell:(val) => {
        return <p style={{color:"#000",fontSize:"16px",fontWeight:"500"}}>{val?.row?.documentName || ""}</p>
      }
    },
    {
      field: "documentType",
      headerName: "DOCUMENT TYPE",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell : (val) => {
        return <p style={{color:"#000",fontSize:"16px",fontWeight:"500"}}>{val?.row?.documentType?.name || ""}</p>
      }
    },
    {
      field: "status",
      headerName: "DOCUMENT STATUS",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell : (val) => {
        return <p style={{color:"#000",fontSize:"16px",fontWeight:"500"}}>{val?.row?.status?.name || ""}</p>
      }
    },
    {
      field: "revisionNumber",
      headerName: "REVISION NUMBER",
      flex: 1,
      headerClassName:  "asso_doc_text_content",
      renderCell:(val) => {
        return <p style={{color:"#000",fontSize:"16px",fontWeight:"500"}}>{val?.row?.revisionNumber || ""}</p>
      }
    },
    {
      field: "viewDoc",
      headerName: "VIEW DOCUMENT",
      flex: 1,
      headerClassName: "asso_doc_text_content",
      renderCell : (val) => {
        console.log(val,"from colims")
        return <p style={{color:"#3f51b5",textDecoration:"underline",fontSize:"16px",fontWeight:"500",cursor:"pointer"}}>{val?.row?.fileName || ""}</p>
      }
    },
    {
      field:"action",
      headerName:"Edit",
      flex:1,
      headerClassName:"asso_doc_text_content",
      renderCell:(val) => <p onClick={() => {
        getSelectedRow({...val.row},setSelectedRow)
        setShowUploadModal(true)
      } } style={{color:"#3f51b5",fontWeight:"500",fontSize:"16px",cursor:"pointer"}}>EDIT</p>
    }
  ];
  const getDocumentData = (val) => {
    console.log(val,"va;l",rows)
    let documents = rows?.map((document) => {
      if(document.docId === val.docId){
        return val
      } else {
        return document
      }
    })
    setRows([...documents])
    getData({...data,documents})
    getChangedValues({...changedData,documents:changedData?.documents?.length > 0 ? [...changedData.documents,val] : [val]})
  } 

  const getChangedDocuments = (val) => {
    // console.log(val,"from doc val");
    // data?.documents?.map((doc) => {
    //   if(doc?.docId == val?.id){
    //     getChangedValues(({...changedData,documents:changedData?.documents?.length > 0 ? [...changedData.documents,val] : [val]}))
    //   } 
    // })
  }

  const handleCloseModal = () => {
    setShowUploadModal(false)
  }
  useEffect(() => {
   if(data?._id){
    getAssetDocuments(data?._id).then((res) => {
      getData({...data,documents:res?.data?.result})
    })
    .catch((err) => {
      handleLoginExpiry(err,dispatch);
      if(err?.response?.data?.status != 401){
        handleShowErrorAndWarning({dispatch,message:"Encountered a server error while fetching asset documents.",type:"error",showTime:"5000"})
      }
    })
   }
  },[data?._id])
  
  useEffect(() => {
    setRows(data?.documents)
  },[data?.documents?.length])
  console.log(data,changedData,"changedData from doc")
  return (
    <>
    <div className={Styles.associatedDocsContainer}>
      <div className={Styles.associatedDocsSubContainer}>
        <div className={Styles.datagridContainer}>
          {
            rows?.length > 0 ? <Box sx={{ height: 400, width: "100%" }}>
            {/* <DataGrid
              rows={rows}
              columns={columns}
              pageSizeOptions={[5]}
              checkboxSelection
              disableRowSelectionOnClick
            /> */}
            <ClonosDataGrid checkboxSelection={false}  rows={rows?.map((doc,index) =>({...doc,index:index+1}) )} columns={columns} uniqueIdField={"docId"}  pageLimit={10} height={600}  />
          </Box> : <div className={Styles.no_data_error_message}>
              <h4>Oops! It seems there are no documents available.</h4>
            </div>
          }
        </div>
      </div>
    </div>
    <UploadDocumentModal open={showUploadModal} data={selectedRow} closeModalMethod={handleCloseModal} getDocumentData={getDocumentData} getChangedValues={getChangedDocuments} mode={"edit"}/>
    </>
  );
};
