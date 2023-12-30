import React, { useEffect, useState } from 'react'
import COMMON_WARNING_ICON from "../../../assets/UIUX/icons/Common_Icon/COMMON_WARNING_ICON.svg"
import Modal from '../Modal/Modal'
import { ClonosButton } from '../Button/Button';
import Styles from "./ClonosConfirmationBox.module.css"
import CloseIcon from '../../../assets/Clonos Common Indicators/Icon_Components/CloseIcon';


const ClonosConfirmationBox = ({ isOpen, closeModalMethod, confirmingMethod, rejectingMethod, type, message, headerTitle }) => {


    useEffect(() => {

    }, [isOpen])

    return (
        <Modal isOpen={isOpen} closeModalMethod={closeModalMethod} >
            <div className={Styles.main_container}>
                <header>
                    <span></span>
                    <div className={Styles.header_title}><img src={COMMON_WARNING_ICON} /><span>{headerTitle}</span></div>
                    <CloseIcon onClick={closeModalMethod} />
                </header>
                <section className={Styles.body}>
                    <p>{message}</p>
                </section>
                <footer>
                    <ClonosButton isHollow={true} style={{ color: "red", border: "1px solid red" }} onClick={() => {
                        closeModalMethod(false)
                        rejectingMethod()
                    }}>Cancel</ClonosButton>
                    <ClonosButton onClick={confirmingMethod}>Yes</ClonosButton>
                </footer>
            </div>
        </Modal>
    )
}

export default ClonosConfirmationBox