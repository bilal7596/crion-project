import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { getSavedDocData } from '../../Api/DynamicForm/dynamicFormApi';

const ViewChecklistFormData = () => {
    const LOCATION = useLocation()
    const [checklistData,setChecklistData] = useState([]) 
    useEffect(() => {
        console.log("LOCATION.state?", LOCATION.state);
        console.log("formId",LOCATION.state?.assoDocData?.formid)
        getSavedDocData(
          LOCATION.state?.asset?.assetId,
          LOCATION.state?.assoDocData?.formid
        )
          .then((res) => {
            console.log("getSavedDocData RESPONSE", res);
            setChecklistData(res?.data);
    
            // setfieldTypeData(dataManipulator(res?.data[0].formvals));
            // The "setManipulatedAttibutes" function is used to set the value of the "manipulatedAttibutes" state variable.
            // The value is obtained from the "dataManipulator" function, which processes the data received from "res?.data[0].formvals".
            // The processed data is an array with additional keys ("countOfAttribute" and "customFieldType") that are not present in the original "res" data.
            // These additional keys are used for rendering select tag options when multiple fields have the same "fieldType".
          })
          .catch((err) => console.log("getSavedDocData ERROR", err));
        // handleGetCanvasHeightAndWidth();
      }, [LOCATION.state?.assetId]);

  console.log('checklistData:', checklistData)
  return (
    <div>ViewChecklistFormData</div>
  )
}

export default ViewChecklistFormData