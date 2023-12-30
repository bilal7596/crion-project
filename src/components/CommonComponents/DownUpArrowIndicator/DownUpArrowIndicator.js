import { BsChevronDown, BsChevronUp } from "react-icons/bs"
import Styles from "./DownUpArrayIndicator.module.css"


const DonwUpArrowIndicator = ({ isOpen, onClick }) => {
    return (
        <>
            <BsChevronDown onClick={()=>onClick()} style={{ transition: "all .3s ease-in-out", fontSize: '25px', fontWeight: "600" }} className={isOpen ? Styles.DUAI_icon_active : Styles.DUAI_icon_deActive} />
        </>
    )
}

export default DonwUpArrowIndicator