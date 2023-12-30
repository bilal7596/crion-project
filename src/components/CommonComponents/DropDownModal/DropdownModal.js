import { CloseOutlined } from "@material-ui/icons"
import Modal from "../Modal/Modal"
import Styles from "./DropdownModal.module.css";
import SEARCHICON from "../../../assets/UIUX/icons/search (1).svg"
import { memo, useCallback, useState } from "react";
import { handleDeselectValue, handleSelectvalue } from "../../../utils/clonosCommon";
const DropdownModal = ({isOpen,closeModalMethod,type,title,width,isSearchable,searchPlaceHolder,data,multiSelect,formData,setFormData,handelSearch,updateLocalData,changedData,updateChangedData}) => {
    const [selectedValue,setSelectedValue] = useState(null) 
    
    const handelItemClick = useCallback((item) => {
        handleSelectvalue({item:item,setFormData,type,multiSelect,formData,updateLocalData,changedData,updateChangedData})
        if(!multiSelect){
            closeModalMethod()
        }
        console.log(item,"item...")
    },[type,multiSelect])
    console.log(formData,"from>>>")
    return <Modal isOpen={isOpen} closeModalMethod={closeModalMethod}>
            <div style={{width,margin:"auto"}} className={Styles.container}>
                <div className={Styles.header}>
                    <h4>{title}</h4>
                    <div className={Styles.iconContainer} onClick={closeModalMethod}>
                        <CloseOutlined fontSize="large"/>
                    </div>
                </div>
                {
                    isSearchable ? <div className={Styles.modalSearchBar}>
                        <div>
                            <img src={SEARCHICON}/>
                        </div>
                        <input onChange={handelSearch} placeholder={searchPlaceHolder || "Search"}/>
                    </div> : <></>
                }
                {
                    data?.length ? <div style={{maxHeight:"600px",overflowY:"scroll"}} className={Styles.listContainer}>
                        {
                            data?.map((item) => {
                                console.log(item,"fie")
                                return <div onClick={() => handelItemClick(item?.value)}  className={Styles.listItem}>
                                    {
                                        multiSelect ? <input checked={Object.keys(formData)?.length ? formData[type]?.some(field => field?.id === item?.value?.id) : false}   style={{width:"16px"}} type="checkbox"/> : <></>
                                    }
                                    <div>{item?.label}</div>
                                    {
                                        !multiSelect && formData[type]?.id === item?.value?.id ? <div onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeselectValue({item:item,setFormData,type,multiSelect,formData})
                                        }} className={Styles.closeIconContainer}><CloseOutlined fontSize="small" /></div> : <></>
                                    }
                                </div>
                            })
                        }
                    </div> : <>
                        <p>No results found !</p>
                    </>
                }
            </div>
    </Modal>
}

export default memo(DropdownModal)