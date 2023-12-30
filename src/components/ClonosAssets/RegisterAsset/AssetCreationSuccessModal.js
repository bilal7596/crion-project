import Modal from "../../CommonComponents/Modal/Modal"
import Styles from "../../../ModuleStyles/Assets/assetCreationSuccessModal.module.css"
import { ClonosButton } from "../../CommonComponents/Button/Button"
import { useNavigate } from "react-router"
import SUCCESSGIF from "../../../assets/GIFs/creationSuccessfull.gif"
export const AssetCreationSuccessModal = ({open,closeModalMethod,label,number,name,libraryURL,viewItemURL,state}) => {
    const Navigate = useNavigate()
    const handelViewLibrary = () => {
        Navigate(`/${libraryURL}`)
    }
    const handelViewItem = () => {
        Navigate(`/${viewItemURL}`,{state:state})
    }
    return <Modal stopOverlayCloser={true} isOpen={open} closeModalMethod={closeModalMethod}>
            <div className={Styles.container}>
                <div className={Styles.header}>
                    <div className={Styles.headerContent}>
                        <h5>{name}</h5>
                        <p>{number}</p>
                    </div>
                </div>
                <div className={Styles.confirmationContainer}>
                <div className={Styles.successGiftContainer}>
                    <img src={SUCCESSGIF} alt="creation-successful-gif"/>
                </div>
                <div className={Styles.textContentBox}>
                    <p>{state?.message}</p>
                    <div className={Styles.btnController}>
                        <ClonosButton style={{color:'#06337E'}} isHollow={true} onClick={handelViewLibrary}>View All Assets</ClonosButton>
                        <ClonosButton style={{color:"#FFF"}} onClick={handelViewItem}>{`View ${label}`}</ClonosButton>
                    </div>
                </div>

                </div>
            </div>
    </Modal>
}