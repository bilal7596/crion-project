// import { notificationActions } from "../../Store/Reducers/ClonosNotificationsReducer"
import { handleLoggedInUser, handleLoginExpiry } from "../clonosCommon";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { createDropdownsAPI, getDropdownsAPI } from "../../Api/Customize/CustomizeApi";


/**
 * This function is getting use for create the dropdown
 * @param {inputSubtastLength} param1 This variable contain the all the options of the dropdown.
 * @param {dropdownName} param2 This varialble contain the name of the dropdown.
 */
export const handleCreateDropdowns = async ({ dispatch, inputSubtastLength, dropdownName }) => {
    let payload = {
        name: dropdownName,
        values: inputSubtastLength
    }
    try {
        let response = await createDropdownsAPI({ payload });
        if (response?.status == 200) {
            dispatch(commonActions.showApiLoader(false));
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Dropdown has been created successfully.`,
                type: "success",
            }))
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
            dispatch(commonActions.showApiLoader(false));
        }
    }
    catch (err) {
        console.log('err:', err)
        if (err?.response?.data?.status === 401 && handleLoggedInUser() !== null) {
            handleLoginExpiry(err, dispatch)
            dispatch(commonActions.showApiLoader(false));
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
                // postAuditLog({ action: "dropdown Create", message: error });
            }
            dispatch(commonActions.showApiLoader(false));
        }
    }
}


// /**
//  * This function is getting use for create the dropdown
//  * @param {inputSubtastLength} param1 This variable contain the all the options of the dropdown.
//  * @param {dropdownName} param2 This varialble contain the name of the dropdown.
//  */
// export const handleGetDropdowns = async ({ dispatch, dropdownName = "all" }) => {
//     try {
//         let response = await getDropdownsAPI({ dropdownName });
//         if (response?.status == 200) {
//             dispatch(commonActions.showApiLoader(false));
//             dispatch(commonActions.handleSnackbar({
//                 show: true,
//                 message: `Dropdown has been created successfully.`,
//                 type: "success",
//             }))
//         } else {
//             dispatch(commonActions.handleSnackbar({
//                 show: true,
//                 message: `Something went wrong!`,
//                 type: "error",
//             }))
//             dispatch(commonActions.showApiLoader(false));
//         }
//     }
//     catch (err) {
//         console.log('err:', err)
//         if (err?.response?.data?.status === 401 && handleLoggedInUser() !== null) {
//             handleLoginExpiry(err, dispatch)
//             dispatch(commonActions.showApiLoader(false));
//         } else {
//             if (err.response) {
//                 dispatch(
//                     commonActions.handleSnackbar({
//                         show: true,
//                         message: `${err.response.data.message}`,
//                         type: "error",
//                     })
//                 );
//                 const error = err.response.data.error;
//                 // postAuditLog({ action: "dropdown Create", message: error });
//             }
//             dispatch(commonActions.showApiLoader(false));
//         }
//     }
// }