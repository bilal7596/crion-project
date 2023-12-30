import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSavedDocData } from "../../Api/DynamicForm/dynamicFormApi";
import TemplateDataTable from "../asset/TemplateDataTable";

const DocumentData = () => {
  const LOCATION = useLocation();
  const [documentData, setdocumentData] = useState([])
  useEffect(() => {
    console.log("LOCATION.state?", LOCATION.state);
    getSavedDocData(LOCATION.state?.asset?.assetId, LOCATION.state?.assoDocData?.formid)
      .then((res) => {
        console.log("getSavedDocData RESPONSE", res);
        setdocumentData(res?.data)
      })
      .catch((err) => console.log("getSavedDocData ERROR", err));
  }, [LOCATION.state?.assetId]);
  console.log("document data<<<<<<<<<<<<<<<<<<<<",documentData)
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 style={{ color: "#3F51B5" }}>
          Document : {LOCATION.state?.assoDocData?.name}
        </h3>
        {/* <button
          style={{
            backgroundColor: "#007bfd",
            color: "#fff",
            padding: "0 2rem",
            cursor: "pointer",
            border: "none",
          }}
        >
          Export as
        </button> */}
      </div>
      <h3 style={{ color: "#3F51B5" }}>
        Type :{" "}
        <span style={{ textTransform: "capitalize" }}>
          {LOCATION.state?.assoDocData?.type}
        </span>
      </h3>

      <h2 style={{ color: "#3F51B5", textAlign: "center", margin: "2rem 0" }}>
        Document Data
      </h2>
      <div>
        <TemplateDataTable docData={documentData} />
      </div>
    </>
  );
};
export default DocumentData;
