import React from 'react'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleUpdateLayoutDelaySetter, updateLayout } from '../../../../utils/clonosCommon';
import Styles from "../../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/ChecklistCreationPage.module.css"
import { CreateChecklistGeneralDetails } from '../../../../components/ClonosChecklist/CreateChecklistGeneralDetails';
import { useLocation } from 'react-router-dom';


const ChecklistCreatePage = () => {
    // Global States 
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
    const LOCATION = useLocation();
    const { state } = LOCATION;


    // Local States
    const [lcIntervals, setLcIntevals] = useState({});
    const [lcValues, setLcValues] = useState({});
    const dispatch = useDispatch()


    useEffect(() => {
        // Update the layout based on dispatch action.
        updateLayout({ dispatch });
        setLcIntevals({ ...lcIntervals, "updateLayoutInterval": handleUpdateLayoutDelaySetter({ dispatch }) })
    }, [])
    return (
        <div className={Styles.checklist_main_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
            {/* <nav className={Styles.checklist_nav}  >
            </nav> */}
            <section aria-level={"Parent section of the input body section."} className={Styles.checklist_content_container}>
                <div aria-label="All input fields for getting the data from the form.">
                    <CreateChecklistGeneralDetails mode={state?.mode} />
                    
                </div>
            </section>
        </div>
    )
}

export default React.memo(ChecklistCreatePage)