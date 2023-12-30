import React, { useEffect } from 'react'
import { useState } from 'react'
import Styles from "../../ModuleStyles/Documents/DocumentsList.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import NeedToFilterComp from '../CommonComponents/FilterInput/NeedToFilterComp'
import searchIcon from "../../assets/UIUX/icons/search (1).svg"
import selectDownArrowIcon from "../../assets/UIUX/icons/chevron-down.svg"
import DocumentsListTable from './DocumentsListTable'
import Pagination from '../CommonComponents/Pagination/Pagination'
import { handleDeleteDocuments, handleDownloadDocument, handleGetDocuments, handleGetDocumentsStatus, handleGetDocumentsType } from '../../utils/DocumentMethods/documentMethods'
import { SelectPicker } from 'rsuite'
import DateComp from '../CommonComponents/Date/DateComp'
import { getToken, handleGetWidthDynamicallyBasedOnWindowWidth, handleLoggedInUser, updateLayout ,loginJumpLoadingStopper} from '../../utils/clonosCommon'
import Modal from '../CommonComponents/Modal/Modal'
import arrowAngleIcon from "../../assets/UIUX/icons/arrows-angle-expand.svg"
import closeModalIcon from "../../assets/UIUX/icons/x-circle-fill.svg"
import { UnAuthorizedModal } from '../CommonComponents/UnAuthorizedPage/UnAuthorizedModal'
import { documentActions } from '../../Store/Reducers/ClonosDocumentReducer'
import No_image_available from "../../assets/images/No_image_available.png"
import configs from '../../config'
import MenuController from '../WorkOrder/Menu'
import Menubar from '../CommonComponents/Menubar/Menubar'
import { Container } from '@material-ui/core'
import useToggler from '../../CustomHooks/TogglerHook'


