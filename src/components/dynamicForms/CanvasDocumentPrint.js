import { handleGeneratePDF } from "../../utils/CanvasMethods/CanvasDocumentPrintMethods";
import { dataManipulator } from "../../utils/CanvasMethods/SetupCanvasMethods";
import SingleCanvasRenderedDocument from "./SingleCanvasRenderedDocument";
import Styles from "../../ModuleStyles/CanvasDocumentPrint.module.css";
import { CSVLink, CSVDownload } from "react-csv";
import { Link, useLocation } from "react-router-dom";
import React, { useRef, useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

// import XLSX from "xlsx"

const CanvasDocumentPrint = () => {
  const LOCATION = useLocation();
  const childRefs = useRef([]);
  const [CSVData, setCSVData] = useState([]);
  const csvRef = useRef(null);
  const { recordOfLinesCoordinatesToolkitState } = useSelector(
    (store) => store.dynamicFormStateManagement
  );
  console.log(
    "recordOfLinesCoordinatesToolkitState:",
    recordOfLinesCoordinatesToolkitState
  );
  console.log("LOCATION:", LOCATION.state);

  const handleFilterDataForXLSX = useCallback(() => {
    let recordOfPostions = LOCATION.state.recordOfPositionsOfAttributes;
    // let lcFormValues = LOCATION?.state?.documentData.map((ele) => ele.formvals);
    let lcFormValues = LOCATION?.state?.documentData.map(
      (ele) => ele.formFields
    );

    let manuplatedData = lcFormValues.map((ele) => dataManipulator(ele));
    let temp = [];
    manuplatedData[0].filter((ele) => {
      let key = ele.countOfAttribute > 0 ? ele.customFieldType : ele.fieldType;
      if (recordOfPostions[key]) {
        temp.push(ele.fieldName);
      }
    });
    let fieldsOfCSV = manuplatedData.map((ele) => {
      let lcValues = [];
      ele.filter((lcEle) => {
        if (temp.includes(lcEle.fieldName)) {
          if (lcEle.fieldType === "radio" || lcEle.fieldType == "dropdown") {
            lcValues.push(lcEle.choosedValue);
          } else if (lcEle.fieldType === "checkbox") {
            let hop = lcEle.fieldValue.filter(
              (checkboxEle) => checkboxEle.isChecked
            );
            lcValues.push(hop[0].optionValue);
          } else lcValues.push(lcEle.fieldValue);
        }
      });
      return lcValues;
    });
    fieldsOfCSV.unshift(temp);
    console.log("fieldsOfCSV:", fieldsOfCSV);
    return fieldsOfCSV;
  }, []);

  const handleChildRef = (ref, index) => {
    childRefs.current[index] = ref; // Store the child component ref in the corresponding index
  };

  const handlePageDownloadWithSelectedFormat = (e) => {
    if (e == "pdf") handleGeneratePDF(childRefs, LOCATION?.state?.alignMent);
    else if (e === "csv") {
      if (csvRef.current) {
        if (LOCATION.state.recordOfPositionsOfAttributes.table) {
          alert("table data can't be download in the csv format.");
          return;
        }
        csvRef.current.link.click();
      }
    }
  };

  useEffect(() => {
    setCSVData(handleFilterDataForXLSX());
  }, []);
  console.log("CSVData:", CSVData);
  return (
    <div className={Styles.canvas_document_print_main_container}>
      <div className={Styles.canvas_document_print_heading_container}>
        <h3>Document : {LOCATION.state?.formName}</h3>

        <div className={Styles.canvas_document_print_nav_container}>
          <div>
            <Link to={-1} className="std_btn">
              Back
            </Link>
          </div>
          <select
            className="std_select_tag"
            onChange={(e) =>
              handlePageDownloadWithSelectedFormat(e.target.value)
            }
            required
          >
            <option>Choose Export Type </option>
            <option value="pdf">PDF</option>
            <option value="csv">
              <CSVLink ref={csvRef} data={CSVData} filename={"my-file.csv"}>
                CSV
              </CSVLink>
            </option>
          </select>
        </div>
      </div>
      <section className={Styles.canvas_document_print_container}>
        {LOCATION.state.documentData?.map((ele, index) => {
          return (
            <SingleCanvasRenderedDocument
              key={ele._id}
              ref={(ref) => handleChildRef(ref, index)}
              pageNumber={index}
              formFields={ele.formFields}
              pageDimensions={LOCATION.state.canvasDimensions}
              coordinates={LOCATION.state.recordOfPositionsOfAttributes}
            />
          );
        })}
      </section>
    </div>
  );
};

export default CanvasDocumentPrint;
