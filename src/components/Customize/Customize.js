import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { handleLoggedInUser, updateLayout } from '../../utils/clonosCommon'
import Styles from "../../ModuleStyles/Customize/Customize.module.css"
import { Tooltip } from '@material-ui/core'
import { AiOutlinePlus } from "react-icons/ai"
import NeedToFilterComp from '../CommonComponents/FilterInput/NeedToFilterComp'
import { useState } from 'react'
import searchIcon from "../../assets/UIUX/icons/search (1).svg"
import CustomizeCRUD from './CustomizeCRUD'
import Modal from '../CommonComponents/Modal/Modal'
import { handleChange, handleDeleteSubtasks } from '../../utils/WorkOrderMethods/WorkOrderMethods'
import { AiFillCloseCircle } from "react-icons/ai"
import { handleCreateDropdowns } from '../../utils/CustomizeMethods/CustomizeMethods'

let data = [
    {
        id: "qwerty1",
        name: "team",
        values: [{ optionId: "child1", optionName: "Admin" }, { optionId: "child2", optionName: "Engineer" }, { optionId: "child3", optionName: "Super" },],
        isActive: 1
    },
    {
        id: "qwerty2",
        name: "priority",
        values: [{ optionId: "child1", optionName: "Admin" }, { optionId: "child2", optionName: "Engineer" }, { optionId: "child3", optionName: "Super" },],
        isActive: 0
    },
    {
        id: "qwerty3",
        name: "asset",
        values: [{ optionId: "child1", optionName: "Admin" }, { optionId: "child2", optionName: "Engineer" }, { optionId: "child3", optionName: "Super" },],
        isActive: 1
    },
]

const Customize = () => {

    // Global Data States 
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
    console.log('mainLayoutChildrenPositionsToolkitState:', mainLayoutChildrenPositionsToolkitState)

    // Local States 
    const dispatch = useDispatch()
    const [isModal, setIsModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [needToFilter, setNeedToFilter] = useState([])
    const [inputSubtastLength, setInputSubtastLength] = useState([[]])
    const dropdownInputRef = useRef(null)



    const handleGetNotificationsBasedOnFilter = (filteredData) => {
        console.log('filteredData:', filteredData)
        setNeedToFilter({ ...needToFilter, use: true })
        for (let key in filteredData) {
            if (filteredData[key] == "" || (filteredData?.status == "All")) delete filteredData[key]
        }
        setNeedToFilter(filteredData)
        console.log('filteredData:', filteredData)
        // handleGetNotifications({ dispatch, notificationActions, setTotalNotifications, currentPage, setCurrentPage, payload: filteredData });
    }


    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const debouncedHandleGetNotifications = debounce(handleGetNotificationsBasedOnFilter, 1000);

    const handleGetDataBasedOnPagination = () => {
        console.log('currentPage:', currentPage)
        // handleGetNotifications({ payload: needToFilter, dispatch, currentPage, setCurrentPage, setTotalNotifications });
    }

    useEffect(() => {
        updateLayout({ dispatch })
        // Cleanup the debounced function on unmount to prevent memory leaks
        return () => {
            clearTimeout(debouncedHandleGetNotifications);
        };
    }, []);

    return (
        <>
            <div className={Styles.customize_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
                <nav className={Styles.c_nav} /** c = customize */ >
                    <span>Customize</span>
                    <div>
                        {
                            handleLoggedInUser()?.permissions?.includes("wko001") && <Tooltip title="Add New Dropdown">
                                <button onClick={() => setIsModal(true)}>Add<AiOutlinePlus color='white' fontWeight="700" /></button>
                            </Tooltip>
                        }
                    </div>
                </nav>
                <section className={Styles.c_main_body}>
                    <div className={Styles.c_body}>
                        <div className={Styles.c_dropdowns_container}>
                            <nav className={Styles.c_filters}>
                                <NeedToFilterComp handleGetValueForDebounce={debouncedHandleGetNotifications} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} placeholder="Document Name" name="documentTitle" url={searchIcon} />
                            </nav>
                            <div className={Styles.c_dropdowns_list}>
                                {
                                    data?.map((ele) => {
                                        return <CustomizeCRUD key={ele.id} element={ele} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Modal isOpen={isModal} closeModalMethod={setIsModal}> {/* This modal will be contain the dropdown creation code */}
                <div className={Styles.c_modal_container}>
                    <header><span>Create Dropdown</span></header>
                    <section className={Styles.c_modal_body}>
                        <div className={Styles.c_modal_body_input}>
                            <input placeholder='Enter Dropdown Name' ref={dropdownInputRef} />
                        </div>
                        <div className={Styles.c_modal_body_options}>
                            <span>Options:</span>
                            <button onClick={() => setInputSubtastLength([...inputSubtastLength, []])}>Add</button>
                        </div>
                        <div className={Styles.c_modal_body_options_list}>
                            {inputSubtastLength?.map((ele, i) => {
                                return (
                                    <div
                                        className={Styles.c_modal_option_container}
                                        key={i}
                                        display="flex"
                                        justifyContent="space-between"
                                        margin="10px"
                                    >
                                        <input
                                            id="subtasks"
                                            value={ele}
                                            w="80%"
                                            onChange={(e) => handleChange(e, i, inputSubtastLength, setInputSubtastLength)}
                                            onKeyDown={(e) => {
                                                if (e.keyCode === 13) {
                                                    setInputSubtastLength([...inputSubtastLength, []])
                                                }
                                            }}
                                            required
                                            placeholder="Enter Your Task..."

                                        />
                                        <AiFillCloseCircle onClick={() => handleDeleteSubtasks(i, inputSubtastLength, setInputSubtastLength)} />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                    <footer>
                        <button onClick={() => {
                            handleCreateDropdowns({ dispatch, inputSubtastLength, dropdownName: dropdownInputRef?.current?.value })
                            setInputSubtastLength([[]])
                            setIsModal(false)
                            dropdownInputRef.current = null
                        }}>Create</button>
                    </footer>
                </div>
            </Modal>
        </>
    )
}

export default Customize