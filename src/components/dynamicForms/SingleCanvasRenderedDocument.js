import React from "react";
import { dataManipulator } from "../../utils/CanvasMethods/SetupCanvasMethods";
import Styles from "../../ModuleStyles/SingleCanvasRenderedDocument.module.css";
import Date from "../Attributes/Date";
import Checkbox from "../Attributes/Checkbox";
import Radio from "../Attributes/Radio";
import Dropdown from "../Attributes/Dropdown";
import Table from "../Attributes/Table";
import TextComponent from "../Attributes/Text";
import Number from "../Attributes/Number";
import Image from "../Attributes/Image";
import { useSelector } from "react-redux";
import Lines from "../Attributes/Lines";

const SingleCanvasRenderedDocument = React.forwardRef((props, ref) => {
  const { formFields, coordinates, pageDimensions, pageNumber } = props;
  const {
    recordOfLinesCoordinatesToolkitState,
    recordOfHeightAndWidthOfImagesToolkitState,
  } = useSelector((store) => store.dynamicFormStateManagement);

  let lcFormValues = dataManipulator(formFields); // (dataManipulator) This method will add two more key in original data and keys are (customFieldType,countOfAttribute) which will be helpful for render same attributes in the different component.
  let arrayOfValues = Object.values(recordOfLinesCoordinatesToolkitState).map(
    (element) => element
  );

  return (
    <div
      className={Styles.single_canvas_rendered_document_container}
      style={{
        width: `${pageDimensions.width}px`,
        height: `${pageDimensions.height}px`,
      }}
      ref={ref}
    >
      {lcFormValues.map((ele) => {
        let attribute =
          ele.countOfAttribute > 0 ? ele.customFieldType : ele.fieldType;
        if (coordinates[attribute]) {
          return ele.fieldType === "text" ? (
            <TextComponent positions={coordinates[attribute]} element={ele} />
          ) : ele.fieldType === "date" ? (
            <Date positions={coordinates[attribute]} element={ele} />
          ) : ele.fieldType === "checkbox" ? (
            <Checkbox positions={coordinates[attribute]} element={ele} />
          ) : ele.fieldType === "radio" ? (
            <Radio positions={coordinates[attribute]} element={ele} />
          ) : ele.fieldType === "dropdown" ? (
            <Dropdown positions={coordinates[attribute]} element={ele} />
          ) : ele.fieldType === "number" ? (
            <Number positions={coordinates[attribute]} element={ele} />
          ) : ele.fieldType === "file" ? (
            <Image
              positions={coordinates[attribute]}
              element={ele}
              dimensions={recordOfHeightAndWidthOfImagesToolkitState[attribute]}
            />
          ) : (
            <Table positions={coordinates[attribute]} element={ele} />
          );
        }
      })}
      {arrayOfValues.map((linesElement, index) => {
        return <Lines key={index} lineCoordinates={linesElement} />;
      })}
      <footer>
        <span className={Styles.single_canvas_rendered_document_page_number}>
          ({pageNumber + 1})
        </span>
      </footer>
    </div>
  );
});

export default SingleCanvasRenderedDocument;
