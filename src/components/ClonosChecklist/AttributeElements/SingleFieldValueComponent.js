import { memo, useEffect, useState } from "react"
import Styles from "../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/TemplateCreationPage.module.css"
const SingleFieldValueComponent = ({attributes,getFieldDetails,attribute}) => {
    const [fieldDetails,setFieldDetails] = useState({});
    const [showError,setShowError] = useState(false)
    const handleChange = (e) => {
        const {name,value} = e.target;
        setFieldDetails((prev) => {
            let temp = {
                ...prev,
                [name]:value
            }
            getFieldDetails(temp)
            return temp
        })
    }


    return <>
        <div className={Styles.fieldNameTaker}>
            <input value={attribute?.fieldName || ""} onBlur={() => setShowError(true)} name="fieldName" onChange={handleChange} placeholder="Add Name"/>
            {showError && !fieldDetails?.fieldName && <p className={Styles.required}>Plese fill this field.</p>}
        </div>
        <div className={Styles.fieldValueTaker}>
            <input value={attribute?.fieldValue || ""} type={attribute?.attributeName.toLowerCase()} name="fieldValue" onChange={handleChange} placeholder={`Add ${attribute?.attributeName}`}/>
        </div>
    </>
}

export default memo(SingleFieldValueComponent)