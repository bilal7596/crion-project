import React from 'react'
import { useState } from 'react'
import useToggler from '../../../CustomHooks/TogglerHook'
import { Tooltip } from '@material-ui/core'

const CopyIcon = ({ tooltipTitle }) => {
    let [isHover, setIsHover] = useToggler()
    return (
        <Tooltip title={tooltipTitle}>
            <div
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="copy">
                        <path id="Vector" d="M21.333 10.6667V7.99999C21.333 7.29275 21.0521 6.61447 20.552 6.11438C20.0519 5.61428 19.3736 5.33333 18.6663 5.33333H7.99967C7.29243 5.33333 6.61415 5.61428 6.11406 6.11438C5.61396 6.61447 5.33301 7.29275 5.33301 7.99999V18.6667C5.33301 19.3739 5.61396 20.0522 6.11406 20.5523C6.61415 21.0524 7.29243 21.3333 7.99967 21.3333H10.6663M10.6663 13.3333C10.6663 12.6261 10.9473 11.9478 11.4474 11.4477C11.9475 10.9476 12.6258 10.6667 13.333 10.6667H23.9997C24.7069 10.6667 25.3852 10.9476 25.8853 11.4477C26.3854 11.9478 26.6663 12.6261 26.6663 13.3333V24C26.6663 24.7072 26.3854 25.3855 25.8853 25.8856C25.3852 26.3857 24.7069 26.6667 23.9997 26.6667H13.333C12.6258 26.6667 11.9475 26.3857 11.4474 25.8856C10.9473 25.3855 10.6663 24.7072 10.6663 24V13.3333Z" stroke={isHover ? "#0A5FFF" : "#1C1C1C"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                </svg>
            </div>
        </Tooltip>

    )
}

export default CopyIcon