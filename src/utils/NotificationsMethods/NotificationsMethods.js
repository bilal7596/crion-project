import { notificationActions } from "../../Store/Reducers/ClonosNotificationsReducer"
import { handleLoggedInUser, handleLoginExpiry } from "../clonosCommon";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { getAlarmsDropdown, getAlertTypesDropdown, getCommunicationChannels, getMAMSDropdown, getUrgencyLevelDropdown } from "../../Api/Notification/Notification";
import { getAllUsersDropdownAPI } from "../../Api/User/UserApi";

export const handleGetNotifications = async ({ payload, dispatch, notificationActions, currentPage, setCurrentPage, setTotalNotifications }) => {
    try { }
    catch (err) {
        if (err?.response?.data?.status === 401 && handleLoggedInUser() !== null) {
            handleLoginExpiry(err, dispatch)
        } else {
            if (err.response) {
                dispatch(
                    commonActions.handleSnackbar({
                        show: true,
                        message: `${err.response.data.message}`,
                        type: "error",
                    })
                );
                const error = err.response.data.error;
            }
        }
        dispatch(commonActions.showApiLoader(false));
    }
}

export const handleCreateNotification = () => {
    
}
export const getUsersDropdownValues = async (setUsers,dispatch) => {
    try {
        const res = await getAllUsersDropdownAPI()
        setUsers(res?.data?.result)
    } catch (error) {
        handleLoginExpiry(error,dispatch)
    }
}

export const getAlarmsDropdownValues = async (setAlarms,dispatch) => {
    try {
        const res = await getAlarmsDropdown();
        setAlarms(res?.data?.result)
        console.log(res,"alarmres")
    } catch (error) {
        handleLoginExpiry(error,dispatch)
    }
}

export const getCommunicationChannelsDropdownValues = async (setCommunicationChannels,dispatch) => {
    try {
        const res = await getCommunicationChannels();
        setCommunicationChannels(res?.data?.result)
        console.log(res,"alarmres")
    } catch (error) {
        handleLoginExpiry(error,dispatch)
    }
}

export const getUrgencyLevelDropdownValues = async (setUrgencyLevel,dispatch) => {
    try {
        const res = await getUrgencyLevelDropdown();
        setUrgencyLevel(res?.data?.result)
        console.log(res,"alarmres")
    } catch (error) {
        handleLoginExpiry(error,dispatch)
    }
}

export const getAlertTypesDropdownValues = async (setAlertTypes,dispatch) => {
    try {
        const res = await getAlertTypesDropdown();
        setAlertTypes(res?.data?.result)
        console.log(res,"alarmres")
    } catch (error) {
        handleLoginExpiry(error,dispatch)
    }
}

export const getMAMSDropdownValues = async (setMamsDropdownValues,dispatch) => {
    try {
        const res = await getMAMSDropdown();
        setMamsDropdownValues(res?.data?.result)
    } catch (error) {
        handleLoginExpiry(error,dispatch)
    }
}