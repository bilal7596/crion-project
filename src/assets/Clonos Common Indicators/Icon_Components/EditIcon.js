import React from 'react'
import useToggler from '../../../CustomHooks/TogglerHook'
import { Tooltip } from '@material-ui/core'

const EditIcon = ({ tooltipTitle, onClick }) => {
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
                    <g id="edit">
                        <path id="Vector" d="M9.33301 9.33334H7.99967C7.29243 9.33334 6.61415 9.61429 6.11406 10.1144C5.61396 10.6145 5.33301 11.2928 5.33301 12V24C5.33301 24.7072 5.61396 25.3855 6.11406 25.8856C6.61415 26.3857 7.29243 26.6667 7.99967 26.6667H19.9997C20.7069 26.6667 21.3852 26.3857 21.8853 25.8856C22.3854 25.3855 22.6663 24.7072 22.6663 24V22.6667M21.333 6.66667L25.333 10.6667M27.1797 8.78001C27.7048 8.25488 27.9998 7.54265 27.9998 6.80001C27.9998 6.05736 27.7048 5.34513 27.1797 4.82001C26.6545 4.29488 25.9423 3.99986 25.1997 3.99986C24.457 3.99986 23.7448 4.29488 23.2197 4.82001L11.9997 16V20H15.9997L27.1797 8.78001Z" stroke={isHover ? "#0A5FFF" : "#1C1C1C"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                </svg>

            </div>
        </Tooltip>
    )
}

export default EditIcon