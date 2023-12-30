import React, { useEffect } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs"
import Styles from "./Menubar.module.css"
import { useState } from 'react'
import { BsChevronDown, BsChevronUp } from "react-icons/bs"
const Menubar = ({ as, icon, label, style, iconStyle, isDropdown, getIsOpenMethod, children }) => {
    console.log('icon:', icon)
    let [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        getIsOpenMethod({ setIsOpen, isOpen })
    }, [])

    return (
        <div className={Styles.mb_container}>
            <div className={Styles.mb_visible_container} style={style} onClick={() => setIsOpen(!isOpen)}>
                {
                    as == "button" && <button onClick={() => setIsOpen(!isOpen)}>{label}</button>
                }
                {
                    as == "threeDots" && <BsThreeDotsVertical onClick={() => setIsOpen(!isOpen)} />
                }
                {
                    isDropdown && <>{
                        icon ? <img style={iconStyle} src={icon} />
                            :
                            isOpen ? <BsChevronUp /> : <BsChevronDown />
                    }
                    </>
                }
            </div>
            <div onClick={() => setIsOpen(!isOpen)} className={isOpen ? Styles.mb_overlay_active : Styles.mb_overlay_deActive}>
            </div>
            <div onClick={(e) => e.stopPropagation()} className={isOpen ? Styles.mb_children_active : Styles.md_children_deActive}>
                {children}
            </div>
        </div >
    )
}

export default Menubar

