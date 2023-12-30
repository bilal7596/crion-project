import { useEffect, useState } from "react";
import Styles from "../../../ModuleStyles/Assets/viewAsset.module.css";
import FiltersStyles from "../../../ModuleStyles/Assets/assets.module.css";
import { getWorkOrdersAssociatedWithAsset } from "../../../Api/Asset/assetApi";
import { useLocation } from "react-router-dom";
import { getFormatedDate, handleLoginExpiry } from "../../../utils/clonosCommon";
import { BsSearch } from "react-icons/bs";
import { SelectPicker } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { handleGetWorkOrder } from "../../../utils/WorkOrderMethods/WorkOrderMethods";
import { workOrderStateManagementActions } from "../../../Store/Reducers/ClonosWorkOrderReducer";
import { UnderDevelopmentPage } from "../../CommonComponents/UnderDevelopmentPage/UnderDevelopmentPage";
import { getWorkOrdersOfAsset } from "../../../Api/WorkOrder/WorkOrderApi";
export const ViewAssetHistory = ({data}) => {
//   const [workOrders, setWorkOrders] = useState([]);
  const Location = useLocation();
  const dispatch = useDispatch()
  const [filters, setFilters] = useState({});
  const [totalWorkOrder,setTotalWorkOrder] =useState()
  const [currentPage,setCurrentPage]= useState(1)
  const [workOrders,setWorkOrders] = useState([])
  const status = ["Completed","Draft","Accepted","Scheduled","On Hold","All"]
  const handleChangeFilters = (e) => {
    const {name,value} = e.target;
    setFilters((prev) => {
        return {
            ...prev,
            [name] : value
        }
    })
  }

  useEffect(() => {
    getWorkOrdersOfAsset({assetId:data?._id}).then((res) => {
      setWorkOrders(res?.data?.result?.workOrders)
    })
    .catch((err) => {
      handleLoginExpiry(err,dispatch)
    })
  },[filters])

  useEffect(() => {

  },[dispatch])
  console.log(filters,workOrders,"workorders")
  return (
    <div className={Styles.astHistoryContainer}>
      {/* <div className={Styles.astHistoryFilters}>
        <div className={FiltersStyles.filterItem}>
          <div className={FiltersStyles?.astSearchbar}>
            <div className={FiltersStyles.searchIconContainer}>
              <BsSearch fontSize="medium" />
            </div>
            <input
              name="title"
              onChange={handleChangeFilters}
              placeholder="Work Order"
            />
          </div>
        </div>
        <div className={FiltersStyles.filterItem} style={{border:"1px solid #dcdcdc",borderRadius:"6px",overflow:"hidden",padding:"0.2em"}}>
            <SelectPicker onSelect={(val) => {
                setFilters((prev) => ({
                 ...prev,
                 status : val   
                }))
            }}
            onClean={() => 
                setFilters((prev) => ({
                    ...prev,
                    status : ""   
                   }))
            }
            searchable={false} placeholder="Status" data={status?.map((item) => {
                return {label:item,value:item}
            })}/>
        </div>
        <div className={FiltersStyles.filterItem}>
          <div className={FiltersStyles?.astSearchbar}>
            <div className={FiltersStyles.searchIconContainer}>
              <BsSearch fontSize="medium" />
            </div>
            <input
              name="user"
              onChange={handleChangeFilters}
              placeholder="Assiged User"
            />
          </div>
        </div>
      </div> */}
      <div className={Styles.astHistoryTableContainer}>
        <table>
          <thead>
            <tr>
              <th>SR.NO</th>
              <th>Maintenance Date</th>
              <th>Status</th>
              <th>Work Orders</th>
              <th>Users Involved</th>
            </tr>
          </thead>
          <tbody>
            {workOrders?.length ? (
              workOrders?.map((workOrder, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{getFormatedDate(workOrder?.dueDate)}</td>
                    <td>{workOrder?.status}</td>
                    <td>{workOrder?.title}</td>
                    <td>{workOrder?.users?.userName}</td>
                  </tr>
                );
              })
            ) : (
              <>
                <tr>
                  <td style={{ padding: "1em" }} colSpan={5}>
                    No Workorders Present !
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
    // <UnderDevelopmentPage/>
  );
};
