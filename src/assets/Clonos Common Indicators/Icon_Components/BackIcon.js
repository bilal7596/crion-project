import React from 'react'
import useToggler from '../../../CustomHooks/TogglerHook'
import { Tooltip } from '@material-ui/core'

const BackIcon = ({ tooltipTitle, onClick }) => {
    let [isHover, setIsHover] = useToggler()
    return (
        <Tooltip title={tooltipTitle}>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                onClick={() => onClick()}
                style={{ padding: "0px", margin: "0px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", width: "fit-content", height: "fit-content" }}
            >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <g id="circle-chevron-left">
                        <path id="Vector" d="M17.3333 20L13.3333 16L17.3333 12M28 16C28 14.4241 27.6896 12.8637 27.0866 11.4078C26.4835 9.95189 25.5996 8.62902 24.4853 7.51472C23.371 6.40042 22.0481 5.5165 20.5922 4.91345C19.1363 4.31039 17.5759 4 16 4C14.4241 4 12.8637 4.31039 11.4078 4.91345C9.95189 5.5165 8.62902 6.40042 7.51472 7.51472C6.40042 8.62902 5.5165 9.95189 4.91345 11.4078C4.31039 12.8637 4 14.4241 4 16C4 19.1826 5.26428 22.2348 7.51472 24.4853C9.76516 26.7357 12.8174 28 16 28C19.1826 28 22.2348 26.7357 24.4853 24.4853C26.7357 22.2348 28 19.1826 28 16Z" stroke={isHover ? "#0A5FFF" : "#1C1C1C"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                </svg>
            </div>
        </Tooltip>

    )
}

export default BackIcon