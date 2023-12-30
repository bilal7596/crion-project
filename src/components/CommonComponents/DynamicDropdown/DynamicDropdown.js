import React, { useState } from 'react'
import Styles from "./DynamicDropdown.module.css"
import Modal from '../Modal/Modal'
import closeIcon from "../../../assets/UIUX/icons/WO/circle-x-filled.svg"
import searchIcon from "../../../assets/UIUX/icons/WO/search (2).svg"
import ClonosSpinner from "../../../assets/Clonos Common Indicators/Clonos_Spinner.svg"
import { useEffect } from 'react'
import useToggler from '../../../CustomHooks/TogglerHook'
import { IoIosClose } from "react-icons/io"



/**
 * Dynamic Dropdown component.
 * 
 * @param {object} props - The component's input properties.
 * @property {string} title - The title of the dropdown.
 * @property {string} labelActivator - The label for the activator.
 * @property {boolean} isMandatory - Indicates if the dropdown is mandatory.
 * @property {boolean} isOpen - Indicates if the dropdown is open.
 * @property {function} isOpenMethod - The method to toggle the dropdown open/closed.
 * @property {boolean} isSearchable - Indicates if the dropdown is searchable.
 * @property {boolean} isCheckbox - Indicates if the dropdown allows multiple selections.
 * @property {boolean} isDynamicLoad - Indicates if data should be loaded dynamically.
 * @property {boolean} isActivator - Indicates if an activator is used to control the dropdown.
 * @property {boolean} isAsset - Indicates if the dropdown is for assets.
 * @property {boolean} isUser - Indicates if the dropdown is for users.
 * @property {boolean} isDynamicSearch - Indicates if the dropdown has dynamic search.
 * @property {string} placeholder - The placeholder text for the search input.
 * @property {string} heading - The heading for the dropdown.
 * @property {array} data - The data for the dropdown options.
 * @property {function} handleMoreData - The method to handle loading more data.
 * @property {string} url - The URL for the dropdown.
 * @property {array} defaultValue - The default selected values.
 * @property {function} handleGetValues - The method to handle getting selected values.
 * @property {function} handleGetErrorMethods - The method to handle errors in the dropdown.
 * @property {function} handleGetErrorActivatorInformation - The method to handle errors in the activator.
 * @property {string} errorMessage - The error message for the dropdown.
 * @property {function} handleGetErrorActivatorInformation - This function will handle all kind of error handling, that returns one object.
 * @property {function} handleGetErrorActivatorInformation.errorActivatorMethod  - This function will trigger or allow to show the error, it takes boolean value (true/false).
 * @property {function} handleGetErrorActivatorInformation.errorSetterMethod  - This function can set the error massage, it takes string.
 * @property {function} handleGetErrorActivatorInformation.type  - "type" represent that which kind of components is it like, "input, select, textarea"
 * @property {function} handleGetErrorActivatorInformation.uniqueKey  - "uniqueKey" will be be unique string that represent specific element.
 * @property {function} handleGetErrorActivatorInformation.value  - "value" Initially will be false that you need to change once that specific element has come value. and make it as true.
 * @returns {React.Component} - ClonosSelect component.
 */

