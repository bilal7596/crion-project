import { useState } from 'react'
import { Pagination, SelectPicker } from 'rsuite';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from "../../ModuleStyles/WorkOrder/WorkOrderList.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { decryptData, handleLoggedInUser, handleSegregateURL, segregateURL, updateLayout } from '../../utils/clonosCommon';
import CommonNavigator from '../../components/CommonComponents/Navigator/Navigator';
import NeedToFilterComp from '../../components/CommonComponents/FilterInput/NeedToFilterComp';
import { workOrderStateManagementActions } from '../../Store/Reducers/ClonosWorkOrderReducer';
import { handleGetPriorityDropdown, handleGetWorkOrder } from '../../utils/WorkOrderMethods/WorkOrderMethods';
// import "../../overrideStyle.css"
import searchIcon from "../../assets/UIUX/icons/search (1).svg"
import selectDownArrowIcon from "../../assets/UIUX/icons/chevron-down.svg"
import DateComp from '../../components/CommonComponents/Date/DateComp';
import WorkOrderListTable from '../../components/WorkOrder/WorkOrderListTable';



const UnityWorkOrderList = () => {
    // Global States 
    const store = useSelector(store => store)
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);

    // Local States 
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()
    console.log('currentPage:', currentPage)
    let [filterNav, setFilterNav] = useState([{ value: "All", status: true },
        , { value: "Draft", status: false },
        , { value: "Scheduled", status: false },
        , { value: "Accepted", status: false },
        , { value: "On Hold", status: false },
        , { value: "Completed", status: false },
    ])
    let [needToFilter, setNeedToFilter] = useState({ ["use"]: false })
    const { workOrderToolkitState, workOrderPriorityDropdownToolkitState } = useSelector((store) => store.workOrderStateManagement)
    const [totalWorkOrder, setTotalWorkOrder] = useState(1)
    const dispatch = useDispatch()
    const [priorityDropdownData, setPriorityDropdownData] = useState(workOrderPriorityDropdownToolkitState)
    console.log('priorityDropdownData:', priorityDropdownData)

    const handleGetValue = (event) => {
        console.log('event:', event)
        let parsedData = JSON.parse(event)
        setNeedToFilter((prev) => {
            let updatedValues = { ...prev, ["priority"]: parsedData?.label };
            console.log('updatedValues:', updatedValues)
            debouncedHandleGetWorkOrder(updatedValues)
            return updatedValues
        })
    }

    const getSelectedValue = (values) => {
        console.log('values:', values)
        setNeedToFilter((prev) => {
            let updatedValues = { ...prev, ["status"]: values };
            console.log('updatedValues:', updatedValues)
            debouncedHandleGetWorkOrder(updatedValues)
            return updatedValues
        })
    }

    const handleGotoWO = () => {
        navigate("/work-order")
    }
    console.log('needToFilter:', needToFilter)

    const handleGetWorkOrderBasedOnFilter = (filteredData) => {
        setNeedToFilter({ ...needToFilter, use: true })
        for (let key in filteredData) {
            if (filteredData[key] == "" || (filteredData?.status == "All")) delete filteredData[key]
        }
        setNeedToFilter(filteredData)
        console.log('filteredData:', filteredData)
        handleGetWorkOrder({ dispatch, workOrderStateManagementActions, setTotalWorkOrder, currentPage, payload: filteredData });
    }

    useEffect(() => {
        // let currentURL = window.location.href
        // let URL = handleSegregateURL({ url: currentURL })
        // console.log('URL:', URL)
        // decryptData()

        updateLayout({ dispatch })

        if (needToFilter.use == false) {
            // Fetch work order data based on the current page
            handleGetWorkOrder({ dispatch, workOrderStateManagementActions, setTotalWorkOrder, currentPage });
        }
        // Check if the workOrderPriorityDropdownToolkitState is empty, and if it is, fetch priority dropdown data
        if (!workOrderPriorityDropdownToolkitState.length) {
            handleGetPriorityDropdown(setPriorityDropdownData, dispatch, workOrderStateManagementActions);
        }

        // Check if the priorityDropdownData is not empty, and if it isn't, update the data format for the dropdown
        if (priorityDropdownData.length > 0) {
            // Map the priorityDropdownData to the format expected by the dropdown
            console.log('priorityDropdownData:', priorityDropdownData)
            let updatedData = workOrderPriorityDropdownToolkitState?.map((item) => {
                console.log('item:', item);
                return { label: item.wo_priority_status, value: JSON.stringify({ value: item.wo_priority_statusId, label: item.wo_priority_status }) };
            });
            // Set the updated priorityDropdownData to the state
            console.log('updatedData:', updatedData)
            setPriorityDropdownData(updatedData);
        }
    }, [currentPage, priorityDropdownData.length]);

    const handleGetDataBasedOnPagination = () => {
        console.log('currentPage:', currentPage)
        handleGetWorkOrder({ dispatch, workOrderStateManagementActions, setTotalWorkOrder, currentPage });
    }


    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const debouncedHandleGetWorkOrder = debounce(handleGetWorkOrderBasedOnFilter, 300);

    useEffect(() => {
        // Cleanup the debounced function on unmount to prevent memory leaks
        return () => {
            clearTimeout(debouncedHandleGetWorkOrder);
        };
    }, []);

    console.log('priorityDropdownData:', priorityDropdownData)


    return (
        <div className={Styles.work_order_list_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
            <nav className={Styles.wol_nav} /** wol = work_order_list */ >
                <span>Work Order List</span>
                <div>
                    {
                        handleLoggedInUser()?.permissions?.includes("wko001") && <button onClick={handleGotoWO}>Create Work Order</button>
                    }
                </div>
            </nav>
            <section className={Styles.wol_content_container}>
                <div>
                    <CommonNavigator values={filterNav} getSelectedValue={getSelectedValue} />
                    <section className={Styles.wol_body}>
                        <nav className={Styles.wol_filters}>
                            <NeedToFilterComp handleGetValueForDebounce={debouncedHandleGetWorkOrder} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} placeholder="Asset Search" name="asset" url={searchIcon} />
                            <NeedToFilterComp handleGetValueForDebounce={debouncedHandleGetWorkOrder} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} placeholder="Work Order Title" name="title" url={searchIcon} />
                            <div>
                                {/* <img src={filterIcon} alt='filter' /> */}
                                <SelectPicker placeholder="Priority" onChange={(e) => handleGetValue(e)} data={priorityDropdownData} className={`custom-select-picker ${Styles.wol_filters_select_picker}`} />
                                <img src={selectDownArrowIcon} alt='down' />
                            </div>
                            <NeedToFilterComp handleGetValueForDebounce={debouncedHandleGetWorkOrder} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} placeholder="User Name" name="user" url={searchIcon} />
                            <DateComp handleGetValueForDebounce={debouncedHandleGetWorkOrder} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} label={"Due Date"} name="dueDate" url={searchIcon} />
                            <DateComp handleGetValueForDebounce={debouncedHandleGetWorkOrder} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} label={"Created On"} name="createdOn" url={searchIcon} />
                        </nav>
                        <WorkOrderListTable tableData={workOrderToolkitState} workOrderStateManagementActions={workOrderStateManagementActions} setTotalWorkOrder={setTotalWorkOrder} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </section>
                    <footer className={Styles.wol_footer}>
                        {
                            totalWorkOrder > 6 && <Pagination length={Math.ceil(totalWorkOrder / 6)} activePage={currentPage} updateMethod={setCurrentPage} totalPage={Math.ceil(totalWorkOrder / 6)} handleGetDataBasedOnPagination={handleGetDataBasedOnPagination} />
                        }
                    </footer>
                </div>
            </section>
        </div>
    )
}

export default UnityWorkOrderList