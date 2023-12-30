import React, { useState } from 'react'
import Styles from "../../ModuleStyles/Customize/CustomizeCRUD.module.css"
import { AiFillCheckCircle } from "react-icons/ai"
import { MdCancel } from "react-icons/md"
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { HiLockOpen, HiLockClosed } from "react-icons/hi"
import DonwUpArrowIndicator from '../CommonComponents/DownUpArrowIndicator/DownUpArrowIndicator';

const OptionCRUD = ({ value, isEdit }) => {
    console.log('isEdit:', isEdit)
    return (
        <div style={{ display: "flex", alignItems: "center", "gap": "1rem", padding: ".5rem 0rem" }}>
            <div>
                {
                    !isEdit ? <span>{value?.optionName}</span> : <input defaultValue={value?.optionName} />
                }
            </div>
            <div>
                {isEdit && <MdCancel color='red' fontSize="25px" />}
            </div>
        </div>
    )
}

const CustomizeCRUD = ({ element }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [isDrawer, setIsDrawer] = useState(false)
    console.log('element:', element)
    console.log('isEdit:', isEdit)
    return (
        <div className={Styles.customize_CRUD_container}>
            <section className={Styles.c_CRUD_visibale}>
                <div className={Styles.c_CRUD_v_details}>
                    {
                        !isEdit ? <span onClick={() => setIsDrawer(!isDrawer)}>{element?.name}</span>
                            : <div className={Styles.c_CRUD_v_d_isEditActive}>
                                <input defaultValue={element?.name} />
                                <div>
                                    <AiFillCheckCircle color='green' /> <MdCancel color='red' onClick={() => setIsEdit(false)} />
                                </div>
                            </div>
                    }
                </div>
                <div className={Styles.c_CRUD_v_controller}>
                    <DonwUpArrowIndicator isOpen={isDrawer} onClick={() => setIsDrawer(!isDrawer)} />
                    {element?.isActive ? <HiLockOpen color="green" /> : <HiLockClosed color='red' />}
                    <EditIcon onClick={() => {
                        setIsEdit(true)
                        setIsDrawer(true)
                    }} style={{ color: 'blue' }} /> <DeleteIcon style={{ color: 'red' }} />
                </div>
            </section>
            <section style={{ transition: "all .3s ease-in-out", height: "0px", overflow: isDrawer ? "" : "hidden", gap: "1rem ", display: 'flex', flexDirection: "column" }} className={isDrawer && Styles.c_CRUD_drawer_active}>
                {
                    element?.values?.map((ele) => <OptionCRUD key={ele?.optionId} value={ele} isEdit={isEdit} />)
                }
            </section>
        </div>
    )
}

export default CustomizeCRUD


