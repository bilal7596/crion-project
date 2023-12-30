import React from 'react'
import Styles from "../../ModuleStyles/WorkOrder/WorkOrder.module.css"
import { handleChange } from '../../utils/WorkOrderMethods/WorkOrderMethods'
import WO_Task_Delete_Icon from "../../assets/UIUX/icons/Common_Component/File_Uploader/file_uploader_delete.svg"

const WorkOrderTask = ({ index, element, handleChange, handleDeleteExistingTask }) => {
    console.log('elementTask:', element)
    return (
        <div
            className={Styles.work_order_tasks}
            key={index}
            display="flex"
            justifyContent="space-between"
            margin="10px"
        >
            <div className={Styles.work_order_tasks_input}>
                <p>Task {index + 1} -</p>
                <input

                    id="subtasks"
                    value={element.woTaskName}
                    w="80%"
                    // onChange={(e) => handleChange(e, i, inputSubtastLength, setInputSubtastLength)}
                    onChange={(e) => handleChange(e)}
                    required
                    placeholder="Enter Your Task..."
                // onKeyDown={(e) => {
                //     console.log("keyCode", e.keyCode)
                //     if (e.keyCode === 13) {
                //         setInputSubtastLength([...inputSubtastLength, []])
                //         let interval = setTimeout(() => {
                //             handleMakeFocusOnTastInputTag({ elementIdName: "subtasks" })
                //         }, 100)
                //         setLcIntevals({ ...lcIntervals, ["subtasksInterval"]: interval })
                //     }
                // }}
                />
            </div>
            <img src={WO_Task_Delete_Icon} alt='Delete WO' onClick={() => handleDeleteExistingTask()} />
        </div>
    )
}

export default WorkOrderTask