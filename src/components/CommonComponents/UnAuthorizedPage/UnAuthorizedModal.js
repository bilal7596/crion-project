import Styles from "./UnAuthorizedModal.module.css"
import CLONOSLOGO from "../../../assets/images/logo.png"
export const UnAuthorizedModal = () => {
    let lsUnity = localStorage.getItem("unity")
    return <div className={Styles.container}>
        <div className={Styles.subContainer}>
            <div className={Styles.imgContainer}>
                <img src={CLONOSLOGO} />
            </div>
            <div className={Styles.messageContainer}>
                {/* <h4>You are not Authorized to access this page.</h4> */}
                {/* <h4>Please contact your Admin.</h4> */}
                {
                    !lsUnity ? <p>404 - PAGE NOT FOUND</p>
                        : <p>You can't access this page!</p>
                }
            </div>
        </div>
    </div>
}