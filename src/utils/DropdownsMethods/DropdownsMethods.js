import { getStaticDropdownAPI } from "../../Api/Dropdowns/DropdownsApi";
import { postAuditLog } from "../../Api/User/UserApi";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { handleLoggedInUser, handleLoginExpiry } from "../clonosCommon";

/**
 * This function is going to use the get the static dropdown values and set them as loca values into the component.
 * @param {*} param0 It will object, that will contain three keys "staticDropdownName Exp 'AssetDepartment', dispatch, setterFunctionForValues: meaning 'This key will be a function which will help to set the local state which will contain the values of the dropdown' 
 */


export const handleGetStaticDropdownValues = async ({ staticDropdownNameOrId, dispatch, setterFunctionForValues }) => {
    try {
        let response = await getStaticDropdownAPI({ staticDropdownNameOrId });
        if (response?.status == 200) {
            dispatch(commonActions.showApiLoader(false));
            setterFunctionForValues(response?.data?.result?.values)
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
            dispatch(commonActions.showApiLoader(false));
        }
    } catch (err) {
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
                postAuditLog({ action: "Document Create", message: error });
            }
            dispatch(commonActions.showApiLoader(false));
        }
    }
}
