import React from 'react'
import Styles from "./DateComp.module.css"
import { DateRangePicker } from 'rsuite';


const DateComp = ({ handleGetValueForDebounce, filteredKeys, updateFilteredKeysMethod, placeholder, url, name, label }) => {

    const handleUpdateFilteredKeysObject = (e) => {
        let isoDates = e?.map((ele) => {
            const dateObj = new Date(ele);
            const isoDateString = dateObj.toISOString();
            return isoDateString
        })
        if (e == null) {
            updateFilteredKeysMethod((prev) => {
                let updatedValue = { ...prev, [name]: "" }
                handleGetValueForDebounce(updatedValue)
                return updatedValue
            })
        } else {
            updateFilteredKeysMethod((prev) => {
                let updatedValue = { ...prev, [name]: { "from": isoDates[0], "to": isoDates[1] } }
                handleGetValueForDebounce(updatedValue)
                return updatedValue
            })
        }
    }

    return (
        <div className={Styles.date_container}>
            <label name={name}>{label}</label>
            <DateRangePicker format="dd-MM-yyyy" onChange={handleUpdateFilteredKeysObject} placement='leftStart' />
        </div>
    )
}

export default DateComp