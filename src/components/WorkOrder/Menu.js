import React, { useState } from 'react'
import { Fade, Menu, MenuItem } from '@material-ui/core';
import { BsThreeDotsVertical } from "react-icons/bs"
import { handleLoggedInUser } from '../../utils/clonosCommon';

const MenuController = ({ titleName, isEdit, isDelete, isUpdate, isDownload, isResend, isEscalate, deleteMethod, editMethod, updateMethod, downloadMethod, resendMethod, escalateMethod, deletePermission, editPermission, updatePermission, downloadPermission, resendPermission, escalatePermission }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        console.log('eventt:', event)
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <BsThreeDotsVertical onClick={handleClick} />
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                style={{ zIndex: "1000" }}
            >
                {

                    isEdit && handleLoggedInUser()?.permissions?.includes(editPermission) && <MenuItem onClick={() => {
                        editMethod()
                        handleClose()
                    }}>Edit</MenuItem>
                }
                {
                    isDelete && handleLoggedInUser()?.permissions?.includes(deletePermission) && <MenuItem onClick={() => {
                        handleClose()
                        deleteMethod()
                    }}>Delete</MenuItem>
                }
                {
                    isUpdate && handleLoggedInUser()?.permissions?.includes(updatePermission) && <MenuItem onClick={() => {
                        handleClose()
                        updateMethod()
                    }}>Update</MenuItem>
                }
                {
                    isDownload && handleLoggedInUser()?.permissions?.includes(downloadPermission) && <MenuItem onClick={() => {
                        handleClose()
                        downloadMethod()
                    }}>Download</MenuItem>
                }
                {
                    isResend && handleLoggedInUser()?.permissions?.includes(resendMethod) && <MenuItem onClick={() => {
                        handleClose()
                        resendMethod()
                    }}>Resend</MenuItem>
                }
                {
                    isEscalate && handleLoggedInUser()?.permissions?.includes(escalatePermission) && <MenuItem onClick={() => {
                        handleClose()
                        escalateMethod()
                    }}>Escalate</MenuItem>
                }
            </Menu>
        </div>
    )
}

export default MenuController