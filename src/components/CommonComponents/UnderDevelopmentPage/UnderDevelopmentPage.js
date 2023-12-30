import Styles from "../UnAuthorizedPage/UnAuthorizedModal.module.css"
import CLONOSLOGO from "../../../assets/images/logo.png"
export const UnderDevelopmentPage = () => {
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
                    !lsUnity ? <p>This page is under development.</p>
                        : <p>You can't access this page!</p>
                }
            </div>
        </div>
    </div>
}