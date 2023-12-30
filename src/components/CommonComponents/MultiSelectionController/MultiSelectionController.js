import React from 'react'
import { handleLoggedInUser } from '../../../utils/clonosCommon'
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CreateIcon from '@material-ui/icons/Create';
import Styles from "./MultiSelectionController.module.css"


const MultiSelectionController = ({ isActiveComponent, isEdit, isDelete, isCreate, isEditMethod, isDeleteMethod, isCreateMethod, selectedRowCount, editPermission, deletePermission, createPermission }) => {
    return (
        isActiveComponent && <div className={Styles.multi_selection_controller_container}>
            <h4>Selected Rows {selectedRowCount}</h4>
            <div>
                {isCreate && handleLoggedInUser().permissions.includes(createPermission) &&
                    <CreateIcon onClick={() => isCreateMethod()} fontSize="medium" />
                }
                {isEdit && handleLoggedInUser().permissions.includes(editPermission) &&
                    <EditIcon onClick={() => isEditMethod()} fontSize="medium" />
                }
                {
                    isDelete && handleLoggedInUser().permissions.includes(deletePermission) &&
                    <DeleteIcon onClick={isDeleteMethod} fontSize="medium" />
                }
            </div >
        </div >
    )
}

export default MultiSelectionController