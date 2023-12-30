import React, { useState } from 'react';
import Styles from "../../ModuleStyles/WorkOrder/WorkOrder.module.css";
import { useEffect } from 'react';
import { getDateAndTime } from '../../utils/WorkOrderMethods/WorkOrderMethods';
import { isDate1GreaterThanDate2 } from '../../utils/clonosCommon';

const LabelDateComp = ({ label, name, type, handleGetValues, placeholder, handleGetErrorMethods, defaultValue, formValues, isMandatory, range }) => {
    console.log('formValues:', formValues)
    console.log('defaultValue:', defaultValue);
    const [inputValue, setInputValue] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(`Please fill the ${label} field!`)

    // Get the current date and time
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toTimeString().split(' ')[0];

    // To get values from input fields.
    const handleChange = (e) => {
        console.log('e.target.value:', e.target.value)
        if (name == "startDate" || isDate1GreaterThanDate2(e.target.value, formValues?.startDate)) {
            setInputValue(e.target.value);
            handleGetValues && handleGetValues({ e, showErrorMessage, setShowErrorMessage, name });
            setShowErrorMessage(false)
        }
        else {
            setShowErrorMessage(true)
            setErrorMessage(`You can't select ${label} which is less than start date!`)
        }
    }


    // To show to error message when user move the input focus from one input to other without put any text in the input field.
    const handleBlur = () => {
        if (inputValue.trim() === "") {
            setShowErrorMessage(true);
        } else {
            setShowErrorMessage(false);
        }
    };

    useEffect(() => {
        handleGetErrorMethods && handleGetErrorMethods({ name, selectedOption: inputValue, setShowErrorMessage, showErrorMessage, type: "date", valueSetterMethod: setInputValue });
        if (defaultValue) {
            if (name == "start_date") {
                let date = defaultValue.split("T")[0]
                setInputValue(date)
            }
            else {
                setInputValue(defaultValue)
            }
        }
    }, []);


    return (
        <>
            <div className={Styles.work_order_label_date_comp}>
                <label>{label} {isMandatory && <sup className={Styles.work_order_label_input_comp_isMandatory}>*</sup>}</label>
                <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleChange}
                    onBlur={handleBlur} // Check if the input is empty when the user leaves the input field
                    required
                    // Set the minimum value for the date or time input
                    min={type === "date" ? currentDate : currentTime}
                    disabled={!formValues?.startDate && name == "endDate" ? true : false}
                />
                {showErrorMessage && <p>{errorMessage}</p>}
            </div>
        </>
    );
};

export default LabelDateComp;
