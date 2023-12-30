import React from 'react'
import Styles from "../../ModuleStyles/WorkOrder/WorkOrderView.module.css"
// import WO_Plus_Icon from "../../assets/UIUX/icons/WO/WO_Plus.svg"


const PartsAndToolsCreateComp = ({ data }) => {
    return (
        <div key={data?.id} className={Styles.wov_bs_c3_repeatedItem}>
            <header><span>{data?.heading}</span></header>
            <div className={Styles.wov_bs_c3_repeatedItem_body}>
                <span>{data.title}</span>
                <div className={Styles.wov_bs_c3_repeatedItem_button}>
                    <img src={data?.icon} alt={data?.heading} />
                    <button>{data?.buttonText}</button>
                </div>
            </div>
        </div>
    )
}

export default PartsAndToolsCreateComp