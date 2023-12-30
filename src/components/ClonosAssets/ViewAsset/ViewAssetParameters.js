import { memo } from "react"
import Styles from "../../../ModuleStyles/Assets/viewAssetParameters.module.css"
import { DataGrid } from "@mui/x-data-grid";
import VIEW_ASSET_PARAMETER_GRAY_CHECKBOX from "../../../assets/UIUX/icons/gray-fill-check.svg";
import VIEW_ASSET_PARAMETER_BLUE_CHECKBOX from "../../../assets/UIUX/icons/blue-fill-check.svg"
import VIEW_ASSET_PARAMETER_OUTLINED_CHECKBOX from "../../../assets/UIUX/icons/outlined-square.svg"
import VIEW_ASSET_PARAMETER_ALERT_CIRCLE from "../../../assets/UIUX/icons/alert-circle.svg"

import ClonosDataGrid from "../../CommonComponents/ClonosDataGrid/ClonosDataGrid"
import Modal from "../../CommonComponents/Modal/Modal";
import CloseIcon from "../../../assets/Clonos Common Indicators/Icon_Components/CloseIcon";
import { useState } from "react";
import { ClonosButton } from "../../CommonComponents/Button/Button";
import { useEffect } from "react";
const ViewAssetParameters = ({data}) => {
    const [showModal,setShowModal] = useState(false);
    const [parameters,setParameters] = useState([])
    const columns = [
        {

            field:"index",
            headerName:"SI.NO",
            width:"100"
        },
        {

            field:"name",
            headerName:"PARAMETERS",
            flex:1
        },
        {

            field:"description",
            headerName:"VALUE",
            flex:1
        },
        {

            field:"unit",
            headerName:"UNIT",
            flex:1
        },
        {
            field:"tracker",
            headerName:"ENABLE TRACKING",
            flex:1,
            renderCell:(params) => {
                console.log(params,"params")
                return <div className={Styles.status_tracker}>
                    {
                        params?.row?.trackingStatus === "Enabled" ?  <div onClick={() => setShowModal(true)}><img src={VIEW_ASSET_PARAMETER_BLUE_CHECKBOX}/></div> : params?.row?.trackingStatus === "Requested" ? <div  onClick={() => setShowModal(true)}><img src={VIEW_ASSET_PARAMETER_GRAY_CHECKBOX}/></div> : <div  onClick={() => setShowModal(true)}><img src={VIEW_ASSET_PARAMETER_OUTLINED_CHECKBOX}/></div>
                    }
                </div>
            }
        },
        {

            field:"trackingStatus",
            headerName:"TRACKING STATUS",
            flex:1,
            renderCell:() => {
                return <p>Requested</p>
            }
        },
        {

            field:"compare",
            headerName:"COMPARE",
            flex:1,
            renderCell:(params) => {
                return <p>Compare</p>
            }
        }
    ]

    const handleLiveTracking = () => {

    }

    useEffect(() => {
        setParameters(data?.assetParameters)
    },[])

    return (
        <>
    <div className={Styles.v_a_parameters_container}>
        <div className={Styles.v_a_parameters_sub_container}>
            <ClonosDataGrid  checkboxSelection={false} rows={parameters?.map((param,index) =>({...param,index:index+1}) )} columns={columns} uniqueIdField={"id"}  pageLimit={10} height={600}/>
        </div>
    </div>
    <Modal isOpen={showModal} closeModalMethod={setShowModal}>
        <div className={Styles.modal_sub_container}>
            <div className={Styles.modal_header}>
                <div className={Styles.modal_header_content}>
                    <div className={Styles.modal_header_content_left}>
                        <div><img src={VIEW_ASSET_PARAMETER_ALERT_CIRCLE}/></div>
                        <h4>Enable Tracking</h4>
                    </div>
                    <div className={Styles.modal_header_content_right}>
                        <CloseIcon onClick={() => setShowModal(false)}/>
                    </div>
                </div>
            </div>
            <div className={Styles.modal_content}>
                <div>Do you confirm that you need live tracking for this asset ?</div>
                <div className={Styles.btn_controller}>
                    <ClonosButton onClick={() => setShowModal(false)} isHollow={true} style={{color:"#E0606A",border:"1px solid #E0606A"}} p={"1rem 3rem"} >Cancel</ClonosButton>
                    <ClonosButton onClick={() => handleLiveTracking()} p={"1rem 3rem"}>Yes</ClonosButton>
                </div>
            </div>
        </div>
    </Modal>
    </>
    )
}

export default memo(ViewAssetParameters)
// handleGetSelectedRowsMethod, pageLimit, isEdit, isDelete, editPermission, deletePermission, createPermission, isEditMethod, isDeleteMethod, isCreateMethod, height, uniqueIdField