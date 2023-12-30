import { loginUser, postAuditLog } from "../../Api/User/UserApi";
import { userActions } from "../../Store/Reducers/ClonosUserReducer";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { dummyEncryptionToken, handleEncryptionURLKeys, handleLoggedInUser, handleRedirectAfterEvent, handleShowErrorAndWarning, setUserSession } from "../clonosCommon";

export const handleStartCarousel = ({ interval, setLcIntervals, carouselData, setCarouselCurrentIndex }) => {
    const lcInterval = setInterval(() => {
        setCarouselCurrentIndex(prev => {
            if (prev == carouselData.length) return 1
            return prev + 1
        })
    }, interval);
    console.log('lcInterval:', lcInterval)
    setLcIntervals(prev => {
        return { ...prev, ["carouselImageIndicatorInterval"]: lcInterval }
    })
}


export const handleLogin = async ({ payload, navigate, dispatch, responseSetterMethod }) => {
    console.log('payload:', payload)
    responseSetterMethod(prev => {
        return { ...prev, ["loading"]: true }
    })
    if (payload?.email?.length == 0) {
        handleShowErrorAndWarning({ dispatch, type: "error", message: "Please enter your email!", showTime: 5000 })
        responseSetterMethod(prev => {
            return { ...prev, ["loading"]: false }
        })
        return
    }
    if (payload?.password?.length == 0) {
        handleShowErrorAndWarning({ dispatch, type: "error", message: "Please enter your password!", showTime: 5000 })
        responseSetterMethod(prev => {
            return { ...prev, ["loading"]: false }
        })
        return
    }
    const lcPayload = {
        "email": payload?.email,
        "password": handleEncryptionURLKeys({ needToEncrypt: payload?.password })
    }
    console.log('lcPayload:', lcPayload)
    try {
        const response = await loginUser(lcPayload)
        if (response.status == 200 || response.status == 201) {
            setUserSession(
                response.data.token,
                response.data.refreshToken,
                response.data.userDetails,
                response.data.email,
                response?.data?.userDetails
            );
            dispatch(userActions.getUserData(response?.data?.userDetails));
            localStorage.setItem("loginUser", JSON.stringify(response?.data?.userDetails))


            // Temp code
            let lcToken = dummyEncryptionToken({ token: response?.data?.token })
            let lcRefreshToken = dummyEncryptionToken({ token: response?.data?.refreshToken })
            localStorage.setItem("lcCred", `work-order-list?unity=1&token=${lcToken}&refreshToken=${lcRefreshToken}`)

            handleShowErrorAndWarning({ dispatch, type: "success", message: `Welcome ${handleLoggedInUser()?.name.split(" ")[0]}, Login Successful.`, showTime: 5000 })
            handleRedirectAfterEvent({ targetRoute: "/landing-page", timeout: 500, navigate })
        }
        else {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went Wrong`, showTime: 5000 })

        }
    }
    catch (err) {
        console.log('err:', err)
        console.log("loginDetails API ERROR", err);
        if (err.response) {
            console.log(err.response.data);
            const error = err.response.data.error;
            if (error === "No account exist for this email") {
                handleShowErrorAndWarning({ dispatch, type: "error", message: error, showTime: 5000 })
                postAuditLog({ action: "Login", message: error });
            } else if (
                error ===
                "Wrong password. Try again or click Forgot password to reset it."
            ) {
                handleShowErrorAndWarning({ dispatch, type: "error", message: error, showTime: 5000 })
                postAuditLog({ action: "Login", message: error });
            } else if (error === "Invalid Email Format.") {
                handleShowErrorAndWarning({ dispatch, type: "error", message: error, showTime: 5000 })
                postAuditLog({ action: "Login", message: error });
            }
        }
    }
    finally {
        responseSetterMethod(prev => {
            return { ...prev, ["loading"]: false }
        })
    }
}