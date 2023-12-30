import React, { useState } from 'react'
import Styles from "../../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/ChecklistListing/Reports.module.css"
import CloseIcon from '../../../../assets/Clonos Common Indicators/Icon_Components/CloseIcon'
import { ClonosButton } from '../../../../components/CommonComponents/Button/Button'
import DynamicDropdown from '../../../../components/CommonComponents/DynamicDropdown/DynamicDropdown'
import ClonosInput from '../../../../components/CommonComponents/ClonosInput/ClonosInput'
import { ClonosToggleButton } from '../../../../components/CommonComponents/ClonosToggleButton/ClonosToggleButton'
import ClonosSelect from '../../../../components/CommonComponents/ClonosSelect/ClonosSelect'

const Reports = ({ closeModalMethod }) => {
    const [lcReportDetails, setLcReportDetails] = useState({})
    const [isRecurring, setIsRecurring] = useState(false)

    const handleGetDetails = (props) => {
        console.log('props:', props)
    }
    return (
        <div aria-label='Report generation' className={Styles.checklist_reports}>
            <header><span>Generate Report</span><CloseIcon tooltipTitle="Close" onClick={closeModalMethod} /></header>
            <section className={Styles.checklist_reports_body}>
                <DynamicDropdown
                    // handleGetErrorMethods={handleGetErrorMethods}
                    title={"Checklist Name"}
                    labelActivator={"Checklist Name"}
                    heading={"Checklist"}
                    placeholder={"Search"}
                    isSearchable={true}
                    isCheckbox={false}
                    isDynamicLoad={false}
                    data={[{ name: "check1" }, { name: "check1" }, { name: "check1" }, { name: "check1" }]}
                    isActivator={true}
                    isMandatory={false}
                    handleGetValues={handleGetDetails}
                />
                <div className={Styles.checklist_reports_startDate_and_endDate}>
                    <ClonosInput
                        type="date"
                        placeholder="12/13/1999"
                        label="Start Date"
                        isLabel={true}
                        isMandatory={true}
                        uniqueKey={"startDate"}
                        areaLabel='input'
                        handleGetValues={handleGetDetails}
                    />
                    <ClonosInput
                        type="date"
                        placeholder="12/13/1999"
                        label="End Date"
                        isLabel={true}
                        isMandatory={true}
                        uniqueKey={"endDate"}
                        areaLabel='input'
                        handleGetValues={handleGetDetails}
                    />
                </div>
                <ClonosButton isHollow={true}>Format</ClonosButton>
                <div className={Styles.checklist_reports_isRecurring}>
                    <span>Is Recurring</span>
                    <ClonosToggleButton isOn={isRecurring} turnOffMethod={setIsRecurring} setFormData={setLcReportDetails} />
                </div>
                <div className={Styles.checklist_reports_isRecurring_options}>
                    <ClonosSelect
                        placeholder="Select"
                        label="Frequency"
                        isLabel={true}
                        isMandatory={true}
                        options={
                            [{ label: "Not Mentioned", value: "Not Mentioned", isNeeded: true }, { label: "Not Mentioned", value: "Not Mentioned", isNeeded: true },]
                        }
                    />
                    <ClonosInput
                        type="number"
                        isMandatory={true}
                        isLabel={true}
                        label="Every"

                    />
                </div>
            </section>
            <footer>
                <ClonosButton isHollow={true}>Cancel</ClonosButton>
                <ClonosButton>Generate Report</ClonosButton>
            </footer>
        </div>
    )
}

export default Reports