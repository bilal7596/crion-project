import React, { useState, useEffect } from 'react';
import Styles from "./ClonosExportOptions.module.css";
import ClonosInput from '../ClonosInput/ClonosInput';
import ClonosSelect from '../ClonosSelect/ClonosSelect';
import { ClonosButton } from '../Button/Button';

/**
 * ClonosExportOptions component for rendering export options.
 * @param {Object} props - Component props.
 * @property {function} props.handleGetDetails - Callback function to get export details.
 * @property {function} props.handleExportFile - Callback function to handle file export.
 * @property {Array} props.formats - Array of supported export formats. Supported formats: [excel,csv,xlsx,pdf].
 * @returns {React.Component} - ClonosExportOptions component.
 */
const ClonosExportOptions = React.memo(({ handleGetDetails, handleExportFile, formats }) => {
    const [needToExportFileData, setNeedToExportFileData] = useState({});
    let options = [
        { label: "Excel", value: "excel", isNeeded: false },
        { label: "CSV", value: "csv", isNeeded: false },
        { label: "XLSX", value: "xlsx", isNeeded: false },
        { label: "PDF", value: "pdf", isNeeded: false },
    ];

    /**
     * Handle getting page type for PDF export.
     * @param {Object} props - Component props.
     * @property {string} props.uniqueKey - Unique key for identifying the input.
     * @property {Object} props.updatedValue - Updated value from the input.
     */
    const handleGetPageType = (props) => {
        setNeedToExportFileData({ ...needToExportFileData, [props?.uniqueKey]: props?.updatedValue.value });
    };

    /**
     * Handle getting format type for export.
     * @param {Object} props - Component props.
     * @property {string} props.uniqueKey - Unique key for identifying the input.
     * @property {Object} props.updatedValue - Updated value from the input.
     */
    const handleGetValuesFormatType = (props) => {
        setNeedToExportFileData({ ...needToExportFileData, [props?.uniqueKey]: props?.updatedValue?.value });
    };

    /**
     * Handle getting file name for export.
     * @param {Object} props - Component props.
     * @property {string} props.uniqueKey - Unique key for identifying the input.
     * @property {string} props.updatedValue - Updated value from the input.
     */
    const handleGetFileName = (props) => {
        setNeedToExportFileData({ ...needToExportFileData, [props?.uniqueKey]: props?.updatedValue });
    };

    useEffect(() => {
        handleGetDetails(needToExportFileData);
        formats && options?.map((item) => {
            if (formats.includes(item.value)) item.isNeeded = true;
        });
    }, [needToExportFileData, formats]);

    return (
        <div className={Styles.clonos_export_options_container}>
            <header><h3>Export</h3></header>
            <ClonosInput
                type="text"
                placeholder="Enter File Name..."
                label="File Name"
                uniqueKey={"fileName"}
                areaLabel='select'
                handleGetValues={handleGetFileName}
            />
            <div aria-label='select format of exported file' className={Styles.clonos_export_options_select_format_container}>
                <ClonosSelect
                    isLabel={true}
                    position="bottom"
                    options={options}
                    uniqueKey="format"
                    isMandatory={true}
                    areaLabel='select'
                    label="Select Format"
                    placeholder="Format Type"
                    handleGetValues={handleGetValuesFormatType}
                    errorMessage={"Please Select Format of File!"}
                />
                {
                    needToExportFileData?.format == "pdf" && < ClonosSelect
                        isLabel={true}
                        name="page type"
                        label='Page Type'
                        areaLabel='select'
                        isMandatory={true}
                        uniqueKey="pageType"
                        placeholder='Select Page Type...'
                        handleGetValues={handleGetPageType}
                        errorMessage={"Please Select Page Type File!"}
                        options={[{ label: "A4", value: "a4", isNeeded: true }, { label: "Horizontal", value: "horizontal", isNeeded: true }]}
                    />
                }
            </div>
            <footer><ClonosButton onClick={handleExportFile}>Export</ClonosButton></footer>
        </div>
    );
});

export default ClonosExportOptions;
