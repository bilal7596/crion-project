import React, { useEffect, useState } from 'react';
import Styles from "../../ModuleStyles/WorkOrder/WorkOrder.module.css";
import { SelectPicker } from "rsuite"
import { TextField } from '@material-ui/core';
import useToggler from '../../CustomHooks/TogglerHook';

const LabelSelectComp = ({ label, name, handleGetValues, placeholder, options, source, handleGetErrorMethods, handleGetUsersBasedOnTeamId, formValues, defaultValue, isMandatory, isClickable, isClickableMethod }) => {

    const [selectedValue, setSelectedValue] = useState("");
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    console.log(`options${name}`, options)
    let data = options.length > 0 && options?.map((item) => {
        console.log('item23:', item)
        if (name == "team") {
            return { label: item.teamName ? item.teamName : "Not Available", value: JSON.stringify({ value: item.teamId, label: item.teamName }) }
        }
        else if (name == "user") {
            return { label: item.username, value: JSON.stringify({ value: item.userId, label: item.username }) }
        }
        else if (name == "asset") {
            console.log(name)
            return { label: item.assetName ? item.assetName : "Not Available", value: JSON.stringify({ value: item._id, label: item.assetName }) }
        }
        else if (name == "department" || "priority") {
            return { label: item.name ? item.name : "Not Available", value: JSON.stringify({ value: item.id, label: item.name }) }
        }
    })

    console.log('data:', data)

    const handleChange = (e) => {
        console.log("this is for select", e)
        if (name == "team") {
            let val = JSON.parse(e)
            handleGetUsersBasedOnTeamId(val.value)
        }
        setSelectedValue(e);
        handleGetValues({ selectedOption: e, selectTagName: name, type: "select", name, showErrorMessage, setShowErrorMessage });
    };

    const handleBlur = () => {
        if (selectedValue === "") {
            setShowErrorMessage(true);
        } else {
            setShowErrorMessage(false);
        }
    };

    useEffect(() => {
        handleGetErrorMethods({ name, selectedOption: selectedValue, setShowErrorMessage, showErrorMessage, type: "select", valueSetterMethod: setSelectedValue, isMandatory })
        data.length > 0 && data?.map((ele) => {
            let parsedValue = JSON.parse(ele.value)
            if (parsedValue.value == defaultValue) setSelectedValue(ele.value)
        })
    }, [options])


    return (
        <div className={Styles.work_order_label_select_comp}>
            <label>{label} {isMandatory && <sup className={Styles.work_order_label_input_comp_isMandatory}>*</sup>}</label>
            <div onClick={() => isClickable && isClickableMethod()}>
                {
                    <SelectPicker
                        name={name}
                        value={selectedValue}
                        onChange={handleChange}
                        onBlur={handleBlur} // Check if the default option is selected when the user leaves the select element
                        required
                        className='custom-select-picker'
                        disabled={isClickable || name == "user" && !formValues?.['team'] ? true : false}
                        placement={name == "user" || name == "team" ? 'topStart' : 'bottomStart'}
                        data={data.length > 0 ? data : []} />
                }
                <img src={source} alt='name' />
            </div>
            {showErrorMessage && <p>{`Please select a ${label}!`}</p>}
        </div>
    );
};

export default LabelSelectComp;
