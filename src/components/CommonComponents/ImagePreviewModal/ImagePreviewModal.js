import Modal from "../Modal/Modal"
import Styles from "./ImagePreviewModal.module.css"
import REDTRASH from "../../../assets/UIUX/icons/redTrash.svg"
import XCIRCLE from "../../../assets/UIUX/icons/x-circle-fill.svg"
import CIRCLELEFT from "../../../assets/UIUX/icons/circle-chevron-left.svg"
import CIRCLERIGHT from "../../../assets/UIUX/icons/circle-chevron-right.svg"
import { useState } from "react"

export const ImagePreviewModal = ({open,closeModalMethod,images}) => {
    const [activeImage,setActiveImage] = useState(0);
    const handleMoveLeft = () => {
        console.log(images?.length)
        if(activeImage > 0){
            setActiveImage((prev) => prev - 1)
        }
    }
    const handleMoveRight = () => {
        if(activeImage < images?.length -1){
            setActiveImage((prev) => prev + 1)
        }
    }
    return <Modal isOpen={open} closeModalMethod={closeModalMethod}>
        <div className={Styles.container}>
            <div className={Styles.header}>
                <h4 className={Styles.fileNameText}>{images?.length > 0 && images[activeImage]?.imageName || "Image"}</h4>
                <div className={Styles.headerRightContent}>
                    <div className={Styles.deleteContainer}>
                        <img src={REDTRASH}/>
                        <h4>Delete</h4>
                    </div>
                    <div className={Styles.closeIcon} onClick={(() => closeModalMethod(false))}>
                        <img src={XCIRCLE}/>
                    </div>
                </div>
            </div>
            <div className={Styles.slidderContainer}>
                <div onClick={handleMoveLeft} className={Styles.CIRCLELEFT}>
                    <img src={CIRCLELEFT}/>
                </div>
                <div className={Styles.imageContainer}>
                    <img src={images?.length > 0 && images[activeImage]?.imageUrl}/>
                </div>
                <div onClick={handleMoveRight} className={Styles.CIRCLERIGHT}>
                    <img src={CIRCLERIGHT}/>
                </div>
            </div>
        </div>
    </Modal>
}