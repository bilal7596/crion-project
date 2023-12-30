import React from 'react';
import { useEffect, useState } from 'react';
import Styles from './ClonosTextarea.module.css';

/**
 * ClonosTextarea component for rendering a custom input field.
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
 * @property {function} handleGetErrorActivatorInformation - This function will handle all kind of error handling, that returns one object.
 * @property {function} handleGetErrorActivatorInformation.errorActivatorMethod  - This function will trigger or allow to show the error, it takes boolean value (true/false).
 * @property {function} handleGetErrorActivatorInformation.errorSetterMethod  - This function can set the error massage, it takes string.
 * @property {function} handleGetErrorActivatorInformation.type  - "type" represent that which kind of components is it like, "input, select, textarea"
 * @property {function} handleGetErrorActivatorInformation.uniqueKey  - "uniqueKey" will be be unique string that represent specific element.
 * @property {function} handleGetErrorActivatorInformation.value  - "value" Initially will be false that you need to change once that specific element has come value. and make it as true.
 * @returns {React.Component} - ClonosTextarea component.
 */
const ClonosTextarea = React.memo(({ type, uniqueKey, name, placeholder, label, errorMessage, isLabel, inputStyle, labelStyle, defaultValue, isMandatory = false, handleGetValues, areaLabel, limit, handleGetErrorActivatorInformation }) => {
    const [lcValue, setLcValue] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [lcErrorMessage, setLcErrorMessage] = useState(errorMessage)

    /**
     * Handle change event for the input field.
     * @param {Object} props - Event object and type of the input field.
     */
    const handleChange = ({ type, e }) => {
        if (type !== 'file') {
            setLcValue((prev) => {
                if (e.target.value.length > limit) {
                    setShowErrorMessage(true)
                    setLcErrorMessage(`Your input should contain less then ${limit} letters!`)
                }
                else setShowErrorMessage(false)

                let updatedValue = e.target.value;
                handleGetValues && handleGetValues({ type, uniqueKey, updatedValue });
                return updatedValue
            });
        }
    };

    /**
     * Handle form submission, check for mandatory fields.
     */
    const handleSubmit = () => {
        if (lcValue.trim() === '') {
            setShowErrorMessage(true);
        } else {
            setShowErrorMessage(false);
        }
    };

    useEffect(() => {
        defaultValue && defaultValue?.length > 0 && setLcValue(defaultValue);
        handleGetErrorActivatorInformation && isMandatory && handleGetErrorActivatorInformation({ uniqueKey, value: false, type, errorActivatorMethod: setShowErrorMessage, errorSetterMethod: setLcErrorMessage })

    }, [defaultValue]);

    return (
        <div className={Styles.clonos_textarea_container} aria-label={areaLabel}>
            {isLabel && <label style={{ ...labelStyle }}>{label} {isMandatory && <sup className={Styles.clonos_textarea_isMandatory}>*</sup>}</label>}
            <div className={Styles.clonos_textarea}>
                <textarea
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={lcValue}
                    onChange={(e) => handleChange({ type, e })}
                    onBlur={isMandatory && handleSubmit}
                    style={{ ...inputStyle }}
                    maxLength={"250"}
                />
            </div>
            {showErrorMessage && <span className={Styles.clonos_textarea_error}>{lcErrorMessage ? lcErrorMessage : `Please Fill ${label} Field!`}</span>}
        </div>
    );
});

export default ClonosTextarea;
