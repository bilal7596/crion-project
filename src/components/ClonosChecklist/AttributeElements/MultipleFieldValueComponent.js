import Styles from "../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/TemplateCreationPage.module.css";
import { v4 as uuidv4 } from 'uuid';
import TEMPLATE_CREATION_REMOVEROW from "../../../assets/UIUX/icons/Checklist/circle-minus.svg";
import TEMPLATE_CREATION_CIRCLEPLUS from "../../../assets/UIUX/icons/Checklist/circle-plus.svg";
import { useEffect, useState } from "react";
export const MultipleFieldValueComponent = ({getFieldDetails,attribute}) => {
    const [multiChoiceDetails,setMultiChoiceDetails] = useState({});
    const [showError,setShowError] = useState(false)
    const [options,setOptions] = useState()
    const handleAddOptions = () => {
        // setOptions((prev) => ([
        //     ...prev,
        //     {optionId:uuidv4(),optionValue:""}
        // ]))
        getFieldDetails({...attribute,fieldValue:[...attribute?.fieldValue,{optionId:uuidv4(),optionValue:""}]})
    }

    const handleRemoveOption = (id) => {
        if(attribute?.fieldValue?.length > 1){
            const newOptions = attribute?.fieldValue?.filter((option) => option?.optionId !== id)
            getFieldDetails({...attribute,fieldValue:newOptions})
        }
    }

    const handleChange = (e,optionId) => {
        const {name,value} = e.target;
        if(name === "fieldName"){
            // setMultiChoiceDetails((prev) => {
            //     let temp = {
            //         ...prev,
            //         [name] : value
            //     }
            //     getFieldDetails(temp)
            //     return temp
            // })
            getFieldDetails({...attribute,fieldName:value})
        } else if(name === "fieldValue"){
            let updatedOptions = attribute?.fieldValue?.map((option) => {
                if(option?.optionId === optionId){
                    return {...option,optionValue:value}
                } else {
                    return option
                }
            })
            // setOptions(updatedOptions)
            // setMultiChoiceDetails((prev) => {
            //     let temp = {
            //         ...prev,
            //         fieldValue:updatedOptions,
            //     }
            //     getFieldDetails(temp);
            //     return temp
            // })
            getFieldDetails({...attribute,fieldValue:updatedOptions})
        }
    }
    // useEffect(() => {
    //  getFieldDetails(multiChoiceDetails)
    // },[])
    return <>
        <div className={Styles.fieldNameTaker}>
            <input value={attribute?.fieldName || ""} onBlur={() => setShowError(true)} name="fieldName" onChange={(e) => handleChange(e)} placeholder="Add Name"/>
            {showError && !attribute?.fieldName && <p className={Styles.required}>Plese fill this field.</p>}
        </div>
        <div className={Styles.fieldValueTaker}>
        <div className={Styles.multiple_fieldvalue_taker_container}>
            {
                attribute?.fieldValue?.map((option,index) => (
                    <div className={Styles.option_box} key={option?.optionId}>
                        <input value={option?.optionValue} name="fieldValue" onChange={(e) => handleChange(e,option?.optionId)} placeholder={`Option-${index+1}`}/>
                        {
                            attribute?.fieldValue?.length > 1 && <div className={Styles.remove_option} onClick={() => handleRemoveOption(option?.optionId)}>
                            <img src={TEMPLATE_CREATION_REMOVEROW}/>
                        </div>
                        }
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