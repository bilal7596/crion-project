import { memo } from "react"
import Styles from "../../../ModuleStyles/Assets/assetParameters.module.css"
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";
import PARAMETER_CREATION_REMOVEROW from "../../../assets/UIUX/icons/Checklist/circle-minus.svg";
import { restrictSpecialCharacters } from "../../../utils/clonosCommon";

const EditAssetParameters = ({getData,data,getChangedValues,changedData}) => {
    const [assetParameters,setAssetParameters] = useState([]);
    const [assetParametersToDelete,setAssetParametersToDelete] = useState([]) 
    const handleChange = (e,parameterId) => {
        const {name,value} = e.target;
        const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
        const newValue = restrictSpecialCharacters({value,specialCharacters})
        setAssetParameters((prev) => {
            let temp = assetParameters?.map((param) => {
                if(param?.assetParameterId === parameterId){
                    let tempParam = {
                        ...param,
                        [name] : newValue
                    }
                    return tempParam
                } else {
                    return param
                }
            })
            getData({...data,assetParameters:temp})
            getChangedValues({...changedData,assetParameters:temp})
            return temp
        })
    }
    const handleAddParameter = () => {
        let parameter = {
            assetParameterId:uuidv4(),
            name:"",
            description:"",
            unit:""
        }
        setAssetParameters((prev) => {
            let temp = [...prev,parameter]
            let tempData = {...data,assetParameters:temp}
            // getData(tempData)
            return temp
        })
    }

    const handleRemoveParameter = (param) => {
        // if(param?.isActive){
        //     setAssetParametersToDelete((prev) => {
        //         let temp = [...prev,param?.assetParameterId];
        //         let remainingParameters = assetParameters?.filter((prm) => prm?.assetParameterId !== param?.assetParameterId);
        //         getChangedValues({...changedData,assetParametersToDelete:temp,assetParameters:remainingParameters});
        //         return temp
        //     })
        // } else {
        //     setAssetParameters((prev) => {
        //         let remainingParameters = assetParameters?.filter((prm) => prm?.id !== param?.id);
        //         let tempData = {...data,assetParameters:remainingParameters}
        //         getData(tempData)
        //         return remainingParameters
        //     })
        // }
        setAssetParameters((prev) => {
            let remainingParameters = assetParameters?.filter((prm) => prm?.assetParameterId !== param?.assetParameterId);
            if(param?.isActive){
                getData({...data,assetParameters:remainingParameters})
                let assetParametersToDelete = changedData?.assetParametersToDelete?.length > 0 ? [...data?.assetParametersToDelete,param?.assetParameterId] : [param?.assetParameterId];
                getChangedValues({...changedData,assetParametersToDelete:assetParametersToDelete,assetParameters:remainingParameters})
            } else {
                getData({...data,assetParameters:remainingParameters})
            }
            return remainingParameters
        })
    }
    useEffect(() => {
        setAssetParameters(data?.assetParameters || [])
    },[])
    console.log(data,changedData,"params",assetParameters)
    return (
        <div aria-label="container to add parameters" className={Styles.ast_prms_contanier}>
            <div className={Styles.ast_prms_header}>
                <h4 className={Styles.ast_prms_header_title}>Technical Specifications</h4>
            </div>
            <div className={Styles.ast_prms_inner_container}>
                <div className={Styles.ast_prms_add_parameters}>
                    <div>
                        <span>+</span>
                        <span onClick={() => handleAddParameter()}>Add Parameter</span>
                    </div>
                </div>
                <div className={Styles.ast_prms_list_container}>
                    {
                        assetParameters?.map((parameter,index) => {
                            return <div key={parameter?.assetParameterId} className={Styles.ast_prms_single_param}>
                                <div className={Styles.ast_prms_paramname}>
                                    <input onChange={(e) => handleChange(e,parameter?.assetParameterId)} value={parameter?.name} name="name" placeholder={`Parameter ${index+1}`}/>
                                </div>
                                <div className={Styles.ast_prms_paramDesc}>
                                <input onChange={(e) => handleChange(e,parameter?.assetParameterId)} value={parameter?.description} name="description" placeholder="Description" />
                                </div>
                                <div className={Styles.ast_prms_paramUnit}>
                                <input onChange={(e) => handleChange(e,parameter?.assetParameterId)} value={parameter?.unit} name="unit"  placeholder="Units" />
                                </div>
                                <div onClick={() => handleRemoveParameter(parameter)}>
                                    <img src={PARAMETER_CREATION_REMOVEROW}/>
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default memo(EditAssetParameters) 
