import {
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { Button, CheckPicker, DateRangePicker, SelectPicker } from "rsuite";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import CloseOutlined from "@material-ui/icons/CloseOutlined";
import { BsPatchCheckFill } from "react-icons/bs";
import { useCallback, useState } from "react";
import ClonosConfirmationDialog from "../Dialogs/ClonosConfirmationDialog";
import { useEffect } from "react";
import ClonosApprovalModal from "../Dialogs/ClonosApprovalModal";
import { useDispatch, useSelector } from "react-redux";
import {
  approveMultipleUserChanges,
  approveSingleUserChange,
  getFilteredApprovals,
} from "../../Api/ApprovalSystem/approvalApi";
import { getUser, removeUserSession } from "../../utils/clonosCommon";
import { approvalActions } from "../../Store/Reducers/ClonosApprovalReducer";
import { commonActions } from "../../Store/Reducers/CommonReducer";
export const ClonosApprovalSystem = () => {
  const loggedUser = getUser();
  const [showDialog, setShowDailog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [action, setAction] = useState("");
  const dispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [approvalds, setApprovalIds] = useState([]);
  const [isApproveHovered, setIsApproveHovered] = useState(false);
  const [bulkApproveHovered, setBulkApproveHovererd] = useState(false);
  const [bulkRejectHovered, setBulkRejectHovered] = useState(false);
  const [isRejectHovered, setIsRejectHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [approvals,setApprovals] = useState([]);
  const [calendarVal,setcalendarVal] = useState([null,null]);
  const [inputValue,setInputValue] = useState("");
   const [filterPayload,setFilterPayload] = useState({
    type:"",
    userName:"",
    createdStartDate:"",
    createdEndDate:"",
    pendingApprovals:true
  })
  const pendingApprovals = useSelector(
    (state) => state.approvalData.pendingApprovals
  );
  const checkPickerData = [
    {
      type: "Engineering Data",
      value: "engineering data",
    },
    {
      type: "Asset",
      value: "asset",
    },
    {
      type: "User",
      value: "user",
    },
    {
      type: "Document",
      value: "document",
    },
  ];
  const handleCloseDialog = () => {
    setShowDailog(false);
  };

  const handleShowModal = (data,approvalId) => {
    data = {...data,approvalId}
    setShowModal(true);
    setModalData(data);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Approve or Reject userChanges

  const handleApprove = (action) => {
    if (action === "approve" || action === "reject") {
      const payload = {
        userId: loggedUser.userId,
        action: action,
        approvalId: approvalds[0],
        approvedBy: loggedUser.userId,
      };
      approveSingleUserChange(payload).then((response) => {
        setShowDailog(false);
        setAction("");
        getFilteredApprovals(loggedUser?.userId,{pendingApprovals:true}).then((res) => {
          console.log(res.data, "pending response");
          // dispatch(
          //   approvalActions.getPendingApprovals(res?.data?.approvals)
          // );
          setApprovals(res.data.approvals)
        }).catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: response.data.message,
            type: "success",
            verticalPosition: "top",
          })
        );
      }).catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    } else if (action === "bulk approve" || action === "bulk reject") {
      const payload = {
        userId: loggedUser.userId,
        action: action.split(" ")[1],
        approvalId: approvalds,
        approvedBy: loggedUser.userId,
      };
      approveMultipleUserChanges(payload)
        .then((response) => {
          setShowDailog(false);
          setAction("");
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: response.data.message,
              type: "success",
              verticalPosition: "top",
            })
          );
        })
        .catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
        .then((res) => {
          getFilteredApprovals(loggedUser?.userId,{pendingApprovals:true}).then((res) => {
            console.log(res.data, "pending response");
            // dispatch(
            //   approvalActions.getPendingApprovals(res?.data.pendingApprovals)
            // );
            setApprovals(res?.data?.approvals)
          }).catch((err) => {
            if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
              dispatch(commonActions.handleExpiryAlert(true));
              removeUserSession();
              localStorage.removeItem("loginUser")
            }
          })
        }).catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
    }
  };


  const handleDatechange = (value) => {
    if (value) {
      // setCurrentPage(1);
      const data = {
        startDate: value[0],
        endDate: value[1],
      };
      let prev_date = new Date(value[0]);
      let next_date = new Date(value[1]);
      prev_date.setHours(prev_date.getHours() + 5);
      prev_date.setMinutes(prev_date.getMinutes() + 30);
      next_date.setHours(next_date.getHours() + 5);
      next_date.setMinutes(next_date.getMinutes() + 30);
      data.startDate = prev_date;
      data.endDate = next_date;
      // let d1 = data.startDate.toISOString();
      // let d2 = data.endDate.toISOString();
      setcalendarVal([data.startDate,data.endDate])
      setFilterPayload({...filterPayload,createdStartDate:data.startDate,createdEndDate:data.endDate})
      // getFilteredApprovals(loggedUser.userId,{
      //   createdStartDate: data.startDate,
      //   createdEndDate: data.endDate,
      //   pendingApprovals:true
      // }).then((res) => {
      //   setApprovals(res?.data.approvals);
      //   setcalendarVal([data.startDate, data.endDate]);
      // });
    }
  };

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const filtersHelper = (value) => {
      setFilterPayload({...filterPayload,userName:value})
  };
  const handleSearch = useCallback(debounce(filtersHelper), []);
  const handleClearFilters = () => {
    setcalendarVal([null,null])
    setInputValue("")
    setFilterPayload({
      type:"",
    userName:"",
    createdStartDate:"",
    createdEndDate:"",
    pendingApprovals:true
    })
  }

  useEffect(() => {
    getFilteredApprovals(loggedUser?.userId,filterPayload).then((res) => {
      console.log(res.data.approvals, "pending response");
      // dispatch(approvalActions.getPendingApprovals(res?.data.approvals));
      setApprovals(res?.data?.approvals)
    }).catch((err) => {
      if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
        dispatch(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
  }, [filterPayload]);

  console.log(pendingApprovals, "approvalIds");
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 30px",
          marginBottom: "30px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gridGap: "10px" }}>
          <div
            style={{
              fontSize: "45px",
              color: "#FFFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <img style={{width:"50px"}} src={rolesPermission}/> */}
            <BsPatchCheckFill color="#3F51B5" fontSize="36px" />
          </div>
          <h2 style={{ color: "#3F51B5", fontFamily: "calibri" }}>
            <i>Approval System</i>
          </h2>
        </div>
        {/* <div>
          <Tooltip title="Help">
            <HelpIcon
              onClick={handleOpen}
              style={{
                marginTop: "20px",
                marginLeft: "5px",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        </div> */}
      </div>
      <Grid
        container
        style={{
          display: "flex",
          flexWrap: "wrap",
          margin: "auto auto 50px auto",
          width: "70%",
        }}
      >
        <Grid
          container
          lg={9}
          style={{ display: "flex", alignItems: "center", gridGap: "20px" }}
        >
          <Grid lg={1}>
            <SelectPicker
              placeholder="Type"
              size="md"
              data={checkPickerData.map((type) => ({
                label: type.type,
                value: type.value,
              }))}
              value={filterPayload.type}
              onChange={(val) => {
                setFilterPayload({...filterPayload,type:val})
              }}
            />
          </Grid>
          <Grid
            // lg={4}
            style={{ display: "flex", gridGap: "10px", alignItems: "center" }}
          >
            <p style={{ fontSize: "16px", fontWeight: "400" }}>Search By :</p>
            <input
              placeholder="UserName"
              style={{
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "6px",
              }}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleSearch(e.target.value)
              }}
            />
          </Grid>
          <Grid
            style={{ display: "flex", gridGap: "10px", alignItems: "center" }}
          >
            <p style={{ fontSize: "16px", fontWeight: "400" }}>Date : </p>
            <DateRangePicker
              format="dd-MM-yyyy "
              placeholder="dd-mm-yyyy"
              cleanable
              value={calendarVal}
              onChange={handleDatechange}
              onClean={() => {
                setcalendarVal([null,null])
                setFilterPayload({...filterPayload,createdStartDate:null,createdEndDate:null})
              }}
            />
          </Grid>
          <Grid
                  item
                  // lg={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <Button
                    onClick={handleClearFilters}
                    variant="contained"
                    color="secondary"
                    style={{ height: "35px", padding: "0px 22px",background:"#F50057",color:"#FFF" }}
                  >
                    Clear
                  </Button>
                </Grid>
        </Grid>
        <Grid
          lg={3}
          style={{
            display: "flex",
            justifyContent: "space-around",
            padding: "0px 20px",
          }}
        >
          <Tooltip title="Approve All">
            <IconButton
              aria-label="approve all"
              disabled={pendingApprovals?.length === 0}
              onClick={() => {
                setAction("bulk approve");
                setShowDailog(true);
                setApprovalIds(
                  pendingApprovals.map((pendingApproval) => {
                    return pendingApproval._id;
                  })
                );
              }}
              onMouseOver={() => {
                setBulkApproveHovererd(true);
              }}
              onMouseOut={() => {
                setBulkApproveHovererd(false);
              }}
              style={{
                color:
                  bulkApproveHovered && hoveredIndex === -1 ? "#FFF" : "black",
                background: bulkApproveHovered ? "#54B435" : "#CCC",
                borderRadius: "50%",
              }}
            >
              <DoneAllIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject All">
            <IconButton
              aria-label="reject all"
              disabled={pendingApprovals?.length === 0}
              onClick={() => {
                setAction("bulk reject");
                setShowDailog(true);
                setApprovalIds(
                  pendingApprovals.map((pendingApproval) => {
                    return pendingApproval._id;
                  })
                );
              }}
              onMouseOver={() => {
                setBulkRejectHovered(true);
              }}
              onMouseOut={() => {
                setBulkRejectHovered(false);
              }}
              style={{
                color: bulkRejectHovered ? "#FFF" : "#CF0A0A",
                background: bulkRejectHovered ? "#CF0A0A" : "#CCC",
                borderRadius: "50%",
              }}
            >
              <CloseOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container>
        <div style={{ width: "70%", margin: "auto", overflow: "auto" }}>
          <Paper style={{ width: "100%", overflow: "auto" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow className="hierarchyRow">
                    <TableCell style={{ width: "5%" }}>Sr.No</TableCell>
                    <TableCell style={{ width: "60%" }}>Message</TableCell>
                    <TableCell style={{ width: "10%" }}>Details</TableCell>
                    <TableCell style={{ width: "10%" }}>Approve</TableCell>
                    <TableCell style={{ width: "10%" }}>Reject </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="approvalSytemTableBody">
                  {approvals?.length > 0 ? (
                    approvals
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => {
                        const msg =
                          item?.type === "create_Asset"
                            ? "Created an Asset"
                            : "";
                        // const date = item?.createdDate.split("T")[0];
                        // let time = item?.createdDate.split("T")[1];
                        // time = time.split(".")[0]
                        // const [y,m,d] = date?.split("-");
                        const data = item.details[0];
                        let createdDate = new Date(item.createdDate);
                        createdDate.setHours(createdDate.getHours() + 5);
                        createdDate.setMinutes(createdDate.getMinutes() + 29);
                        const isoDateStringWithHours =
                          createdDate.toISOString();
                        let [date, time] = isoDateStringWithHours.split("T");
                        let [y, m, d] = date.split("-");
                        let hhmmss = time.split(".")[0];
                        let [hh, mm, ss] = hhmmss.split(":");
                        return (
                          <TableRow className="approvalTable">
                            <TableCell>
                              {approvals?.length &&
                                page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell>
                              {item.userName} has {msg} on {d}/{m}/{y} - {hh}:
                              {mm}:{ss}
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleShowModal(data,item._id)}
                                style={{
                                  background: "#3F51B5",
                                  color: "#FFF",
                                  padding: "5px",
                                }}
                              >
                                More Details
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Approve ">
                                <IconButton
                                  aria-label="approve "
                                  onClick={() => {
                                    setAction("approve");
                                    setApprovalIds([item._id]);
                                    setShowDailog(true);
                                  }}
                                  onMouseOver={() => {
                                    setIsApproveHovered(true);
                                    setHoveredIndex(index);
                                  }}
                                  onMouseOut={() => {
                                    setIsApproveHovered(false);
                                    setHoveredIndex(-1);
                                  }}
                                  style={{
                                    color:
                                      isApproveHovered && hoveredIndex === index
                                        ? "#FFF"
                                        : "black",
                                    background:
                                      isApproveHovered && hoveredIndex === index
                                        ? "#54B435"
                                        : "none",
                                    // borderRadius: "50%",
                                  }}
                                >
                                  <DoneAllIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Reject ">
                                <IconButton
                                  aria-label="reject"
                                  onClick={() => {
                                    setAction("reject");
                                    setApprovalIds([item._id]);
                                    setShowDailog(true);
                                  }}
                                  onMouseOver={() => {
                                    setIsRejectHovered(true);
                                    setHoveredIndex(index);
                                  }}
                                  onMouseOut={() => {
                                    setIsRejectHovered(false);
                                    setHoveredIndex(-1);
                                  }}
                                  style={{
                                    color:
                                      isRejectHovered && hoveredIndex === index
                                        ? "#FFF"
                                        : "#CF0A0A",
                                    background:
                                      isRejectHovered && hoveredIndex === index
                                        ? "#CF0A0A"
                                        : "none",
                                    // borderRadius: "50%",
                                  }}
                                >
                                  <CloseOutlined fontSize="medium" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        style={{
                          padding: "10px",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        No Results!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={approvals?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </Grid>
      <ClonosConfirmationDialog
        Action={action}
        Open={showDialog}
        Title={
          action === "bulk approve"
            ? "Bulk Approve Changes"
            : action === "bulk reject"
            ? "Bulk Reject Changes"
            : action === "approve"
            ? "Approve Changes"
            : action === "reject"
            ? "Reject Changes"
            : ""
        }
        Content={`Are you sure, You want to ${
          action === "bulk approve" || action === "approve"
            ? "Approve"
            : action === "bulk reject" || action === "reject"
            ? "Reject"
            : ""
        } ?`}
        CloseDialog={handleCloseDialog}
        ProceedDialog={() => handleApprove(action)}
      />
      {showModal && (
        <ClonosApprovalModal
          open={showModal}
          handleModal={setShowModal}
          data={modalData}
          setAction={setAction}
          setApprovalIds={setApprovalIds}
          setShowDailog={setShowDailog}
          setHoveredIndex={setHoveredIndex}
          setIsApproveHovered={setIsApproveHovered}
          isApproveHovered={isApproveHovered}
          setIsRejectHovered={setIsRejectHovered}
          isRejectHovered={isRejectHovered}
          hoveredIndex={hoveredIndex}
          setShowModal = {setShowModal}
        />
      )}
    </>
  );
};
