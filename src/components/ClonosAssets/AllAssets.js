import {
  Button,
  ButtonGroup,
  Box,
  Checkbox,
  Container,
  Tooltip,
} from "@material-ui/core";
import ALLASSETIMG from "../../assets/images/all-gear.png";
import {
  getFormatedDate,
  getUser,
  loginJumpLoadingStopper,
  removeUserSession,
} from "../../utils/clonosCommon";
import {
  getAllAssetsDataMethod,
  handleDownloadTemp,
  handleUploadSheet,
} from "../../utils/AssetsMethods/AssetsList";
import { Link, useNavigate } from "react-router-dom";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { DateRangePicker, SelectPicker } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Styles from "../../ModuleStyles/Assets/assets.module.css";
import { FaFilter } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import { BsSearch } from "react-icons/bs";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { getAllAssets } from "../../Api/Asset/assetApi";
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer";
import {
  download3DExcel,
  downloadCSV,
  downloadExcel,
  handleDeleteAsset,
} from "../../utils/AssetsMethods/AssetRegister";
import ClonosConfirmationDialog from "../Dialogs/ClonosConfirmationDialog";
import Pagination from "../CommonComponents/Pagination/Pagination";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { AssetFilters } from "./AssetFilters";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import Menubar from "../CommonComponents/Menubar/Menubar";
import { updateLayout } from "../../utils/clonosCommon";
import { DataGrid } from "@mui/x-data-grid";
import { UnAuthorizedModal } from "../CommonComponents/UnAuthorizedPage/UnAuthorizedModal";
import useToggler from "../../CustomHooks/TogglerHook";
import MultiSelectionController from "../CommonComponents/MultiSelectionController/MultiSelectionController";
import NOIMAGE from "../../assets/images/noImg.jpg"
import ClonosSelect from "../CommonComponents/ClonosSelect/ClonosSelect";
import ClonosDataGrid from "../CommonComponents/ClonosDataGrid/ClonosDataGrid";
import { MaintenanceTasksListModal } from "../../Clonos_Modules/ScheduledMaintenance/MaintenanceTasksListModal/MaintenanceTasksListModal";
export const AllAssets = () => {
  const user = getUser();
  const store = useSelector((store) => store);
  const { mainLayoutChildrenPositionsToolkitState } = useSelector(
    (store) => store.globalEntitiesStateManagement
  );
  const [showMaintenanceModal,setShowMaintenanceModal] = useState(false);
  const [selelctedRowAssetId,setSelectedRowAssetId] = useState(null)
  const [editableRow, setEditableRow] = useState({});
  const [showDeleteDailog, setShowDeleteDailog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch();
  const [totalPage, setTotalPage] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [allSelected, setAllSelected] = useState(false);
  // const allAssets = useSelector((state) => state.assetData.allAssets);
  const [allAssets,setAllAssets] = useState([])
  const [limit, setLimit] = useState(7);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showMaintenancePlans,setShowMaitenancePlans] = useState(false)
  const [showMoreOption, setShowMoreOption] = useState(null);
  const [rowsWithIndex, setRowsWithIndex] = useState([]);
  const [showLoader,setShowLoader] = useState(false)
  const getAppliedFilters = (value) => {
    setAppliedFilters(value);
  };
  const columns = [
    {
      field: "rowNumber",
      headerName: "SI.NO",
      width: "100",
      // flex:1,
      disableColumnFilter: true,
      headerClassName: "ast_column_header",
    },
    {
      field: "assetImage",
      headerName: "Asset",
      width:"100",
      // flex: 1,
      disableColumnFilter: true,
      headerClassName: "ast_column_header",
      filterPanelClassName: "ast_column_filterPanel",
      renderCell:(params) => {
        return <img height={30} width={30} src={params?.row?.assetImages?.length > 0 ?  params?.row?.assetImages[0]?.imageUrl : NOIMAGE}/>
      }
    },
    {
      field: "assetNumber",
      headerName: "Asset Number",
      // width:"200",
      flex: 1,
      disableColumnFilter: true,
      headerClassName: "ast_column_header",
      filterPanelClassName: "ast_column_filterPanel",
    },
    {
      field: "assetName",
      headerName: "Asset Name",
      // width:"300"
      renderCell: (params) => (
        <p
          style={{ cursor: "pointer", color: "#0A5FFF" }}
          onClick={() =>
            NAVIGATE("/view-asset", {
              state: {
                assetId: params?.row?._id,
                parentId: params?.row?.parentAsset,
                activePage,
                limit,
              },
            })
          }
        >
          {params?.row?.assetName}
        </p>
      ),
      flex: 1,
      headerClassName: "ast_column_header",
    },
    {
      field: "assetDepartment",
      headerName: "Department",
      // width:"300",
      headerClassName: "ast_column_header",
      flex: 1,
      valueGetter: (params) => params?.row?.assetDepartment?.dropdownValues || "Not Available",
    },
    {
      field: "criticalityLevel",
      headerName: "Criticality Level",
      // width:"300",
      headerClassName: "ast_column_header",
      flex: 1,
      valueGetter: (params) => params?.row?.criticalityLevel?.dropdownValues || "Not Available",
    },
    {
      field: "assetOwner",
      headerName: "Owner",
      // width:"300"
      flex: 1,
      headerClassName: "ast_column_header",
      valueGetter: (params) => params?.row?.assetOwner?.name || "Not Available",
    },
    {
      field: "assetStatus",
      headerName: "Status",
      // minWidth:"150"
      flex: 1,
      headerClassName: "ast_column_header",
      valueGetter: (params) => params?.row?.assetStatus || "Not Available",
    },
    {
      field: "maintenancePlan",
      headerName: "Maintenance Plan",
      // minWidth:"150"
      flex: 1,
      headerClassName: "ast_column_header",
      renderCell : (val) => {
        console.log(val,"valll")
        return <>
          <p style={{textDecoration:"underline",color:"#0A5FFF"}} onClick={() => {
            setShowMaintenanceModal(true);
            setSelectedRowAssetId(val?.row?._id)
          }}>View Maintenance Plan</p>
        </>
      } 
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      // minWidth:"150",
      flex: 1,
      valueGetter: (params) => getFormatedDate(params.value),
      headerClassName: "ast_column_header",
    },
  ];
  const maintenanceTypes = [
    {id:1,label:"Scheduled Maintenance",value:"Schedule Maintenance",inNeeded:true},
    {id:2,label:"Preventive Maintenance",value:"Preventive Maintenance",inNeeded:false},
    {id:2,label:"Predictive Maintenance",value:"Predictive Maintenance",inNeeded:false}
  ]
  const [lsLocalLoading, setIsLocalLoading] = useToggler(); // Custom Hook which returns boolean value (initial value : "false")
  const handleGetValues = (val) => {
    console.log(val)
  }
  useEffect(() => {
    let interval = loginJumpLoadingStopper({
      setterFunction: setIsLocalLoading,
      timeout: 5000,
    });
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    updateLayout({ dispatch });
    getAllAssetsDataMethod({setAllAssets,dispatch})
  }, []);

  useEffect(() => {
    setShowLoader(true)
    if(allAssets?.length > 0){
      setShowLoader(false)
    }
    setRowsWithIndex([
      ...allAssets?.map((row, index) => ({
        ...row,
        rowNumber: index + 1,
      })),
    ]);
  },[allAssets])

  console.log(selectedRows, "selectedRows");
  if (user?.permissions.includes("ast005")) {
    return (
      <>
      <div
        className={Styles.assetsContainer}
        style={{
          height:
            mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart
              ?.height,
        }}
      >
        <div className={Styles.assetsHeader}>
          <div className={Styles.assetsLogoContainer}>
            {/* <img src={ALLASSETIMG} alt="ALL_ASSETS" /> */}
            <h2>All Assets</h2>
          </div>
          <div className={Styles.custom_flexBox}>
          {/* <div>
                <ClonosSelect options={maintenanceTypes} isLabel={false} type={"select"}
                uniqueKey="maintenanceType"
                defaultValue={""}
                placeholder="Create"
                isMandatory={true}
                handleGetValues={(value) => handleGetValues(value)}/>
              </div> */}
            <div className={Styles.exportAstContainer}>
              <div
                className={Styles.maintenanceDrawer}
                onClick={() => setShowMaitenancePlans(!showMaintenancePlans)}
              >
                <span>Create Maintenance Plan</span>
                {!showMaintenancePlans ? (
                  <span>
                    <ArrowDropDownIcon />
                  </span>
                ) : (
                  <span>
                    <ArrowDropUpIcon />
                  </span>
                )}
              </div>
              {showMaintenancePlans ? (
                <div
                  className={Styles.drawerOptions}
                  onClick={() => setShowMaitenancePlans(false)}
                >
                  <p onClick={() => NAVIGATE("/create-maintenanceTask")}>Scheduled Maintenance</p>
                  <p>Preventive Maintenance</p>
                  <p>Predictive Maintenance</p>
                </div>
              ) : (
                <></>
              )}
            </div>  
            {/* <div className={Styles.exportAstContainer}>
              <div
                className={Styles.exportBTn}
                onClick={() => setShowExportOptions(!showExportOptions)}
              >
                <span>Export Table</span>
                {!showExportOptions ? (
                  <span>
                    <ArrowDropDownIcon />
                  </span>
                ) : (
                  <span>
                    <ArrowDropUpIcon />
                  </span>
                )}
              </div>
              {showExportOptions ? (
                <div
                  className={Styles.exportOptions}
                  onClick={() => setShowExportOptions(false)}
                >
                  <p onClick={() => downloadCSV(appliedFilters)}>To CSV</p>
                  <p onClick={() => downloadExcel(appliedFilters)}>To Excel</p>
                  <p onClick={() => download3DExcel(appliedFilters)}>
                    To Excel-3d System
                  </p>
                </div>
              ) : (
                <></>
              )}
            </div> */}
            {user.permissions.includes("ast001") ? (
              <button
                className={Styles.custom_button}
                onClick={() => NAVIGATE("/create-asset")}
              >
                Create New Asset
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className={Styles.sectionContainer}>
          <div className={Styles.subSectionContainer}>
            {/* <AssetFilters
              activePage={activePage}
              limit={limit}
              setTotalPage={setTotalPage}
              getAppliedFilters={getAppliedFilters}
            /> */}
            {/* <MultiSelectionController isActiveComponent={selectedRows?.length > 0 ? true : false} isDelete={true} deletePermission={"ast003"} isDeleteMethod={() => setShowDeleteDailog(true)} selectedRowCount={selectedRows?.length} />
            <Box sx={{ height:650,maxWidth: "90vw",margin:"auto" }}>
              <DataGrid
                rows={rowsWithIndex?.length > 0 ? rowsWithIndex : []}
                getRowId={(row) => row._id}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                loading={rowsWithIndex?.length > 0 ? showLoader : false}
                onRowSelectionModelChange={(selectedRow) => {
                  setSelectedRows([...selectedRow])
               }}
                pageSizeOptions={[10]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </Box> */}
            <ClonosDataGrid handleGetSelectedRowsMethod={(val) => setSelectedRows(val?.selectedRows)} rows={rowsWithIndex?.length > 0 ? rowsWithIndex : []} columns={columns} uniqueIdField={"_id"}  pageLimit={10} height={600} isEdit={false} isDelete={true} deletePermission="ast003"  isDeleteMethod={() => setShowDeleteDailog(true)} />
            <ClonosConfirmationDialog
              Open={showDeleteDailog}
              CloseDialog={() => {
                setShowDeleteDailog(false);
                showMoreOption?.setIsOpen(false);
              }}
              Title="Delete Asset"
              Content={"Are you sure you want to delete"}
              ProceedDialog={() => {
                showMoreOption?.setIsOpen(false);
                handleDeleteAsset(
                  {payload:{ assetIds: selectedRows, updatedBy: user?.userId },
                  activePage,
                  limit,
                  dispatch,
                  setShowDeleteDailog,
                  setSelectedRows,
                  setActivePage,
                  setTotalPage,
                  setAllAssets
                }
                );
              }}
            />
          </div>
        </div>
      </div>
      <MaintenanceTasksListModal assetId={selelctedRowAssetId} open={showMaintenanceModal} closeModalMethod={setShowMaintenanceModal}/>
      </>
    );
  }
  return !lsLocalLoading ? (
    <h1 style={{ textAlign: "center" }}>Loading...</h1>
  ) : (
    <Container component="main" maxWidth="sm">
      <UnAuthorizedModal />
    </Container>
  );
};
