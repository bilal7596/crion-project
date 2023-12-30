import React from 'react';
import { useEffect, useState } from 'react';
import Styles from './ClonosInput.module.css';
import commonSearchIcon from "../../../assets/UIUX/icons/Common_Icon/COMMON_SEARCH_ICON.svg"
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

/**
 * ClonosInput component for rendering a custom input field.
 * @param {Object} props - Component props.
 * @property {string} type - Type of the input field.
 * @property {string} name - Name attribute for the input field.
 * @property {string} placeholder - Placeholder text for the input field.
 * @property {string} label - Label for the input field.
 * @property {boolean} isLabel - Flag to show/hide the label.
 * @property {Object} inputStyle - Additional styles for the input field.
 * @property {Object} labelStyle - Additional styles for the label.
 * @property {string} uniqueKey - Unique key for the component.
 * @property {string} defaultValue - Default value for the input field.
 * @property {boolean} isMandatory - Flag indicating whether the field is mandatory.
 * @property {function} handleGetValues - Callback function to handle value changes.
 * @property {string} areaLabel - Description of the area.
 * @property {boolean} isSpecialCharacterAllow - Flag indicating whether special characters are allowed.
 * @property {Array} onlyAllowTheseSpecialCharacters - Array of special characters allowed in the input.
 * @property {string} errorMessage - Error message to be displayed.
 * @property {number} limit - Maximum number of characters allowed in the input field.
 * @property {string} icon - Source URL for the icon to be displayed in the input field (used when isSearch is true).
 * @property {boolean} isSearch - Indicates whether the input field is a search input. When true, it displays the search icon.
 * @property {function} handleGetErrorActivatorInformation - This function will handle all kinds of error handling, that returns one object.
 * @property {function} handleGetErrorActivatorInformation.errorActivatorMethod  - This function will trigger or allow showing the error, it takes a boolean value (true/false).
 * @property {function} handleGetErrorActivatorInformation.errorSetterMethod  - This function can set the error message, it takes a string.
 * @property {function} handleGetErrorActivatorInformation.type  - "type" represents which kind of components it is like "input, select, textarea".
 * @property {function} handleGetErrorActivatorInformation.uniqueKey  - "uniqueKey" will be a unique string that represents a specific element.
 * @property {function} handleGetErrorActivatorInformation.value  - "value" Initially will be false that you need to change once that specific element has a value and make it true.
 * @returns {React.Component} - ClonosInput component.
 */
const ClonosInput = React.memo(({ type, uniqueKey, value, min, name, placeholder, isSpecialCharacterAllow = true, onlyAllowTheseSpecialCharacters, label, errorMessage, isLabel, inputStyle, labelStyle, defaultValue, isMandatory = false, handleGetValues, areaLabel, limit, handleGetErrorActivatorInformation, icon, isSearch = false }) => {
    console.log('value:', value)
    console.log('defaultValue:', defaultValue)
    const [lcValue, setLcValue] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [lcErrorMessage, setLcErrorMessage] = useState(errorMessage);
    const [isVisible, setIsVisible] = useState(false)

    console.log('lcValue:', lcValue)
    /**
     * Handle change event for the input field.
     * @param {Object} props - Event object and type of the input field.
     */
    const handleChange = ({ type, e }) => {
        if (e.target.value.length > limit) {
            setShowErrorMessage(true)
            setLcErrorMessage(`Your input should contain less then ${limit} letters!`)
            setLcValue((prev) => {
                let updatedValue = e.target.value.substring(0, limit);
                handleGetValues && handleGetValues({ type, uniqueKey, updatedValue });
                return updatedValue
            });
            return
        }


        else setShowErrorMessage(false)
        if (type !== 'file') {
            const value = e.target.value;
            let specialCharacterFlag = isSpecialCharacterAllow;
            const character = value[value?.length - 1];
            console.log('character:', character)
            const lcSpecialCharacters = "~`!@#$%^&*()_-+=";

            if (isSpecialCharacterAllow === false && lcSpecialCharacters.includes(character)) {
                setLcErrorMessage(`Special characters are not allowed!`)
                specialCharacterFlag = false;
                setShowErrorMessage(true);
                specialCharacterFlag = false;
            }

            else if (onlyAllowTheseSpecialCharacters?.length > 0 && isSpecialCharacterAllow == true && lcSpecialCharacters.includes(character)) {
                if (onlyAllowTheseSpecialCharacters.includes(character)) {
                    setShowErrorMessage(false);
                    specialCharacterFlag = true;

                } else {
                    setShowErrorMessage(true);
                    specialCharacterFlag = false;
                    setLcErrorMessage(`Only these special character you can inter, ${onlyAllowTheseSpecialCharacters?.join(" ")}`);
                }
            }
            else {
                specialCharacterFlag = true
            }

            if (specialCharacterFlag) {
                console.log('specialCharacterFlag:', specialCharacterFlag)
                setLcValue((prev) => {
                    let updatedValue = e.target.value;
                    handleGetValues && handleGetValues({ type, uniqueKey, updatedValue });
                    return updatedValue
                });
            }
        }
    };

    /**
     * Handle form submission, check for mandatory fields.
     */
    const handleSubmit = () => {
        if (lcValue.trim() === '') {
            setShowErrorMessage(true);
            setLcErrorMessage(`Please Fill ${label} Field!`)
        } else {
            setShowErrorMessage(false);
        }
    };

    useEffect(() => {
        defaultValue && defaultValue?.length > 0 && setLcValue(defaultValue);
        handleGetErrorActivatorInformation && isMandatory && handleGetErrorActivatorInformation({ uniqueKey, value: false, type, errorActivatorMethod: setShowErrorMessage, errorSetterMethod: setLcErrorMessage })
    }, [defaultValue]);


    return (
        <div className={Styles.clonos_input_container} aria-label={areaLabel}>
            {isLabel && <label style={{ ...labelStyle }}>{label} {isMandatory && <sup className={Styles.clonos_input_isMandatory}>*</sup>}</label>}
            <div className={Styles.clonos_input}>
                <input
                    type={type == "password" ? isVisible ? "text" : type : type}
                    name={name}
                    placeholder={placeholder}
                    value={lcValue ? lcValue : value ? value : ""}
                    onChange={(e) => handleChange({ type, e })}
                    onBlur={isMandatory && handleSubmit}
                    min={min && min}
                    style={{ ...inputStyle }}
                />
                {
                    isSearch && <img src={icon ? icon : commonSearchIcon} alt={uniqueKey} />
                }
                {
                    type === "password" && <>{isVisible ? <FaRegEye onClick={() => setIsVisible(!isVisible)} /> : <FaRegEyeSlash onClick={() => setIsVisible(!isVisible)} />}</>
                }
            </div>
            {showErrorMessage && <span className={Styles.clonos_input_error}>{lcErrorMessage ? lcErrorMessage : `Please Fill ${label} Field!`}</span>}
        </div>
    );
});

export default ClonosInput;
