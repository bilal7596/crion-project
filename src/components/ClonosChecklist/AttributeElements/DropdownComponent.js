import Styles from "../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/TemplateCreationPage.module.css";
import { v4 as uuidv4 } from 'uuid';
import TEMPLATE_CREATION_REMOVEROW from "../../../assets/UIUX/icons/Checklist/circle-minus.svg";
import TEMPLATE_CREATION_CIRCLEPLUS from "../../../assets/UIUX/icons/Checklist/circle-plus.svg";
import { useState } from "react";
export const DropdownComponent = ({getFieldDetails}) => {
    const [multiChoiceDetails,setMultiChoiceDetails] = useState({})
    const [options,setOptions] = useState([
        {optionId:uuidv4(),optionValue:"",isSelected:false},
    ])
    const handleAddOptions = () => {
        setOptions((prev) => ([
            ...prev,
            {optionId:uuidv4(),optionValue:"",isSelected:false}
        ]))
    }

    const handleRemoveOption = (id) => {
        setOptions(options?.filter((option) => option?.optionId !== id))
    }

    const handleChange = (e,optionId) => {
        const {name,value} = e.target;
        if(name === "fieldName"){
            setMultiChoiceDetails((prev) => {
                let temp = {
                    ...prev,
                    [name] : value
                }
                getFieldDetails(temp)
                return temp
            })
        } else if(name === "fieldValue"){
            let updatedOptions = options?.map((option) => {
                if(option.optionId === optionId){
                    return {...option,optionValue:value}
                } else {
                    return option
                }
            })
            setOptions(updatedOptions)
            setMultiChoiceDetails((prev) => {
                let temp = {
                    ...prev,
                    fieldValue:updatedOptions,
                }
                getFieldDetails(temp);
                return temp
            })
        }
    }
    return <>
        <div className={Styles.fieldNameTaker}>
            <input name="fieldName" onChange={(e) => handleChange(e)} placeholder="Add Name"/>
        </div>
        <div className={Styles.fieldValueTaker}>
        <div className={Styles.multiple_fieldvalue_taker_container}>
            {
                options?.map((option,index) => (
                    <div className={Styles.option_box} key={option?.optionId}>
                        <input name="fieldValue" onChange={(e) => handleChange(e,option?.optionId)} placeholder={`Option-${index+1}`}/>
                        <div className={Styles.remove_option} onClick={() => handleRemoveOption(option?.optionId)}>
                            <img src={TEMPLATE_CREATION_REMOVEROW}/>
                        </div>
                    </div>
                ))
            }
            <div className={Styles.add_option_container}>
                <div onClick={handleAddOptions}>
                    <div><img src={TEMPLATE_CREATION_CIRCLEPLUS}/></div>
                    <p>Add Option</p>
                </div>
            </div>
        </div>
        </div>
    </>
}