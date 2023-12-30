import React from 'react'
import Styles from "../../ModuleStyles/WorkOrder/WorkOrderView.module.css"
import WO_Plus_Icon from "../../assets/UIUX/icons/WO/WO_Plus.svg"


const PartsAndToolsComp = ({ data, title }) => {
    const partsData = [
        {
            id: Math.random(),
            siNo: 1,
            partNumber: 123,
            partName: "Part Name One",
            quantity: 12,
        },
        {
            id: Math.random(),
            siNo: 2,
            partNumber: 123,
            partName: "Part Name Two",
            quantity: 12,
        },
        {
            id: Math.random(),
            siNo: 3,
            partNumber: 123,
            partName: "Part Name Three",
            quantity: 12,
        },
    ]


    return (
        <div className={Styles.wov_bs_c3_repeatedItem_view}>
            <header>
                <span>{title}</span>
                <div className={Styles.wov_bs_c3_repeatedItem_view_button}>
                    <img src={WO_Plus_Icon} alt={title} />
                    <button>Add Parts</button>
                </div>
            </header>
            <div className={Styles.wov_bs_c3_repeatedItem_view_body}>
                <table>
                    <thead>
                        <tr>
                            <td>SI.NO</td>
                            <td>PART NUMBER</td>
                            <td>PART NAME</td>
                            <td>QUANTITY</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            partsData?.map((ele) => {
                                return <tr>
                                    <td>{ele.siNo}</td>
                                    <td>{ele.partNumber}</td>
                                    <td>{ele.partName}</td>
                                    <td>{ele.quantity}</td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PartsAndToolsComp