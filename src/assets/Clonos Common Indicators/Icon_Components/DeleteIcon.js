import React from 'react'
import useToggler from '../../../CustomHooks/TogglerHook'
import { Tooltip } from '@material-ui/core'

const DeleteIcon = ({ tooltipTitle, onClick }) => {
    let [isHover, setIsHover] = useToggler()
    return (
        <Tooltip title={tooltipTitle}>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() => onClick()}
                style={{ padding: "0px", margin: "0px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "fit-content", height: "fit-content" }}
            >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="trash">
                        <path id="Vector" d="M5.33301 9.33333H26.6663M13.333 14.6667V22.6667M18.6663 14.6667V22.6667M6.66634 9.33333L7.99967 25.3333C7.99967 26.0406 8.28063 26.7189 8.78072 27.219C9.28082 27.719 9.9591 28 10.6663 28H21.333C22.0403 28 22.7185 27.719 23.2186 27.219C23.7187 26.7189 23.9997 26.0406 23.9997 25.3333L25.333 9.33333M11.9997 9.33333V5.33333C11.9997 4.97971 12.1402 4.64057 12.3902 4.39052C12.6402 4.14048 12.9794 4 13.333 4H18.6663C19.02 4 19.3591 4.14048 19.6091 4.39052C19.8592 4.64057 19.9997 4.97971 19.9997 5.33333V9.33333" stroke={isHover ? "#0A5FFF" : "#1C1C1C"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                </svg>
            </div>
        </Tooltip>
    )
}

export default DeleteIcon