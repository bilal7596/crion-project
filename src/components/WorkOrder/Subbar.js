import React, { useEffect } from 'react'
import Styles from "../../ModuleStyles/WorkOrder/Subbar.module.css"
import { generateUniqueId, handleLoggedInUser, handleMakeCamelCase } from '../../utils/clonosCommon'
import DownloadIcon from '../../assets/Clonos Common Indicators/Icon_Components/DownloadIcon'
import DeleteIcon from '../../assets/Clonos Common Indicators/Icon_Components/DeleteIcon'
import EditIcon from '../../assets/Clonos Common Indicators/Icon_Components/EditIcon'
import CopyIcon from '../../assets/Clonos Common Indicators/Icon_Components/CopyIcon'



const Subbar = (
    { isCopy,
        isDelete,
        isDeleteMethod,
        isDownload,
        isDownloadMethod,
        isEdit,
        isEditMethod,
        isCreatedOn,
        isExpiredOn,
        isStatus,
        isPriority,
        subbarData,
        staticElements,
        buttons,
        htmlElements
    }
) => {
    let statusStyle = {
        scheduled: { color: "#06337E", backgroundColor: "#E6EBF2" },
        draft: { color: "#E5B82F", backgroundColor: "#FCF8EA" },
        accepted: { color: "#0A5FFF", backgroundColor: "#E7EFFF" },
        completed: { color: "#60D468", backgroundColor: "#EBFAEC" },
        onHold: { color: "#D24B5A", backgroundColor: "#FBEDEF" },
        expired: { color: "#D24B5A", backgroundColor: "#FBEDEF" },
        continue: { color: " #40E0D0", backgroundColor: "#FBEDEF" },
        pendingApproval: { color: "#E5B82F", backgroundColor: "#FCF8EA" }
    }
    let buttonVariant = {
        hollow: { border: "1px solid #000", color: "black", background: "white" },
        solid: { backgroundColor: "#06337E", color: "white" }
    }

    const status = {
        draft: "Draft",
        scheduled: "Scheduled",
        inProgress: "In Progress",
        completed: "Completed",
        accepted: "Accepted",
        onHold: "On Hold",
        continue: "Continue",
        expired: "Expired",
        pendingApproval: "Pending Approval",
        pending: "Pending"
    }

    useEffect(() => {
        let temp = handleMakeCamelCase({ string: subbarData?.status })
        console.log('temp:', temp)
        console.log("styleData", statusStyle[handleMakeCamelCase({ string: subbarData?.status })])
    }, [])
    console.log('subbarData:', subbarData)

    return (
        <div className={Styles.subbar_container}>
            <section >
                {
                    isStatus && <div className={Styles.subbar_status}>
                        <span>Status:</span>
                        <span style={statusStyle[handleMakeCamelCase({ string: subbarData?.status || subbarData?.assetStatus })] || statusStyle[subbarData?.status]}>{subbarData?.status || subbarData?.assetStatus ? status[subbarData?.status] ? status[subbarData?.status] : subbarData?.status || subbarData?.assetStatus : "Not Mentioned"}</span>
                    </div>
                }
                {
                    isCreatedOn && <div className={Styles.subbar_createdOn}>
                        <span>Created On:</span>
                        <span>{subbarData?.createdDate?.split("T")[0]?.split("-")?.reverse()?.join("/")}</span>
                    </div>
                }
                {
                    isExpiredOn && subbarData?.endDate && <div className={Styles.subbar_expiredOn}>
                        <span>Expired On:</span>
                        <span>{subbarData?.endDate}</span>
                    </div>
                }
                {
                    isPriority && <div className={Styles.subbar_priority}>
                        <span>Priority:</span>
                        <span style={{ backgroundColor: subbarData?.priority?.priorityName === "High-P1" ? "#D24B5A" : subbarData?.priority?.priorityName === "Medium-P2" ? "#E5B82F" : subbarData?.priority?.priorityName === "Low-P3" ? "#60D468" : "gray" }} >{subbarData?.priority?.priorityName ? subbarData?.priority?.priorityName : "Not Mentioned"}</span>
                    </div>
                }
                {
                    subbarData?.isDecommissionedDate && <div className={Styles.subbar_decommissionedDate}>
                        <span>Decommissioned Date:</span>
                        <span>{subbarData?.decommissionedDate}</span>
                    </div>
                }
                {
                    staticElements?.length > 0 && staticElements.map((ele, index) => {
                        return <div key={index} className={Styles.subbar_decommissionedDate}>
                            <span style={ele.keyStyle}>{ele.key}</span>
                            <span style={ele.valueStyle}>{ele.value}</span>
                        </div>
                    })
                }

            </section>
            <section className={Styles.subbar_controllers}>
                {
                    htmlElements?.map((element) => {
                        return element
                    })
                }
                {
                    isEdit && <EditIcon onClick={() => isEditMethod()} tooltipTitle={"Edit"} />
                }
                {
                    isDelete && <DeleteIcon onClick={() => isDeleteMethod()} tooltipTitle={"Delete"} />
                }
                {
                    isDownload && <DownloadIcon onClick={() => isDownloadMethod()} tooltipTitle={"Download"} />
                }
                {
                    isCopy && <CopyIcon tooltipTitle={"Copy"} />
                }
                {
                    buttons?.length > 0 && <div>
                        {
                            buttons?.length > 0 && buttons.map((item, index) => {
                                if (item.type == "select") {
                                    return item.isActive ? <select className={Styles.subbar_select} onChange={item.buttonMethod} placeholder={item.buttonText} disabled={item.isDisabled}>
                                        <option style={{ visibility: "hidden" }}>{item.buttonText}</option>
                                        {
                                            item.options.map((option) => option.isNeeded && <option option key={generateUniqueId(5)} value={option.value} disabled={option.isDisabled}> {option.label}</option>)
                                        }
                                        <option style={{ visibility: "hidden" }}>{item.buttonText}</option>
                                    </select> : <></>
                                } else {
                                    return item.isActive ? <button key={index + 10} onClick={() => item.buttonMethod()} style={item.isHollow ? buttonVariant.hollow : buttonVariant.solid}>{item.buttonText}</button> : <></>
                                }
                            })
                        }
                    </div>
                }

            </section >
        </div >
    )
}

export default Subbar
