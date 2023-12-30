import { memo } from "react"
import Styles from "../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/TemplateCreationPage.module.css"
import { useState } from "react"
const NumberComponent = ({getFieldDetails}) => {
    const [numberDetails,setNumberDetails] = useState({})
    const handleChange = (e) => {
        const {name,value} = e.target;
        setNumberDetails((prev) => {
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
            <input name="fieldValue" type="number" onChange={handleChange} placeholder="Add Number"/>
        </div>
    </>
}

export default memo(NumberComponent)