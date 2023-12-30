import React, { useEffect } from 'react'
import Styles from "../../ModuleStyles/WorkOrder/WorkOrderList.module.css"
import { useState } from 'react'
import "../../overrideStyle.css"

import WorkOrderListTable from './WorkOrderListTable'
import { handleGetWorkOrder, handleWorkOrderFilter } from '../../utils/WorkOrderMethods/WorkOrderMethods'
import { useDispatch, useSelector } from 'react-redux'
import { workOrderStateManagementActions } from "../../Store/Reducers/ClonosWorkOrderReducer"
import { handleAllowDirectAccessPage, handleLoggedInUser, handleSegregateURL, loginJumpLoadingStopper, updateLayout } from '../../utils/clonosCommon'
import { useNavigate } from 'react-router-dom'
import useToggler from '../../CustomHooks/TogglerHook'
import { Container } from '@material-ui/core'
import { UnAuthorizedModal } from '../CommonComponents/UnAuthorizedPage/UnAuthorizedModal'
import { workOrderFilterAPI } from '../../Api/WorkOrder/WorkOrderApi'



const WorkOrderList = () => {
    // Global States 
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
    const { tokenToolkitState } = useSelector(store => store.userData)
    console.log('tokenToolkitState:', tokenToolkitState)

    console.log('mainLayoutChildrenPositionsToolkitState:', mainLayoutChildrenPositionsToolkitState)

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
    const { workOrderToolkitState } = useSelector((store) => store.workOrderStateManagement)
    console.log('workOrderToolkitState:', workOrderToolkitState)
    const dispatch = useDispatch()
    const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")
    const [totalWorkOrder, setTotalWorkOrder] = useState(1)

    const handleGotoWO = () => {
        navigate("/work-order")
    }

    useEffect(() => {
        // Cleanup the debounced function on unmount to prevent memory leaks
        let interval = loginJumpLoadingStopper({ setterFunction: setIsLocalLoading, timeout: 5000 })
        return () => {
            clearInterval(interval)
        };
    }, []);


    useEffect(() => {
        const URL = handleSegregateURL();
        if (URL?.unity) {
            (async () => {
                try {
                    //Allow direct access and fetch the work order based on ID
                    const assetId = await handleAllowDirectAccessPage({ keyName: "assetId" });
                    console.log('assetId:', assetId)
                    handleWorkOrderFilter({ dispatch, payload: { assetId } })
                } catch (err) {
                    console.log('err:', err);
                }
            })();
        } else handleGetWorkOrder({ dispatch });
    }, []);


    if (handleLoggedInUser()?.permissions?.includes('wko005')) {
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
                        <section className={Styles.wol_body}>
                            <WorkOrderListTable tableData={workOrderToolkitState} workOrderStateManagementActions={workOrderStateManagementActions} setTotalWorkOrder={setTotalWorkOrder} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </section>
                    </div>
                </section>
            </div>
        )
    }
    return !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
        <Container component="main" maxWidth="sm">
            <UnAuthorizedModal />
        </Container>
}

export default WorkOrderList