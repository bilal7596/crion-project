import { memo, useState } from "react"
import Styles from "../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/TemplateCreationPage.module.css"
const DateComponent = ({getFieldDetails}) => {
    const [dateDetails,setDateDetails] = useState({})
    const handleChange = (e) => {
        const {name,value} = e.target;
        setDateDetails((prev) => {
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
            <input name="fieldName" onChange={handleChange} placeholder="Add Name"/>
        </div>
        <div className={Styles.fieldValueTaker}>
            <input name="fieldValue" type="date" onChange={handleChange} placeholder="Add Date"/>
        </div>
    </>
}

export default memo(DateComponent)