import React, { useEffect, useState } from 'react'
import Styles from "../../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/ChecklistListing/ChecklistListing.module.css"
import Subbar from '../../../../components/WorkOrder/Subbar'
import { useSelector } from 'react-redux';
import CommonNavigator from '../../../../components/CommonComponents/Navigator/Navigator';
import { handleGetChecklist, handleToggleBetweenChecklistOrTemplateLibrary } from '../../../../utils/ChecklistAndReportsMethods/ChecklistMethod';
import ChecklistListingTable from './ChecklistListingTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleGetHeightOrWidthBasedOnId } from '../../../../utils/clonosCommon';
import Modal from '../../../../components/CommonComponents/Modal/Modal';
import Reports from './Reports';

const ChecklistListing = () => {
    // Global States 
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
    console.log('mainLayoutChildrenPositionsToolkitState:', mainLayoutChildrenPositionsToolkitState)

    // Local States
    let navigatorValues = [
        { value: "Checklist", status: true },
        { value: "Template Library", status: false },
    ];
    const [toggleBetweenChecklistOrTemplateLibrary, setToggleBetweenChecklistOrTemplateLibrary] = useState("Checklist");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [checklistData, setChecklistData] = useState([])
    const [isGenerateReport, setIsGenerateReport] = useState(false)
    console.log('checklistData:', checklistData)


    // Local Handlers
    const handleToggleBetweenChecklistOrTemplateLibrary = (props) => {
        setToggleBetweenChecklistOrTemplateLibrary(props)
    }

    const handleGotoChecklistCreate = () => {
        navigate('/create-checklist-generaldetails')
    }


    useEffect(() => {
        handleGetChecklist({ dispatch, responseSetterMethod: setChecklistData })  // Get all the Checklists
    }, [])

    return (
        <>
            <div className={Styles.checklistListing_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
                <nav className={Styles.checklist_listing_nav} /** c = customize */ >
                    <Subbar buttons={
                        [
                            {
                                buttonMethod: handleGotoChecklistCreate,
                                isHollow: false,
                                buttonText: "Create Checklist",
                                isActive: true
                            },
                            {
                                buttonMethod: () => setIsGenerateReport(true),
                                isHollow: false,
                                buttonText: "Generate Reports",
                                isActive: true
                            }
                        ]
                    }
                    />
                </nav>
                <section className={Styles.checklist_listing_content_container} style={{ height: `${mainLayoutChildrenPositionsToolkitState?.remUnit?.remainingPart?.height?.split("r")[0] - 4.375}rem` }}>
                    <div className={Styles.checklist_listing_content_body} id='checklist_listing_content_body'>
                        <CommonNavigator values={navigatorValues} getSelectedValue={handleToggleBetweenChecklistOrTemplateLibrary} />
                        <div className={Styles.checklist_listing_child_wrapper} style={{ width: `${handleGetHeightOrWidthBasedOnId({ idName: "checklist_listing_content_body" }).width}px` }}>
                            {
                                toggleBetweenChecklistOrTemplateLibrary === "Checklist" && <ChecklistListingTable lcDataSetterMethod={setChecklistData} tableData={checklistData.length > 0 ? checklistData : []} />
                            }
                        </div>
                    </div>
                </section>
            </div>
            <Modal isOpen={isGenerateReport} closeModalMethod={setIsGenerateReport}>
                <Reports closeModalMethod={setIsGenerateReport} />
            </Modal>
        </>
    )
}

export default React.memo(ChecklistListing)

