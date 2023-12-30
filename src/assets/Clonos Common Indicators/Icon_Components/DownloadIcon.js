import React from 'react'
import useToggler from '../../../CustomHooks/TogglerHook'
import { Tooltip } from '@material-ui/core'

const DownloadIcon = ({ tooltipTitle, onClick }) => {
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
                    <g id="download">
                        <path id="Vector" d="M5.33301 22.6667V25.3333C5.33301 26.0406 5.61396 26.7188 6.11406 27.2189C6.61415 27.719 7.29243 28 7.99967 28H23.9997C24.7069 28 25.3852 27.719 25.8853 27.2189C26.3854 26.7188 26.6663 26.0406 26.6663 25.3333V22.6667M9.33301 14.6667L15.9997 21.3333M15.9997 21.3333L22.6663 14.6667M15.9997 21.3333V5.33333" stroke={isHover ? "#0A5FFF" : "#1C1C1C"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                </svg>
            </div>
        </Tooltip>
    )
}

export default DownloadIcon