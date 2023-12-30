import React, { useEffect, useState } from 'react'
import Styles from "./TaskLibraryDropdown.module.css"
import searchIcon from "../../../../assets/UIUX/icons/search (1).svg"
import { generateUniqueId, globalHandleSearch } from '../../../../utils/clonosCommon';
import CloseIcon from '../../../../assets/Clonos Common Indicators/Icon_Components/CloseIcon';
import BackIcon from '../../../../assets/Clonos Common Indicators/Icon_Components/BackIcon';

let data = [
    {
        id: "stringg",
        name: "task name",
        assetCategory: "string",
        preview: [
            {
                createdDate: "2023-11-23T10:13:48.000Z",
                id: 248,
                isActive: 1,
                updatedDate: "2023-11-23T10:13:48.000Z",
                name: "mohan",
            },
            {
                createdDate: "2023-11-23T10:13:48.000Z",
                id: 248,
                isActive: 1,
                updatedDate: "2023-11-23T10:13:48.000Z",
                name: "abhishek",
            }
        ]
    },
    {
        id: "string",
        name: "task name",
        assetCategory: "string",
        preview: [
            {
                createdDate: "2023-11-23T10:13:48.000Z",
                id: 248,
                isActive: 1,
                updatedDate: "2023-11-23T10:13:48.000Z",
                name: "asdasda",
            },
            {
                createdDate: "2023-11-23T10:13:48.000Z",
                id: 248,
                isActive: 1,
                updatedDate: "2023-11-23T10:13:48.000Z",
                name: "resdslkfsldfslfsljdresdslkfsldfslfsljdresdslkfsldfslfsljdresdslkfsldfslfsljdresdslkfsldfslfsljdresdslkfsldfslfsljdresdslkfsldfslfsljdresdslkfsldfslfsljdresdslkfsldfslfsljdresdslkfsldfslfsljd",
            }
        ]
    }
]


const   TaskLibraryDropdown = ({ data, closeModalMethod, handleGetValues, isMultiple, type, uniqueKey }) => {
    // State for managing data
    const [lcData, setLcData] = useState([]);
    const [isPreview, setIsPreview] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const [previewData, setPreviewData] = useState([]);

    // Log data for debugging
    console.log('previewData:', previewData);
    console.log('lcData:', lcData);

    // Function to handle search
    const handleSearch = (e) => {
        if (e.target.value.length > 0) {
            const filteredData = data.filter((ele) => globalHandleSearch({ typedString: e.target.value, withCompareString: ele.name }));
            setLcData(filteredData);
        } else {
            setLcData(data);
        }
    };

    // Function to close the modal
    const lcHandleCloseModal = () => {
        handleGetValues && handleGetValues({ type, uniqueKey, selectedOption: [] });
        setSelectedValues([]);
        closeModalMethod(false);
    };

    // Function to handle getting values
    const lcHandleGetValues = (props) => {
        console.log('props:', props)
        handleGetValues({ type, uniqueKey, selectedOption: [props] });
        // setSelectedValues((prev) => {
        //     const updatedState = isMultiple ? [...prev, props] : [props];
        //     handleGetValues({ type, uniqueKey, selectedOption: updatedState });
        //     return updatedState;
        // });
        closeModalMethod(false)
    };

    // Function to handle Ok button click
    const lcHandleOk = () => {
        handleGetValues && handleGetValues({ type, uniqueKey, selectedOption: selectedValues });
        closeModalMethod(false);
    };

    // Effect to set lcData initially
    useEffect(() => {
        data && data.length > 0 && setLcData(data);
    }, [data]);
    console.log(data,"from tsk")
    return (
        <div role="dialog" aria-labelledby="TaskLibraryHeading" aria-modal="true" aria-label=" Task Library" className={Styles.task_library_dropdown_container}>
            <header>
                {isPreview === false ? (
                    <div aria-labelledby="taskLibraryHeading" className={Styles.task_library_dropdown_header_tasks}>
                        <span id="taskLibraryHeading">Select From Task Library</span>
                        <CloseIcon tooltipTitle="Close" onClick={closeModalMethod} />
                    </div>
                ) : (
                    <div aria-labelledby="taskPreviewHeading" className={Styles.task_library_dropdown_header_task_preview}>
                        <div>
                            <BackIcon tooltipTitle="Back" onClick={() => setIsPreview(false)} />
                            <span id="taskPreviewHeading">Task Library</span>
                        </div>
                        <CloseIcon tooltipTitle="Close" onClick={closeModalMethod} />
                    </div>
                )}
            </header>
            {isPreview ? (
                <section className={Styles.task_library_dropdown_preview_container}>
                    {previewData.length > 0 ? (
                        previewData.map((task, index) => (
                            <div key={generateUniqueId(5)} className={Styles.task_library_dropdown_preview_single_task}>
                                <span>Task {index}</span>
                                <span>-</span>
                                <span>{task.name}</span>
                            </div>
                        ))
                    ) : (
                        <p>No Tasks!</p>
                    )}
                </section>
            ) : (
                <section className={Styles.task_library_dropdown_body}>
                    <div role="search" aria-label="Search Bar" className={Styles.task_library_dropdown_search_bar}>
                        <img src={searchIcon} alt="Search" loading="lazy" />
                        <input onChange={(e) => handleSearch(e)} aria-label="Search Input" />
                    </div>
                    <div aria-label="All Tasks" className={Styles.task_library_dropdown_all_task_container}>
                        {lcData.map((task) => (
                            <div key={task.id} aria-label="task" className={Styles.task_library_dropdown_single_task} >
                                <div onClick={() => lcHandleGetValues(task)}>
                                    <span aria-label="Task Name">{task.name}</span>
                                    <span aria-label="Asset Category">{task.assetCategory.name}</span>
                                </div>
                                <span onClick={() => {
                                    setPreviewData(task.preview);
                                    setIsPreview(true);
                                }} aria-label="Preview">Preview</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <footer className={Styles.task_library_dropdown_footer_controller}>
                <span role="button" tabIndex="0" className={Styles.task_library_dropdown_footer_cancel} onClick={lcHandleCloseModal}>
                    Cancel
                </span>
                <span role="button" tabIndex="0" className={Styles.task_library_dropdown_footer_ok} onClick={lcHandleOk}>
                    Ok
                </span>
            </footer>
        </div>
    );
};

export default TaskLibraryDropdown;
