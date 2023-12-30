import React from 'react'
import Styles from "./FileUploader.module.css"

import { SelectPicker } from "rsuite";
import { Box, LinearProgress, Tooltip, Typography } from "@material-ui/core";
import { useEffect, useState, memo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleShowErrorAndWarning, removeUserSession } from "../../../utils/clonosCommon";


import fileUploader_Main_Icon from "../../../assets/UIUX/icons/Common_Component/File_Uploader/file_uploader_icon.svg"
import fileUploader_Upload_Button_Icon from "../../../assets/UIUX/icons/Common_Component/File_Uploader/file_uploader_upload_button.svg"
import fileUploader_Uploaded_File_Icon from "../../../assets/UIUX/icons/Common_Component/File_Uploader/file_uploader_uploaded_file.svg"
import fileUploader_Remove_File_Icon from "../../../assets/UIUX/icons/Common_Component/File_Uploader/file_uploader_delete.svg"


const FileUploader = ({ label, title, typeOfRecord, isMandatory, limit, acceptableFileTypes, defaultValue, fileSizeInMB, localPreviousPageFiles, handleGetSelectedData }) => {


    const dispatch = useDispatch();
    let [lcFiles, setLcFiles] = useState([]);
    console.log('lcFiles:', lcFiles)
    const [uploadProgress, setUploadProgress] = useState({});
    const [mappingFilesContainerDimensions, setMappingFilesContainerDimensions] = useState({});
    const [lcDefaultFiles, setLcDefaultFiles] = useState([]);
    const [lcDeletedDocuments, setLcDeletedDocuments] = useState([]);
    const inputRef = useRef(null)
    console.log('lcDefaultFiles:', lcDefaultFiles)

    console.log(localPreviousPageFiles, "dese ....")
    /**
     * Handles the uploading of files, performing various checks and validations.
     *
     * @param {object} props - The function's input properties.
     * @param {object} props.e - The event object containing the selected files (optional, can be null).
     * @param {array} props.files - The list of selected files (optional, used when 'e' is null).
     */
    const handleUploadFiles = ({ e, files }) => {
        // If 'e' is provided, update 'files' with the selected files from the event; otherwise, use the existing 'files'.
        files = e ? Array.from(e.target.files) : files;

        // Create a backup of the selected files for reference.
        let backup = files;

        // Check if the number of selected files exceeds the limit.
        if (!handleCheckLimit({ limit, files })) return;

        // Check if only unique files are selected, filtering out duplicates.
        files = handleCheckIfFileIsAlreadyPresentOrNot({ needToUploadedFiles: files, uploadedFiles: lcFiles });

        // Check if the number of selected files still exceeds the limit.
        if (!handleCheckLimit({ limit, files })) return;

        // Check if the file extensions are valid.
        if (!handleCheckIfFilesTypeIsValidOrNot({ files, acceptableFileTypes })) return;

        // Check if the size of each file is within the specified limit.
        if (!handleCheckEachFileSize({ files, fileSizeInMB })) return;

        // Update the list of selected files.
        setLcFiles(files?.reverse());

        // Handle the selected data, e.g., for file uploads.
        handleGetSelectedData({ name: title.toLowerCase(), files, type: "file" });

        // Upload the files, using the 'backup' array for reference.
        uploadFiles(backup);
    }


    /**
     * Checks if the number of uploaded files exceeds a specified limit.
     *
     * @param {object} props - The function's input properties.
     * @param {number} props.limit - The maximum number of allowed files.
     * @param {array} props.files - The list of uploaded files.
     * @returns {boolean} - Returns true if the number of files is within the limit, or false if it exceeds the limit.
     */
    const handleCheckLimit = ({ limit, files }) => {
        if (files?.length > limit) {
            handleShowErrorAndWarning({ dispatch, type: "error", showTime: 20000, message: `You can't upload more than ${limit} files.` });
            return false;
        }
        if (defaultValue && defaultValue.length + files.length > limit) {
            console.log(defaultValue, "default value")
            handleShowErrorAndWarning({ dispatch, type: "error", showTime: 20000, message: `You have already uploaded ${defaultValue.length} file, So you can only upload ${limit - defaultValue.length} files more, because the limit is ${limit}!.` });
            return false
        }
        return true;
    }


    /**
     * Checks if files need to be uploaded are not already present in the list of uploaded files.
     *
     * @param {object} props - The function's input properties.
     * @param {array} props.needToUploadedFiles - The files that need to be uploaded.
     * @param {array} props.uploadedFiles - The list of already uploaded files.
     * @returns {array} - Returns a modified list of files with unique items.
     */
    const handleCheckIfFileIsAlreadyPresentOrNot = ({ needToUploadedFiles, uploadedFiles, limit }) => {
        let uploadedFilesLc = uploadedFiles?.map(ele => ele?.name);
        let needToUploadedFilesLc = needToUploadedFiles.filter(item => !uploadedFilesLc.includes(item.name));
        needToUploadedFilesLc = [...uploadedFiles, ...needToUploadedFilesLc];
        return needToUploadedFilesLc;
    }

    /**
     * Checks if the file types of the uploaded files are valid.
     *
     * @param {object} props - The function's input properties.
     * @param {array} props.files - The list of uploaded files.
     * @param {array} props.acceptableFileTypes - The list of supported file types.
     * @returns {boolean} - Returns true if all file types are valid, or false if any file type is unsupported.
     */
    const handleCheckIfFilesTypeIsValidOrNot = ({ files, acceptableFileTypes }) => {
        let fileNames = files.map(item => item.name);
        let count = 0;
        for (let i = 0; i < fileNames.length; i++) {
            let tempElement = fileNames[i].split(".");
            if (acceptableFileTypes.includes(`.${[tempElement[tempElement.length - 1]]}`)) count++;
        }
        if (count === fileNames.length) return true;
        else {
            handleShowErrorAndWarning({ dispatch, type: "error", message: "Please upload supported file types!", showTime: 5000 });
            return false;
        }
    }


    /**
     * Checks if the size of each uploaded file is within the specified limit.
     *
     * @param {object} props - The function's input properties.
     * @param {array} props.files - The list of uploaded files to check.
     * @param {number} props.fileSizeInMB - The maximum file size allowed in megabytes.
     * @returns {boolean} - Returns true if all file sizes are within the limit, or false if any file size exceeds the limit.
     */
    const handleCheckEachFileSize = ({ files, fileSizeInMB }) => {
        files.forEach((file) => {
            let sizeInBytes = fileSizeInMB * 1024 * 1024;
            if (file.size > sizeInBytes) {
                // Notify that the file size is greater (consider using a more user-friendly notification)
                handleShowErrorAndWarning({ dispatch, type: "error", message: "File size should be less than 10MB!", showTime: 5000 });
                return false; // Return false if a file size exceeds the limit
            }
        });
        return true; // Return true if all file sizes are within the limit
    }


    const uploadFiles = (files) => {
        let tempProgress = {};
        files.forEach((file) => {
            const formData = new FormData();
            formData.append("file", file);

            // Simulate a file upload progress
            let progress = 0;
            const interval = setInterval(() => {
                if (progress < 100) {
                    progress += 10;
                    setUploadProgress((prevProgress) => {
                        tempProgress = {
                            ...prevProgress,
                            [file.name]: progress,
                        };
                        return tempProgress;
                    });
                } else {
                    clearInterval(interval);
                }
            }, 200);
        });
        console.log('tempProgress:', tempProgress)
    };

    // This function will deselect the local files
    const handleDeselectFile = (fileName) => {
        let updatedFiles = lcFiles?.filter(file => file.name !== fileName)
        setLcFiles(updatedFiles)
        handleGetSelectedData({ name: title.toLowerCase(), files: updatedFiles, type: "file" })
        inputRef.current.value = null
    };

    // Event handler for dragover
    const handleDragOver = (e) => {
        console.log('eventWhileOver:', e)
        e.preventDefault();
    };

    // Event handler for drop
    const handleDrop = (e) => {
        e.preventDefault();
        let files = e.dataTransfer.files
        let newArray = []
        for (let i = 0; i < files.length; i++) {
            newArray.push(files[i])
        }
        handleUploadFiles({ files: newArray })
    };



    /**
     * Handles the deletion of uploaded files by updating state and selected data.
     *
     * @param {object} props - The function's input properties.
     * @param {string} props.docId - The unique identifier of the document to be deleted.
     */
    const handleDeleteUploadedFiles = ({ docId }) => {
        // Update the list of deleted documents
        setLcDeletedDocuments((prev) => {
            let temp = [...prev, docId];
            // Handle the selected data, e.g., for documents that need to be deleted
            handleGetSelectedData({ name: "needToDeleteDocuments", selectedOption: temp, type: "isEditable" });

            return temp;
        });

        // Remove the deleted document from the list of default files
        let updatedLcDefaultFiles = lcDefaultFiles?.filter(item => item?.imageId !== docId);
        setLcDefaultFiles(updatedLcDefaultFiles);
    };


    useEffect(() => {
        let element = document.querySelector('.fu_dragAreaStatic')
        setMappingFilesContainerDimensions({ ["height"]: element.clientHeight }) // we are calculating the height of the side child.
        if (defaultValue?.length) setLcDefaultFiles(defaultValue) // Here we are checking that if there is any default value available that we want to show then we can do it.
        if (localPreviousPageFiles !== undefined && localPreviousPageFiles?.length > 0) setLcFiles([...localPreviousPageFiles])


    }, [defaultValue])

    return (
        <div className={Styles.fileUploader_container}>
            <label>{label} {isMandatory && <sup className={Styles.work_order_label_input_comp_isMandatory}>*</sup>}</label>
            <div className={Styles.fu_body}>
                <div
                    style={{ justifyContent: lcFiles.length ? "space-between" : "center" }}
                    className={Styles.fileUploader_container_content}
                >
                    <div
                        style={{ background: lcFiles.length ? "#F5F5F5" : "#FFF" }}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`fu_dragAreaStatic ${Styles.fu_dragArea}`}
                    >
                        <div className={Styles.fu_main_icon}>
                            <img src={fileUploader_Main_Icon} />
                        </div>
                        <label
                            htmlFor={title}
                            name={title}
                            className={Styles.fu_content_label}
                        >
                            <p className={Styles.astMediaLabel}>
                                Drag & Drop {typeOfRecord} to Upload
                            </p>
                            <p
                                style={{ marginTop: "0" }}
                                className={Styles.astMediaLabel}
                            >
                                or
                            </p>
                            <input
                                accept={acceptableFileTypes.join(",")}
                                id={title}
                                type="file"
                                style={{ display: "none" }}
                                multiple={limit > 1 ? true : false}
                                onChange={(e) => {
                                    handleUploadFiles({ e });
                                }}
                                // onBlur={() => validateForm(formData, setErrors)}
                                name={title}
                                ref={inputRef}
                            />
                            <div className={Styles.fu_updoadBtnContainer}>
                                <div className={Styles.fu_uploadBtnDiv}>
                                    <img src={fileUploader_Upload_Button_Icon} />
                                    <span>Upload</span>
                                </div>
                            </div>
                            <p className={Styles.astMediaLabel}>
                                Supported formats {acceptableFileTypes.join(" ")}
                            </p>
                            <p className={Styles.astMediaLabel}>
                                Max file allowed : {limit} & Max File Size : {fileSizeInMB} MB
                            </p>
                        </label>
                    </div>
                    {(lcFiles.length > 0 || lcDefaultFiles.length > 0) && (
                        <div style={{ height: `${mappingFilesContainerDimensions?.height}px` }} className={Styles.fu_mapping_files_container}>
                            {lcFiles?.map((file) => {
                                return (
                                    <>
                                        <div className={Styles.fu_selectedFileItem}>
                                            <div className={Styles.fu_selectedFileItem_file_upload_image}>
                                                <img src={fileUploader_Uploaded_File_Icon} alt="Preview Icon" />
                                            </div>
                                            <div className={Styles.fu_progressContainer}>
                                                <Tooltip title={file?.name}>
                                                    <p className={Styles.fu_uploadedFileName}>{file?.name}</p>
                                                </Tooltip>
                                                {/* {uploadProgress[file?.name] &&
                                                    uploadProgress[file?.name] !== 100 ? (
                                                    <ProgressBarWithLabel
                                                        progress={uploadProgress[file?.name]}
                                                    />
                                                ) : (
                                                    <></>
                                                )} */}
                                            </div>
                                            <div className={Styles.fu_delete_file_container}>
                                                <img
                                                    alt="Delete Icon"
                                                    src={fileUploader_Remove_File_Icon}
                                                    onClick={() => handleDeselectFile(file?.name)}
                                                />
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                            {lcDefaultFiles?.map((file) => {
                                return (
                                    <>
                                        <div className={Styles.fu_selectedFileItem}>
                                            <div className={Styles.fu_selectedFileItem_file_upload_image}>
                                                <img src={fileUploader_Uploaded_File_Icon} alt="Preview Icon" />
                                            </div>
                                            <div className={Styles.fu_progressContainer}>
                                                <Tooltip title={file?.name}>
                                                    <p className={Styles.fu_uploadedFileName}>{file?.name}</p>
                                                </Tooltip>
                                            </div>
                                            <div className={Styles.fu_delete_file_container}>
                                                <img
                                                    alt="Delete Icon"
                                                    src={fileUploader_Remove_File_Icon}
                                                    onClick={() => handleDeleteUploadedFiles({ docId: file?.docId || file?.imageId })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader


export const ProgressBarWithLabel = (props) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.progress
                )
                    } % `}</Typography>
            </Box>
        </Box>
    );
};

// [
//     {
//         id: "string",
//         name: "task name",
//         assetCategory: "string",
//         preview: [
//             { name: "Sub task name", id: "string" },
//             { name: "Sub task name", id: "string" },
//             { name: "Sub task name", id: "string" },
//         ]
//     },
//     {
//         string: "string",
//         name: "task name",
//         assetCategory: "string",
//         preview: [
//             { name: "Sub task name", id: "string" },
//             { name: "Sub task name", id: "string" },
//             { name: "Sub task name", id: "string" },
//         ]
//     },
// ]