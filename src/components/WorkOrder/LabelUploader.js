import React from 'react'
import Styles from "../../ModuleStyles/WorkOrder/WorkOrder.module.css"
import { useState } from 'react';
import { AiFillDelete } from "react-icons/ai"
import { handleDeleteWorkOrderDocument } from '../../utils/WorkOrderMethods/WorkOrderMethods';
import { commonActions } from '../../Store/Reducers/CommonReducer';
import { workOrderStateManagementActions } from '../../Store/Reducers/ClonosWorkOrderReducer';
import { useDispatch } from 'react-redux';


const LabelUploader = ({ label, name, type, handleGetValues, placeholder, defaultValue }) => {
    const dispatch = useDispatch()
    const [files, setFiles] = useState([]);

    console.log('defaultValue:', defaultValue)
    console.log(files)
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prev) => {
            let updatedFiles = [...prev, ...selectedFiles]
            console.log('updatedFiles:', updatedFiles)
            handleGetValues({ e, updatedFiles, type: "file" })
            return updatedFiles
        });
    };

    const handleFileDelete = (e, file) => {
        const updatedFiles = files.filter((f) => f !== file);
        setFiles(updatedFiles);
        handleGetValues({ e, updatedFiles, type: "file" })
    };


    return (
        <div className={Styles.work_order_label_uploader_comp}>
            <label>
                {label}
            </label>

            <div>
                {placeholder}
                <label name={name} className={Styles.work_order_label_button}>
                    <input name={name} type={type} placeholder={placeholder} accept=".jpg,.png,.pdf,.xlsx,.docx,.dwg" multiple onChange={(e) => {
                        handleFileSelect(e)
                        // handleGetValues(e,files)
                    }} />
                    Upload
                </label>
            </div>
            {
                defaultValue && <div className={Styles.work_order_label_uploader_comp_uploaded_documents_container}>

                    {
                        defaultValue?.map((ele, index) => {
                            return <div key={ele.docId}>
                                <div>
                                    <span>{`Document ${index + 1}`}</span>
                                    <span>{ele.documentName}</span>
                                </div>
                                <div>
                                    {/* <span>{Date()}</span> */}
                                    <AiFillDelete color='red' onClick={(e) => handleDeleteWorkOrderDocument({ workOrderId: ele.workOrderId, workOrderDocumentId: ele.docId, dispatch, workOrderStateManagementActions, commonActions })} />
                                </div>
                            </div>
                        })
                    }
                </div>
            }
            <div className={Styles.work_order_label_uploader_comp_uploaded_documents_container}>
                {files.map((file, index) => (
                    <div key={index}>
                        <div>
                            <span>{`Document ${defaultValue?.count ? defaultValue?.count : 0 + index + 1}`}</span>
                            <span>{file.name}</span>
                        </div>
                        <div>
                            {/* <span>{Date()}</span> */}
                            <AiFillDelete color='red' onClick={(e) => handleFileDelete(e, file)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LabelUploader


