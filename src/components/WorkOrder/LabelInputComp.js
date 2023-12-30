import React, { useState } from 'react';
import Styles from "../../ModuleStyles/WorkOrder/WorkOrder.module.css";
import { useEffect } from 'react';

const LabelInputComp = ({ itemRef, label, range, limit = 500, name, type, handleGetValues, placeholder, unique, handleGetErrorMethods, defaultValue, isMandatory }) => {
    console.log('range:', range)
    console.log('limit:', limit)
    const [inputValue, setInputValue] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [isLengthExceeded, setIslengthExceeded] = useState(false)
    const [errorMessage, setErrorMessage] = useState(`Please fill the ${label} field!`)

    console.log(`showErrorMessage: ${name}`, showErrorMessage)

    const handleChange = (e) => {
        // if (e.target.value.length < limit) setShowErrorMessage(false)
        if (range?.length > 0 && e.target.value.length <= limit) {
            console.log('e.target.value:', e.target.value)
            if ((range[0] <= e.target.value && e.target.value <= range[1]) || (range[1] <= e.target.value && e.target.value <= range[0])) {
                setInputValue(e.target.value);
                handleGetValues({ e, setShowErrorMessage, name, showErrorMessage });
                setShowErrorMessage(false)
                setErrorMessage(`Please fill the ${label} field!`)
            }
            else {
                setShowErrorMessage(true)
                setInputValue("")
                setErrorMessage(`You can select ${label} between ${range[0] < range[1] ? `${range[0]} to ${range[1]}` : `${range[1]} to ${range[0]}`} letters!`)
            }
        }
        else if (name == "title") {
            if (e.target.value.length <= limit) {
                const specialCharactorString = "#$@%^&*!~";
                const name = e.target.name; // Assuming you have a 'name' attribute in the input element.
                const inputValue = e.target.value;

                // Remove characters that are present in the specialCharactorString
                const filteredValue = inputValue
                    .split('')
                    .filter(char => !specialCharactorString.includes(char))
                    .join('');
                setInputValue(filteredValue);
                handleGetValues({ e, setShowErrorMessage, name, showErrorMessage });
                setShowErrorMessage(false)
            }
            else {
                setShowErrorMessage(true)
                setErrorMessage(`Please limit your input to ${limit} characters or fewer`)
            }
        } else {
            if (e.target.value.length <= limit && !range) {
                setInputValue(e.target.value);
                handleGetValues({ e, setShowErrorMessage, name, showErrorMessage });
                setShowErrorMessage(false)
            }
            else {
                setShowErrorMessage(true)
                if (name == "description") setErrorMessage(`${label} should be less than ${limit} letters!`)
                else setErrorMessage(`Please fill the ${label} field!`)
            }
        }
    };

    const handleSubmit = () => {
        if (inputValue.trim() === "") {
            setShowErrorMessage(true);
        } else {
            setShowErrorMessage(false);
        }
    };

    const invokedErrorMassage = () => {
        return setShowErrorMessage
    }

    useEffect(() => {
        handleGetErrorMethods({ name, selectedOption: inputValue, setShowErrorMessage, showErrorMessage, type: "text", valueSetterMethod: setInputValue, isMandatory })
        if (defaultValue) {
            setInputValue(defaultValue)
        }
    }, [])


    return (
        <>
            <div className={Styles.work_order_label_input_comp}>
                <label>{label} {isMandatory && <sup className={Styles.work_order_label_input_comp_isMandatory}>*</sup>}</label>
                {
                    !unique ?
                        <input
                            className={`${Styles.work_order_label_input_comp_input_tag}`}
                            name={name}
                            type={type}
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={handleChange}
                            onBlur={handleSubmit} // Check if the input is empty when the user leaves the input field
                            required
                        /> :
                        <textarea
                            className={`${Styles.work_order_label_input_comp_input_tag} ${unique ? Styles.work_order_label_select_comp_unique : ""}`}
                            name={name}
                            type={type}
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={handleChange}
                            onBlur={handleSubmit} // Check if the input is empty when the user leaves the input field
                            required
                        />
                }
                {showErrorMessage && isMandatory && <p>{errorMessage}</p>}
                {showErrorMessage && name === "description" && <p>{errorMessage}</p>}
            </div>
        </>
    );
};

export default LabelInputComp;
