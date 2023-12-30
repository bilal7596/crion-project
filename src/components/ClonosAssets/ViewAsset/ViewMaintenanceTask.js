import { useEffect, useState } from "react"
import { UnderDevelopmentPage } from "../../CommonComponents/UnderDevelopmentPage/UnderDevelopmentPage"
import { getAllScheduledMaintenanceOfAsset } from "../../../Api/ScheduleMaintenance/ScheduleMaintenance"
import ClonosDataGrid from "../../CommonComponents/ClonosDataGrid/ClonosDataGrid"
import { getFormatedDate } from "../../../utils/clonosCommon"
import ClonosConfirmationDialog from "../../Dialogs/ClonosConfirmationDialog"

export const ViewMaintenanceTask = ({data}) => {
    const [maintenanceTasksList,setMaintenanceTasksList] = useState([]);
    const [showConfirmationDailog,setShowConfirmationDailog] = useState(false)
    const columns = [ 
        // {
        //     field: "siNo",
        //     headerName: "SI.NO",
        //     width: 100,
        //   },
          {
            field: "maintenancePlanName",
            headerName: "Maintenance Plan Name",
            flex: 1,
            renderCell: (val) => {
              return (
                <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
                  {val?.row?.maintenancePlanName || "Not Present"}
                </p>
              );
            },
          },
          {
            field: "assignee",
            headerName: "Assignee",
            flex: 1,
            renderCell: (val) => {
              return (
                <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
                  {val?.row?.assignee?.name || "Not Present"}
                </p>
              );
            },
          },
          {
            field: "priority",
            headerName: "Priority",
            flex: 1,
            renderCell: (val) => {
              return (
                <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
                  {val?.row?.priority?.name || "Not Present"}
                </p>
              );
            },
          },
          // {
          //   field: "team",
          //   headerName: "Team",
          //   flex: 1,
          //   renderCell: (val) => {
          //     return (
          //       <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
          //         {val?.row?.team?.name || "Not Present"}
          //       </p>
          //     );
          //   },
          // },
          {
            field: "isRecurring",
            headerName: "Frequency",
            flex: 1,
            renderCell: (val) => {
              return (
                <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
                  {val?.row?.isRecurring ? "Recurring" : "Not Recurring"}
                </p>
              );
            },
          },
        //   {
        //     field: "scheduledOn",
        //     headerName: "SCHEDULED ON",
        //     flex: 1,
        //     renderCell: (val) => {
        //       return (
        //         <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
        //           {val?.row?.isRecurring ? "Recurring" : "Not Recurring"}
        //         </p>
        //       );
        //     },
        //   },
          {
            field: "status",
            headerName: "STATUS",
            flex: 1,
            renderCell: (val) => {
              return (
                <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
                  {val?.row?.status || "Not Present"}
                </p>
              );
            },
          },
          {
            field: "createdOn",
            headerName: "CREATED ON",
            flex: 1,
            renderCell: (val) => {
              return (
                <p style={{ color: "#000", fontSize: "16px", fontWeight: "500" }}>
                  {getFormatedDate(val?.row?.createdDate) || "Not Present"}
                </p>
              );
            },
          },
          
    ]

    useEffect(() => {
        getAllScheduledMaintenanceOfAsset(data?._id).then((res) => {
          let data = res?.data?.result?.lists
            setMaintenanceTasksList(data?.map((task,index) => ({...task,siNo:index+1})))
        })
    },[data?._id])

    console.log(maintenanceTasksList,"maintenanceTasksList")
    return <>
        <div style={{width:"80%",margin:"auto",padding:"42px"}}>
            <ClonosDataGrid checkboxSelection={false} handleGetSelectedRowsMethod={(val) => {}} rows={maintenanceTasksList} columns={columns} uniqueIdField={"maintenanceId"}  pageLimit={10} height={600} isEdit={false} isDelete={true} deletePermission="doc003" isDeleteMethod={() => setShowConfirmationDailog(true)}  />
        </div>
        <ClonosConfirmationDialog open={showConfirmationDailog} CloseDialog={() => setShowConfirmationDailog(false)} Title="Delete Maintenance Task" Content={'Are you sure you want to delete?'} ProceedDialog={() => {}} />
        {/* <UnderDevelopmentPage/> */}
    </>
}

// http://20.204.85.50:3333/api/v1/scheduleMaintenance/lists/ast-65783b6fbde6c3ce7d930e58
// http://20.204.85.50:3333/api/v1/scheduleMaintenance/lists/ast-65783b6fbde6c3ce7d930e58