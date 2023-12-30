import React, { useEffect } from 'react'
import Styles from "../../ModuleStyles/Notifications/NotificationsList.module.css"
import NeedToFilterComp from '../CommonComponents/FilterInput/NeedToFilterComp'
import { useState } from 'react'
import { notificationActions } from '../../Store/Reducers/ClonosNotificationsReducer'
import { handleGetNotifications } from '../../utils/NotificationsMethods/NotificationsMethods'
import { useDispatch, useSelector } from 'react-redux'
import searchIcon from "../../assets/UIUX/icons/search (1).svg"
import selectDownArrowIcon from "../../assets/UIUX/icons/chevron-down.svg"

import { Pagination, SelectPicker } from 'rsuite'
import DateComp from '../CommonComponents/Date/DateComp'
import { handleLoggedInUser, loginJumpLoadingStopper, updateLayout } from '../../utils/clonosCommon'
import NotificationsListTable from './NotificationsListTable'
import useToggler from '../../CustomHooks/TogglerHook'
import { Container } from '@material-ui/core'
import { UnAuthorizedModal } from '../CommonComponents/UnAuthorizedPage/UnAuthorizedModal'

// Dummy Data 
let tableData = [
    {
        notId: "abc1",
        siNo: 1,
        alarmName: "Presure Guage",
        createdOn: "12/03/1999",
        asset: {
            name: "Loreum",
            id: "qwerty123456"
        },
        status: "Completed",
        description: "This is notification description",
        urgencyLevel: {
            name: "Critical",
            id: "qwerty123456"
        },
        personInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        },
        alternateInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        }
    },
    {
        notId: "abc2",
        siNo: 1,
        alarmName: "Presure Guage",
        createdOn: "12/03/1999",
        asset: {
            name: "Loreum",
            id: "qwerty123456"
        },
        status: "Completed",
        description: "This is notification description",
        urgencyLevel: {
            name: "Critical",
            id: "qwerty123456"
        },
        personInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        },
        alternateInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        }
    },
    {
        notId: "abc3",
        siNo: 1,
        alarmName: "Presure Guage",
        createdOn: "12/03/1999",
        asset: {
            name: "Loreum",
            id: "qwerty123456"
        },
        status: "Completed",
        description: "This is notification description",
        urgencyLevel: {
            name: "Critical",
            id: "qwerty123456"
        },
        personInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        },
        alternateInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        }
    },
    {
        notId: "abc3",
        siNo: 1,
        alarmName: "Presure Guage",
        createdOn: "12/03/1999",
        asset: {
            name: "Loreum",
            id: "qwerty123456"
        },
        status: "Completed",
        description: "This is notification description",
        urgencyLevel: {
            name: "Critical",
            id: "qwerty123456"
        },
        personInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        },
        alternateInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        }
    },
    {
        notId: "abc3",
        siNo: 1,
        alarmName: "Presure Guage",
        createdOn: "12/03/1999",
        asset: {
            name: "Loreum",
            id: "qwerty123456"
        },
        status: "Completed",
        description: "This is notification description",
        urgencyLevel: {
            name: "Critical",
            id: "qwerty123456"
        },
        personInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        },
        alternateInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        }
    },
    {
        notId: "abc3",
        siNo: 1,
        alarmName: "Presure Guage",
        createdOn: "12/03/1999",
        asset: {
            name: "Loreum",
            id: "qwerty123456"
        },
        status: "Completed",
        description: "This is notification description",
        urgencyLevel: {
            name: "Critical",
            id: "qwerty123456"
        },
        personInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        },
        alternateInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        }
    },
    {
        notId: "abc3",
        siNo: 1,
        alarmName: "Presure Guage",
        createdOn: "12/03/1999",
        asset: {
            name: "Loreum",
            id: "qwerty123456"
        },
        status: "Completed",
        description: "This is notification description",
        urgencyLevel: {
            name: "Critical",
            id: "qwerty123456"
        },
        personInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        },
        alternateInCharge: {
            name: "Stephen",
            id: "qwerty123456"
        }
    },
]

