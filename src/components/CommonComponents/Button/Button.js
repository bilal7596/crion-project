import ClonosSpinner from "../ClonosSpinner/ClonosSpinner";
import "./Button.css"
import React from "react"
/**
 * ClonosButton component for rendering a custom button.
 * @param {Object} props - Component props.
 * @property {string} props.variant - Button variant ("hollow" or "solid").
 * @property {function} props.onClick - Callback function for button click event.
 * @property {boolean} props.isHollow - Flag to determine if the button should have a hollow style.
 * @property {string} props.border - Border style for the button.
 * @property {string} props.fontSize - Font size for the button text.
 * @property {string} props.p - Padding for the button.
 * @property {string} props.m - Margin for the button.
 * @property {Object} props.style - Additional styles for the button.
 * @property {boolean} props.loading - This is state will help to show the loader.
 * @property {boolean} props.isDisabled - This is state will help to disable the button.
 * @property {React.ReactNode} props.children - Content to be displayed inside the button.
 * @returns {React.Component} - ClonosButton component.
 */

export const ClonosButton = React.memo(({ variant, onClick, isHollow, border, fontSize, p, m, style, loading, isDisabled, children }) => {
    let buttonVariant = {
        hollow: { border: "1px solid #000", color: (loading || isDisabled) ? "#a0a0a0" : "black", background: (loading || isDisabled) ? "#d3d3d3" : "white" },
        solid: { backgroundColor: (loading || isDisabled) ? "#d3d3d3" : "#06337E", color: (loading || isDisabled) ? "#a0a0a0" : "white" }
    };
    return (
        <button
            style={{
                ...isHollow ? buttonVariant.hollow : buttonVariant.solid,
                border: border || (loading || isDisabled) ? "none" : "1px solid #3f51b5",
                fontSize: fontSize || "1.25em",
                padding: p || "0.75rem",
                margin: m,
                fontWeight: "600",
                borderRadius: "0.375rem",
                height: "3.375rem",
                // backgroundColor: (loading || isDisabled) && "#d3d3d3",
                // border: (loading || isDisabled) && "none",
                ...style,
            }}
            className={`${variant}_btn`}
            id="clonos_common_button"
            disabled={loading || isDisabled ? true : false}
            onClick={onClick}
        >
            {loading ? <ClonosSpinner color={isHollow ? "#06337E" : "white"} spinnerThickness={"4px"} spinnerShadowColor={isHollow ? "gray" : "white"} /> : children}
        </button>
    );
});