const DocumentsList = () => {
    // Data Management States
    const { documentTypesDropdownTooltipState, documentStatusDropdownTooltipState, documentsTooltipState } = useSelector(store => store.documentData)
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
    console.log('mainLayoutChildrenPositionsToolkitState:', mainLayoutChildrenPositionsToolkitState)

    // Local States 
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isModal, setIsModal] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalDocuments, setTotalDocuments] = useState(1)
    const [needToFilter, setNeedToFilter] = useState({ ["use"]: false })
    const [documentTypesDropdownData, setDocumentTypesDropdownData] = useState([])
    const [documentStatusDropdownData, setDocumentStatusDropdownData] = useState([])
    const [selectedDoc, setSelectedDoc] = useState({})
    const [menuClosure, setMenuClosure] = useState(null)
    const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")


    useEffect(() => {
        let interval = loginJumpLoadingStopper({ setterFunction: setIsLocalLoading, timeout: 5000 })
        return () => {
            clearInterval(interval)
        }
    }, [])



    const handleGetValue = ({ event, keyName }) => {
        console.log('event:', event)
        let parsedData = JSON.parse(event)
        setNeedToFilter((prev) => {
            let updatedValues = { ...prev, [keyName]: parsedData?.label };
            console.log('updatedValues:', updatedValues)
            debouncedHandleGetDocuments(updatedValues)
            return updatedValues
        })
    }

    const getSelectedValue = (values) => {
        console.log('values:', values)
        setNeedToFilter((prev) => {
            let updatedValues = { ...prev, ["status"]: values };
            console.log('updatedValues:', updatedValues)
            debouncedHandleGetDocuments(updatedValues)
            return updatedValues
        })
    }

    const handleGotoDV = ({ ele }) => { // DV stands for Document View
        console.log('eleDoc:', ele)
        setSelectedDoc(ele)
        if (ele.extension == "png" || ele.extension == "jpg") {
            setIsModal(true)
        }
        else {
            const token = getToken();
            window.open(`${configs.url}/?docId=${ele.docId}&token=${token}`);
        }
    }

    const handleGetDocumentsBasedOnFilter = (filteredData) => {
        setNeedToFilter({ ...needToFilter, use: true })
        for (let key in filteredData) {
            if (filteredData[key] == "" || (filteredData?.status == "All")) delete filteredData[key]
        }
        setNeedToFilter(filteredData)
        console.log('filteredData:', filteredData)
        handleGetDocuments({ dispatch, documentActions, setTotalDocuments, currentPage, setCurrentPage, payload: filteredData });
    }

    useEffect(() => {

        if (needToFilter.use == false) {
            // Fetch work order data based on the current page
            handleGetDocuments({ dispatch, payload: {}, documentActions, setTotalDocuments, currentPage, setCurrentPage, setTotalDocuments });
        }
        // Check if the workOrderPriorityDropdownToolkitState is empty, and if it is, fetch priority dropdown data
        if (!documentTypesDropdownData?.length) {
            handleGetDocumentsType({ dispatch, documentActions });
        }
        if (!documentStatusDropdownData?.length) {
            handleGetDocumentsStatus({ dispatch, documentActions })
        }

        if (documentTypesDropdownTooltipState.length > 0 && documentTypesDropdownData.length == 0) {        // Map the documentStatusDropdownData to the format expected by the dropdown
            // Map the documentTypesDropdownData to the format expected by the dropdown
            let updatedTypes = documentTypesDropdownTooltipState?.map((item) => {
                return { label: item.docType, value: JSON.stringify({ value: item.docTypeId, label: item.docType }) };
            });
            // Set the updated documentTypesDropdownData to the state
            setDocumentTypesDropdownData(updatedTypes);
        }

        if (documentStatusDropdownTooltipState.length > 0 && documentStatusDropdownData.length == 0) {        // Map the documentStatusDropdownData to the format expected by the dropdown
            let updatedStatus = documentStatusDropdownTooltipState?.map((item) => {
                return { label: item.approval_status, value: JSON.stringify({ value: item.approval_statusId, label: item.approval_status }) };
            });
            // Set the updated documentStatusDropdownData to the state
            setDocumentStatusDropdownData(updatedStatus);
        }


    }, [currentPage]);

    const handleGetDataBasedOnPagination = () => {
        console.log('currentPage:', currentPage)
        handleGetDocuments({ payload: needToFilter, dispatch, documentActions, currentPage, setCurrentPage, setTotalDocuments });
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

    const debouncedHandleGetDocuments = debounce(handleGetDocumentsBasedOnFilter, 300);

    useEffect(() => {
        updateLayout({ dispatch })

        // Cleanup the debounced function on unmount to prevent memory leaks
        return () => {
            clearTimeout(debouncedHandleGetDocuments);
        };
    }, []);


    const getIsOpenMethod = (isOpenMethod) => {
        console.log('isOpenMethod:', isOpenMethod)
        setMenuClosure(isOpenMethod)
    }

    if (handleLoggedInUser()?.permissions?.includes('doc005'))
        return (
            <>
                <div className={Styles.documents_list_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
                    <nav className={Styles.dl_nav} /** wol = work_order_list */ >
                        <span>Document list</span>
                        <div>
                            {
                                handleLoggedInUser()?.permissions?.includes("wko001") && <button onClick={() => navigate('/create-document')}>Upload Document</button>
                            }
                        </div>
                    </nav>
                    <section className={Styles.dl_body_container}>
                        <section className={Styles.dl_body}>
                            {/* <nav className={Styles.dl_filters}>
                                <NeedToFilterComp handleGetValueForDebounce={debouncedHandleGetDocuments} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} placeholder="Document Name" name="documentTitle" url={searchIcon} />
                                <NeedToFilterComp handleGetValueForDebounce={debouncedHandleGetDocuments} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} placeholder="Asset Name" name="assetName" url={searchIcon} />
                                <div>
                                    <SelectPicker placeholder="Status" onChange={(event) => handleGetValue({ event, keyName: "status" })} data={documentStatusDropdownData} className={`custom-select-picker ${Styles.dl_filters_select_picker}`} />
                                    <img src={selectDownArrowIcon} alt='down' />
                                </div>
                                <div>
                                    <SelectPicker placeholder="Document Type" onChange={(event) => handleGetValue({ event, keyName: "documentType" })} data={documentTypesDropdownData} className={`custom-select-picker ${Styles.dl_filters_select_picker}`} />
                                    <img src={selectDownArrowIcon} alt='down' />
                                </div>
                                <DateComp handleGetValueForDebounce={debouncedHandleGetDocuments} filteredKeys={needToFilter} updateFilteredKeysMethod={setNeedToFilter} label={"Uploaded Date"} name="uploadedDate" url={searchIcon} />
                            </nav> */}
                            <DocumentsListTable handleGotoDV={handleGotoDV} tableData={documentsTooltipState} setTotalDocuments={setTotalDocuments} currentPage={currentPage} setCurrentPage={setCurrentPage} needToFilter={needToFilter} />
                            <footer className={Styles.dl_footer}>
                                {
                                    totalDocuments > 6 && <Pagination length={Math.ceil(totalDocuments / 6)} activePage={currentPage} updateMethod={setCurrentPage} totalPage={Math.ceil(totalDocuments / 6)} handleGetDataBasedOnPagination={handleGetDataBasedOnPagination} />
                                }
                            </footer>
                        </section>
                    </section>
                </div>
                <Modal isOpen={isModal} closeModalMethod={setIsModal}>
                    <div style={{ width: handleGetWidthDynamicallyBasedOnWindowWidth({ widthInPercentage: 95 }) }} className={Styles.dl_document_view}>
                        <header className={Styles.dl_document_view_c1}>
                            <div className={Styles.dl_DVC1_left}>
                                <div className={Styles.dl_DVC1_document_name}>
                                    <span>{selectedDoc?.documentTitle}</span>
                                </div>
                                <div className={Styles.dl_DVC1_details}>
                                    <div>
                                        <span>Uploaded On:</span>
                                        <span>{selectedDoc?.createdDate ? selectedDoc?.createdDate?.split("T")[0] : "NULL"}</span>
                                    </div>
                                    <div>
                                        <span>Uploaded By:</span>
                                        <span>{selectedDoc?.uploadedBy?.name ? selectedDoc?.uploadedBy?.name : "NULL"}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={Styles.dl_DVC1_right}>
                                <div>
                                    <img src={arrowAngleIcon} alt='Actions' />
                                    <Menubar as={"button"} label={"Actions"} getIsOpenMethod={getIsOpenMethod} isDropdown={false}
                                        style={{
                                            display: "flex",
                                            width: "5.375rem",
                                            height: "2.25rem",
                                            padding: "0.5rem 0.75rem",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            gap: "0.625rem",
                                            borderRadius: " 0.375rem",
                                            border: "1px solid var(--foundation-blue-blue-500, #06337E)",
                                            background: "var(--foundation-white-white-50, #FFF)",

                                            color: "var(--foundation-blue-blue-500, #06337E)",
                                            fontFamily: "Roboto",
                                            fontSize: "0.75rem",
                                            fontStyle: "normal",
                                            fontWeight: "600",
                                            lineHeight: "normal",
                                        }} icon={searchIcon}>
                                        <button onClick={() => {
                                            handleDeleteDocuments({ dispatch, documentActions, isMultipleDelete: false, docId: selectedDoc?.docId, currentPage, setCurrentPage, setTotalDocuments, needToFilter })
                                            setIsModal(false)
                                        }}>Delete</button>
                                        <button onClick={() => {
                                            handleDownloadDocument({ dispatch, docId: selectedDoc?.docId })
                                            menuClosure?.setIsOpen(false)
                                        }}>Download</button>
                                    </Menubar>
                                </div>
                                <div>
                                    <img src={closeModalIcon} onClick={() => setIsModal(false)} alt='Modal Close Button' />
                                </div>
                            </div>
                        </header>
                        <section className={Styles.dl_document_view_c2}>
                            <div className={Styles.dl_document_view_body}>
                                <img src={selectedDoc?.path ? selectedDoc?.path : No_image_available} alt='Document Image' />
                            </div>
                        </section>
                    </div >
                </Modal >
            </>
        )
    return !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
        <Container component="main" maxWidth="sm">
            <UnAuthorizedModal />
        </Container>
}

export default DocumentsList