const DynamicDropdown = ({ title, labelActivator, isMandatory, uniqueKey, isOpen, isOpenMethod, isSearchable, isCheckbox, isDynamicLoad, isActivator, isAsset, isUser, isDynamicSearch, placeholder, heading, data, handleMoreData, url, defaultValue, handleGetValues, handleGetErrorMethods, handleGetErrorActivatorInformation, errorMessage }) => {
    console.log('defaultValueDynamic:', defaultValue)
    let [isLoading, setIsLoading] = useState(false)
    let [selectedItems, setSelectedItems] = useState([])
    let [lcData, setLcData] = useState([])
    let [selectedItemsIds, setSelectedItemsIds] = useState([])
    let [inputValue, setInputValue] = useState('');
    let [debouncedValue, setDebouncedValue] = useState('');
    let [lcIsOpen, setLcIsOpen] = useToggler()
    let [isAnyValueSelected, setIsAnyValueSelected] = useState(false);
    let [showErrorMessage, setShowErrorMessage] = useState(false);
    const [lcErrorMessage, setLcErrorMessage] = useState(errorMessage)



    const loadMoreData = () => {
        // Simulated data loading for "Load More" (replace with your data loading logic)
        setIsLoading(true);
        setTimeout(() => {
            handleMoreData({ isActivator })
            setIsLoading(false);
        }, 1000); // Simulated delay for loading data
    };


    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;

        if (scrollTop + clientHeight >= scrollHeight - 50 && !isLoading) {
            // When the user is near the bottom, load more data
            loadMoreData();
        }
    };


    /**
     * Handles the selection or deselection of items in a dynamic dropdown.
     *
     * @param {object} props - The function's input properties.
     * @property {object} e - The event object, which can be used to check the state of the checkbox.
     * @property {object} props.item - The item being selected or deselected.
     */
    const handleGetValuesLc = ({ e, item }) => {
        if (e) {
            if (e.target.checked) {
                // Clear error message and indicate that at least one item is selected
                showErrorMessage && setShowErrorMessage(false);
                setIsAnyValueSelected(true);

                // Update the selected items and their IDs
                setSelectedItems((prev) => {
                    let updatedState = [...prev, item];
                    // Handle the selected values, e.g., for dynamic dropdown
                    handleGetValues && handleGetValues({ "name": title.toLowerCase(), uniqueKey, selectedOption: updatedState, "type": "dynamicDropdown" });
                    return updatedState;
                });

                let temp = selectedItems.map(ele => ele.id);
                setSelectedItemsIds([...temp, item?.id]);
            } else {
                // Handle deselection
                let filteredData = selectedItems.filter(ele => ele.id !== item.id);
                if (filteredData.length === 0) {
                    setIsAnyValueSelected(false);
                    setShowErrorMessage(true);
                }
                if (!filteredData.length) setIsAnyValueSelected(false);

                let temp = filteredData.map(ele => ele.id);
                setSelectedItemsIds([...temp]);

                // Handle the deselected values, e.g., for dynamic dropdown
                handleGetValues && handleGetValues({ "name": title.toLowerCase(), uniqueKey, selectedOption: filteredData, "type": "dynamicDropdown" });

                setSelectedItems(filteredData);
            }
        } else {
            if (isCheckbox) {
                alert("Please click on checkboxes!");
            } else {
                // Handle selection without checkboxes
                setIsAnyValueSelected(true);
                setShowErrorMessage(false);
                setSelectedItems([item]);
                // Handle the selected values, e.g., for dynamic dropdown
                handleGetValues && handleGetValues({ "name": title.toLowerCase(), uniqueKey, selectedOption: [item], "type": "dynamicDropdown" });

                // Conditionally set the open state based on 'isActivator'
                isActivator ? setLcIsOpen() : isOpenMethod();
            }
        }
    };


    useEffect(() => {
        // Define a function to execute the debounce logic
        const debounce = setTimeout(() => {
            setDebouncedValue(inputValue);
            handleSearch({ name: inputValue })
        }, 500); // Adjust the debounce delay as needed (e.g., 500ms)

        setLcErrorMessage(errorMessage ? errorMessage : `Please fill the ${title} field!`)

        // Clean up the timeout when the component unmounts or when inputValue changes
        return () => {
            clearTimeout(debounce);
        };
    }, [inputValue]);

    useEffect(() => {
        if (data.length > 0) setLcData(data)
    }, [data])

    useEffect(() => {
        handleGetErrorMethods && handleGetErrorMethods({ "name": title.toLowerCase(), "selectedOption": "", setShowErrorMessage, type: "dynamicDropdown", valueSetterMethod: setIsAnyValueSelected, isMandatory })
        if (defaultValue) {
            setSelectedItems(defaultValue)
            setIsAnyValueSelected(true)
            let temp = selectedItems.length > 0 && selectedItems.map(ele => ele?.id)
            setSelectedItemsIds(temp)
        }
        handleGetErrorActivatorInformation && isMandatory && handleGetErrorActivatorInformation({ uniqueKey, type: "dynamicDropdown", value: false, errorActivatorMethod: setShowErrorMessage, errorSetterMethod: setLcErrorMessage })
    }, [defaultValue && defaultValue[0]?.name])

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSearch = ({ name }) => {
        if (isDynamicSearch) {
        } else {
            let filteredData = data.filter((ele) => {
                let needToSearch = name.toUpperCase();
                let element = ele.name.toUpperCase();
                let count = 0
                for (let i = 0; i < needToSearch.length; i++) {
                    if (element[i] == needToSearch[i]) count++
                }
                if (count == needToSearch.length) return ele
            })
            if (name === "" && data.length > 0) setLcData(data)
            else if (name.length > 0) setLcData(filteredData)
        }
    }


    const handleMakeCapitalStrint = ({ string, splitterSign }) => {

        let splitedString = string?.split(splitterSign);
        let updatedArray = splitedString?.map(item => item.charAt(0).toUpperCase() + item.slice(1));
        return updatedArray?.join(" ")

    }

    return (
        <>
            {
                isActivator && <>
                    <div className={Styles.dynamicDropdown_container} >
                        <label>{title} {isMandatory && <sup className={Styles.dynamicDropdown_label}>*</sup>}</label>
                        <div className={Styles.dynamicDropdown_isActivator} onClick={() => isActivator ? setLcIsOpen() : isOpenMethod()}>
                            <span>{isAnyValueSelected ? isCheckbox ? labelActivator : selectedItems[0]?.name : labelActivator}</span>
                            <div className={Styles.ddi_controllers}>
                                {
                                    isAnyValueSelected && !isCheckbox && <IoIosClose fontSize="23px" color="#a3a3a7" onClick={(e) => {
                                        e.stopPropagation()
                                        setIsAnyValueSelected(false)
                                        setShowErrorMessage(true)
                                        setSelectedItems([])
                                        handleGetValues && handleGetValues({ "name": title.toLowerCase(), uniqueKey, selectedOption: null, "type": "dynamicDropdown" })
                                    }} />
                                }
                                <img src={url ? url : searchIcon} alt="searchIcon" />
                            </div>
                        </div>
                        {
                            isCheckbox && <div className={Styles.ddi_checkbox_controller}>
                                {
                                   selectedItems && selectedItems.length > 0 && selectedItems?.map((ele) => {
                                        return <div className={Styles.ddi_checkbox_controller_item}><span>{ele.name}</span> <IoIosClose fontSize="23px" onClick={() => {
                                            let temp = selectedItemsIds.filter((lcItem => lcItem !== ele.id))
                                            setSelectedItemsIds(temp)
                                            return setSelectedItems((prev) => {
                                                let updatedValues = prev.filter((item) => item.id != ele.id)
                                                !updatedValues.length && setShowErrorMessage(true)
                                                return updatedValues
                                            })
                                        }} /> </div>
                                    })
                                }
                            </div>
                        }
                        {showErrorMessage && <p>{lcErrorMessage}</p>}
                    </div>
                </>
            }

            <Modal isOpen={isActivator ? lcIsOpen : isOpen} closeModalMethod={() => {
                isActivator ? setLcIsOpen() : isOpenMethod()
                isAnyValueSelected ? setShowErrorMessage(false) : setShowErrorMessage(true)
            }}>
                <div className={Styles.dd_body}> {/* dd: dynamic dropdown */}
                    <header className={Styles.ddb_header}> {/* ddb: dynamic dropdown body */}
                        <span>{heading}</span>
                        <div><img onClick={() => isActivator ? setLcIsOpen() : isOpenMethod()} src={closeIcon} alt='Close Button' /></div>
                    </header>

                    <section>
                        <div>
                            {
                                isSearchable && <div className={Styles.ddb_search} >
                                    <img src={searchIcon} alt="Search" />
                                    <input
                                        placeholder={placeholder}
                                        value={inputValue}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            }
                        </div>
                        <div className={Styles.ddb_content} onScroll={isDynamicLoad && handleScroll}>
                            {lcData.map((item, index) => {
                                {
                                    return <div key={index} className={Styles.ddbc_item} onClick={() => handleGetValuesLc({ item })}> {/* ddbc: dynamic dropdown body content */}
                                        {isCheckbox && <div><input type='checkbox' checked={selectedItemsIds.length > 0 && selectedItemsIds?.includes(item.id)} onClick={(e) => {
                                            e.stopPropagation()
                                            handleGetValuesLc({ e, item })
                                        }} /></div>}
                                        <div className={Styles.ddbc_item_values}>
                                            {
                                                isAsset ? <>
                                                    <span>{item?.name}</span>
                                                    <span>{item?.assetNumber}</span>
                                                </>
                                                    : isUser ? <>
                                                        <span>{item?.name}</span>
                                                        <span>{handleMakeCapitalStrint({ string: item?.roleName, splitterSign: "_" })}</span>
                                                        {/* <span>{item?.name}</span> */}
                                                    </> :
                                                        <>
                                                            <span>{item?.name}</span>
                                                        </>
                                            }
                                        </div>
                                    </div>
                                }
                            })}
                            {
                                isLoading && <img src={ClonosSpinner} />
                            }
                            {
                                !data.length && <section><span>No {title}s Found!</span></section>
                            }
                        </div>
                    </section>
                    <footer className={Styles.ddb_footer}>
                        <div className={Styles.ddbf_controller}> {/* ddbf: dynamic dropdown body footer */}
                            <span onClick={() => {
                                isActivator ? setLcIsOpen() : isOpenMethod()
                                isMandatory && isAnyValueSelected == false && setShowErrorMessage(true)
                                setSelectedItems([])
                            }}>Cancel</span>
                            <span onClick={() => {
                                isActivator ? setLcIsOpen() : isOpenMethod()
                                isAnyValueSelected ? setShowErrorMessage(false) : setShowErrorMessage(true)
                            }}>Ok</span>
                        </div>
                    </footer>
                </div >
            </Modal >
        </>
    )
}

export default DynamicDropdown