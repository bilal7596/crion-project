import React from 'react'
import Styles from "./ClonosSelect.module.css"
import { useState, useEffect } from "react"
import useToggler from '../../../CustomHooks/TogglerHook'
import { generateUniqueId } from '../../../utils/clonosCommon'
import commonDownArrowIcon from "../../../assets/UIUX/icons/Common_Icon/COMMON_DOWN_ARROW_ICON.svg"

/**
 * ClonosSelect component for rendering a custom select dropdown.
 * @param {Object} props - Component props.
 * @property {string} type - Type of the select input.
 * @property {string} placeholder - Placeholder text for the select input.
 * @property {string} position - Position of the options container ("top" or "bottom").
 * @property {string} label - Label for the select input.
 * @property {boolean} isLabel - Flag to show/hide the label.
 * @property {string} uniqueKey - Unique key for the component.
 * @property {string} defaultValue - Default value for the select input.
 * @property {boolean} isMandatory - Flag indicating whether the field is mandatory.
 * @property {function} handleGetValues - Callback function to handle value changes.
 * @property {Array} options - Array of options for the select input and each option is an object that take these three keys {label:"string",value:"string",isNeeded:"boolean"}.
 * @property {string} errorMessage - Error message to display for mandatory fields.
 * @property {string} areaLabel - Description of the area.
 * @property {object} labelStyle - For style the label.
 * @property {object} optionStyle - For style the option.
 * @property {function} handleGetErrorActivatorInformation - This function will handle all kind of error handling, that returns one object.
 * @property {function} handleGetErrorActivatorInformation.errorActivatorMethod  - This function will trigger or allow to show the error, it takes boolean value (true/false).
 * @property {function} handleGetErrorActivatorInformation.errorSetterMethod  - This function can set the error massage, it takes string.
 * @property {function} handleGetErrorActivatorInformation.type  - "type" represent that which kind of components is it like, "input, select, textarea"
 * @property {function} handleGetErrorActivatorInformation.uniqueKey  - "uniqueKey" will be be unique string that represent specific element.
 * @property {function} handleGetErrorActivatorInformation.value  - "value" Initially will be false that you need to change once that specific element has come value. and make it as true.
 * @returns {React.Component} - ClonosSelect component.
 */

// * {
//     errorActivatorMethod: ƒ () // This function,
//     errorSetterMethod: ƒ (),
//     type: undefined,
//     uniqueKey: undefined,
//     value: null
//    * }
const ClonosSelect = React.memo(({
    type,
    placeholder,
    position,
    label,
    isLabel,
    uniqueKey,
    defaultValue,
    isMandatory = false,
    handleGetValues,
    options,
    errorMessage,
    areaLabel,
    labelStyle,
    optionStyle,
    handleGetErrorActivatorInformation
}) => {
    const [lcValue, setLcValue] = useState("null");
    console.log('lcValue:', lcValue)
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [optionsWrapper, setOptionsWrapper] = useState(false);
    const [lcErrorMessage, setLcErrorMessage] = useState(errorMessage);


    /**
     * Handle click on a select option.
     * @param {Object} props - The selected option.
     */
    const handleClickOnOption = (props) => {
        setShowErrorMessage(false);
        setLcValue(props);
        setOptionsWrapper(!optionsWrapper);
        handleGetValues && handleGetValues({ type, uniqueKey, updatedValue: props });
    };

    console.log('defaultValue:', defaultValue)
    useEffect(() => {
        defaultValue?.length > 0 && setLcValue(defaultValue);
        setLcErrorMessage(errorMessage)
        handleGetErrorActivatorInformation && isMandatory && handleGetErrorActivatorInformation({
            type,
            uniqueKey,
            errorActivatorMethod: setShowErrorMessage,
            errorSetterMethod: setLcErrorMessage,
            value: (typeof (defaultValue) == "string" || defaultValue?.length > 0) || (typeof (defaultValue) == "array" || defaultValue?.length > 0) ? true : false,
        })
    }, [defaultValue]);

    console.log(options, "options")
    return (
        <div aria-label={areaLabel} className={Styles.clonos_select_container}>
            {isLabel && (
                <label style={{ ...labelStyle }}>
                    {label} {isMandatory && <sup className={Styles.clonos_select_isMandatory}>*</sup>}
                </label>
            )}
            <div className={Styles.clonos_select_wrapper}>
                <div
                    className={Styles.clonos_select}
                    style={{ zIndex: '0' }}
                    onClick={() => {
                        optionsWrapper && lcValue == 'null' && isMandatory && setShowErrorMessage(true);
                        setOptionsWrapper(!optionsWrapper);
                    }}
                >
                    <span>{lcValue?.label ? lcValue?.label : defaultValue ? defaultValue : placeholder}</span>
                    <img src={commonDownArrowIcon} style={{ transform: position == "top" ? optionsWrapper ? "rotate(360deg)" : "rotate(180deg)" : optionsWrapper && "rotate(180deg)", transition: ".1s all ease-in-out" }} />
                </div>
                <div
                    className={Styles.clonos_select_options_container}
                    style={{ top: position === 'top' ? '-310px' : '4.125rem', display: optionsWrapper ? 'flex' : 'none' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {options?.map((option) => {
                        return option?.isNeeded && <div key={generateUniqueId(5)} className={Styles.clonos_select_option} onClick={() => handleClickOnOption(option)}>
                            <span style={{ ...optionStyle }}>{option.label}</span>
                        </div>
                    })}
                    {
                        options?.length == 0 && <p style={{ width: "100%", textAlign: "center", fontSize: "14px", color: "gray", cursor: "default" }}>No Options</p>
                    }
                </div>
                <div
                    className={Styles.clonos_select_overlay}
                    style={{ display: optionsWrapper ? 'block' : 'none' }}
                    onClick={() => {
                        optionsWrapper && lcValue == 'null' && isMandatory && setShowErrorMessage(true);
                        setOptionsWrapper(false);
                    }}
                ></div>
            </div>
            {showErrorMessage && isMandatory && lcValue !== null && <span className={Styles.clonos_select_error}>{lcErrorMessage}</span>}
        </div >
    );
});

export default ClonosSelect;