import React from 'react'
import useToggler from '../../../CustomHooks/TogglerHook'
import { Tooltip } from '@material-ui/core'

const CloseIcon = ({ tooltipTitle, onClick }) => {
    let [isHover, setIsHover] = useToggler()
    return (
        <Tooltip title={tooltipTitle}>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() => onClick()}
                style={{ padding: "0px", margin: "0px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "fit-content", height: "fit-content" }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke={isHover ? "#0A5FFF" : "#1C1C1C"}>
                    <g id="circle-x-filled">
                        <path id="Vector" d="M22.667 4.45333C24.678 5.61447 26.3509 7.2807 27.5201 9.28707C28.6892 11.2934 29.3141 13.5704 29.3329 15.8925C29.3517 18.2145 28.7636 20.5013 27.627 22.5263C26.4904 24.5513 24.8447 26.2443 22.8526 27.4378C20.8606 28.6312 18.5915 29.2838 16.2698 29.3308C13.9481 29.3777 11.6544 28.8176 9.61573 27.7057C7.57707 26.5938 5.86415 24.9687 4.64655 22.9914C3.42894 21.014 2.74887 18.7529 2.67366 16.432L2.66699 16L2.67366 15.568C2.74833 13.2653 3.41839 11.0213 4.61851 9.05466C5.81863 7.08803 7.50786 5.46593 9.52151 4.34651C11.5352 3.22708 13.8045 2.64853 16.1083 2.66725C18.4121 2.68597 20.6718 3.30133 22.667 4.45333ZM14.015 12.1867C13.7356 12.0204 13.4051 11.9619 13.0857 12.0222C12.7662 12.0825 12.4798 12.2574 12.2803 12.5141C12.0807 12.7708 11.9819 13.0915 12.0023 13.416C12.0227 13.7405 12.1609 14.0463 12.391 14.276L14.1137 16L12.391 17.724L12.2803 17.8493C12.0731 18.1173 11.9757 18.4541 12.0078 18.7914C12.0399 19.1286 12.1992 19.441 12.4533 19.665C12.7074 19.889 13.0372 20.008 13.3758 19.9976C13.7144 19.9873 14.0364 19.8485 14.2763 19.6093L16.0003 17.8867L17.7243 19.6093L17.8497 19.72C18.1176 19.9272 18.4545 20.0247 18.7917 19.9925C19.1289 19.9604 19.4413 19.8011 19.6653 19.547C19.8894 19.2929 20.0083 18.9631 19.998 18.6245C19.9876 18.2859 19.8488 17.9639 19.6097 17.724L17.887 16L19.6097 14.276L19.7203 14.1507C19.9275 13.8827 20.025 13.5459 19.9929 13.2086C19.9607 12.8714 19.8015 12.559 19.5474 12.335C19.2933 12.111 18.9634 11.992 18.6248 12.0024C18.2862 12.0127 17.9643 12.1515 17.7243 12.3907L16.0003 14.1133L14.2763 12.3907L14.151 12.28L14.015 12.1867Z" fill="#06337E" />
                    </g>
                </svg>
            </div>
        </Tooltip>

    )
}

export default CloseIcon