const NotificationsList = () => {
    // Global Data States 
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
    // Local States 
    const dispatch = useDispatch()
    const [currentPage, setCurrentPage] = useState(1)
    const [totalNotifications, setTotalNotifications] = useState(1)
    const [needToFilter, setNeedToFilter] = useState({ ["use"]: false })
    const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")


    useEffect(() => {
      let interval = loginJumpLoadingStopper({ setterFunction: setIsLocalLoading, timeout: 5000 })
      return () => {
        clearInterval(interval)
      }
    }, [])





    console.log('mainLayoutChildrenPositionsToolkitState:', mainLayoutChildrenPositionsToolkitState)

    const handleGetValue = ({ event, keyName }) => {
        console.log('event:', event)
        let parsedData = JSON.parse(event)
        setNeedToFilter((prev) => {
            let updatedValues = { ...prev, [keyName]: parsedData?.label };
            console.log('updatedValues:', updatedValues)
            debouncedHandleGetNotifications(updatedValues)
            return updatedValues
        })
    }

    const getSelectedValue = (values) => {
        console.log('values:', values)
        setNeedToFilter((prev) => {
            let updatedValues = { ...prev, ["status"]: values };
            console.log('updatedValues:', updatedValues)
            debouncedHandleGetNotifications(updatedValues)
            return updatedValues
        })
    }

    // const handleGotoDV = ({ ele }) => { // DV stands for Document View
    //     console.log('eleDoc:', ele)
    //     setSelectedDoc(ele)
    //     if (ele.extension == "png" || ele.extension == "jpg") {
    //         setIsModal(true)
    //     }
    //     else {
    //         const token = getToken();
    //         window.open(`${configs.url}/?docId=${ele.docId}&token=${token}`);
    //     }
    // }


    const handleGetNotificationsBasedOnFilter = (filteredData) => {
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

    const debouncedHandleGetNotifications = debounce(handleGetNotificationsBasedOnFilter, 300);

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

    if (handleLoggedInUser()?.permissions?.includes('ntf005')) {
        return (
            <div className={Styles.notifications_list_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
                <nav className={Styles.nl_nav} /** nl = notificaitons_list */ >
                    <span>Prioritization</span>
                    <div>
                        {
                            // handleLoggedInUser()?.permissions?.includes("wko001") && <button onClick={() => navigate('/create-document')}>Upload Document</button>
                        }
                    </div>
                </nav>
                <section className={Styles.nl_main_body}>
                    <section className={Styles.nl_body}>
                        {/* <nav className={Styles.nl_filters}>
                            <NeedToFilterComp handleGetValueForDebounce={debouncedHandleGetNotifications} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} placeholder="Document Name" name="documentTitle" url={searchIcon} />
                            <NeedToFilterComp handleGetValueForDebounce={debouncedHandleGetNotifications} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} placeholder="Asset Name" name="asset" url={searchIcon} />
                            <div>
                            <SelectPicker placeholder="Status" onChange={(event) => handleGetValue({ event, keyName: "status" })} data={[]} className={`custom-select-picker ${Styles.nl_filters_select_picker}`} />
                            <img src={selectDownArrowIcon} alt='down' />
                        </div>
                            <div>
                            <SelectPicker placeholder="Document Type" onChange={(event) => handleGetValue({ event, keyName: "documentType" })} data={[]} className={`custom-select-picker ${Styles.nl_filters_select_picker}`} />
                            <img src={selectDownArrowIcon} alt='down' />
                        </div>
                            <DateComp handleGetValueForDebounce={debouncedHandleGetNotifications} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} label={"Uploaded Date"} name="uploadedDate" url={searchIcon} />
                        </nav> */}
                        <NotificationsListTable handleGotoDV={""} tableData={tableData} setTotalNotifications={setTotalNotifications} currentPage={currentPage} setCurrentPage={setCurrentPage} needToFilter={needToFilter} />
                        <footer className={Styles.nl_footer}>
                            {
                                totalNotifications > 6 && <Pagination length={Math.ceil(totalNotifications / 6)} activePage={currentPage} updateMethod={setCurrentPage} totalPage={Math.ceil(totalNotifications / 6)} handleGetDataBasedOnPagination={handleGetDataBasedOnPagination} />
                            }
                        </footer>
                    </section>
                </section>
            </div>
        )
    }
    return !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
        <Container component="main" maxWidth="sm">
            <UnAuthorizedModal />
        </Container>
}

export default NotificationsList