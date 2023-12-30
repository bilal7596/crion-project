import React from 'react'
import Styles from "./NeedToFilterComp.module.css"

const NeedToFilterComp = ({ filteredKeys, updateFilteredKeysMethod, name, placeholder, url, handleGetValueForDebounce }) => {

    const handleUpdateFilteredKeysObject = (e) => {
        console.log('e:', e.target.name)
        updateFilteredKeysMethod({ ...filteredKeys, [name]: e.target.value })
        updateFilteredKeysMethod((prev) => {
            let updatedValue = { ...prev, [name]: e.target.value }
            console.log('updatedValue:', updatedValue)
            handleGetValueForDebounce(updatedValue)
            return updatedValue
        })
    }
    return (
        <div className={Styles.ntfc_container}>
            <img src={url} alt="search" />
            <input placeholder={placeholder} onChange={handleUpdateFilteredKeysObject} name={name} />
        </div>
    )
}

export default NeedToFilterComp