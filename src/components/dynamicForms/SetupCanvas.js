import {
  dataManipulator,
  handleDragEnd,
  handleDragMove,
  handleDragStart,
  handleDrop,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleRedoLines,
  handleUndoLines,
} from "../../utils/CanvasMethods/SetupCanvasMethods";
import CanvasCustomText from "../CanvasCustomShapesComponents/CanvasCustomText";
import ClonosConfirmationDialog from "../Dialogs/ClonosConfirmationDialog";
import {
  getSavedDocData,
  getAllDynamicForms,
  getSavedDynamicFromsData,
} from "../../Api/DynamicForm/dynamicFormApi";
import Styles from "../../ModuleStyles/SetupCanvas.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Group, Layer, Line, Stage } from "react-konva";
import { useState, useEffect, useRef } from "react";
import React, { useCallback } from "react";
import { dynamicFormStateManagementActions } from "../../Store/Reducers/ClonosDynamicFormReducer";
import { useDispatch, useSelector } from "react-redux";
import { removeAnyKeyFromAnObject } from "../../utils/CanvasMethods/CommonMethods";
import DraggableResizableImage from "../CanvasCustomShapesComponents/CanvasCustomImage";
import defaultImage from "../../assets/images/galleryImage.png";
import { MdGesture, MdDraw } from "react-icons/md"
import { ImRedo, ImUndo } from "react-icons/im"

const SetupCanvas = () => {
  const dispatch = useDispatch();
  const {
    fieldTypeDataToolkitState,
    addedFieldTypeDataToolkitState,
    recordOfPositionsOfAttributesToolkitState,
    activeFormIdToolkitState,
    assoDocDataToolkitState,
    recordOfLinesCoordinatesToolkitState,
    undoLinesToolkitState,
    redoLinesToolkitState,
    recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState,
    recordOfUndoLinesAreAvailableInToolkit,
    recordOfUndoLinesCoordinatesToolkitState
  } = useSelector((store) => store.dynamicFormStateManagement);
  const [documentData, setdocumentData] = useState([]);
  const LOCATION = useLocation();

  const [fieldTypeData, setfieldTypeData] = useState([]);
  // The "fieldTypeData" state variable stores data used for creating options in a select tag, functioning as a dropdown menu.

  const [addedFieldTypeData, setAddedFieldTypeData] = useState([]);
  const [recordOfPositionsOfAttributes, setrecordOfPositionsOfAttributes] =
    useState(recordOfPositionsOfAttributesToolkitState);

  const [canvasDimensions, setCanvasDimensions] = useState({
    height: 0,
    width: 0,
  });
  const [alignMent, setAlignment] = useState("a4");
  const setupCanvasContainerRef = useRef();
  const setupCanvasChildRef = useRef();
  const navigate = useNavigate();
  const layerRef = useRef(null);

  // These state are for dynamic lines
  const lineLayerRef = useRef(null);
  const stageRef = useRef(null);
  // const lines = useRef([]);
  const [lines, setLines] = useState([])

  console.log("lines:", lines);
  const [isDrawing, setIsDrawing] = useState(false);
  const clickTimeout = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const [allowLines, setAllowLines] = useState(false)

  console.log('stageRef:', stageRef)

  // These states will be use for handle the confirmation dialog box in the delete attribute section, Where use can delete the existing the attributes from the canvas
  const [showDialog, setShowDialog] = useState(false);

  const [handleDestroyAttributesArgument, setHandleDestroyAttributesArgument] =
    useState({});

  const [makeSmoothDrag, setMakeSmoothDrag] = useState({});

  console.log("addedFieldTypeData:", addedFieldTypeData);
  console.log("fieldTypeData:", fieldTypeData);
  console.log(
    "recordOfLinesCoordinatesToolkitState:",
    recordOfLinesCoordinatesToolkitState
  );
  console.log('recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState:', recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState)


  useEffect(() => {
    if (LOCATION.state.assoDocData.formid !== activeFormIdToolkitState) {
      getSavedDynamicFromsData(LOCATION.state?.assoDocData?.formid)
        .then((res) => {
          console.log("getSavedDocData RESPONSE", res);
          setdocumentData(res?.data);
          dispatch(
            dynamicFormStateManagementActions.setActiveFormIdMethod(
              LOCATION.state.assoDocData.formid
            )
          );
          dispatch(
            dynamicFormStateManagementActions.setFieldTypeDataMethod([])
          );
          dispatch(
            dynamicFormStateManagementActions.setAddedFieldTypeDataMethod([])
          );
          dispatch(
            dynamicFormStateManagementActions.setRecordOfPositionsOfAttributesMethod(
              {}
            )
          );
          dispatch(
            dynamicFormStateManagementActions.setAssoDocDataMethod(res?.data)
          );
          setfieldTypeData(dataManipulator(res?.data[0].formFields));
          // The "setManipulatedAttibutes" function is used to set the value of the "manipulatedAttibutes" state variable.
          // The value is obtained from the "dataManipulator" function, which processes the data received from "res?.data[0].formvals".
          // The processed data is an array with additional keys ("countOfAttribute" and "customFieldType") that are not present in the original "res" data.
          // These additional keys are used for rendering select tag options when multiple fields have the same "fieldType".
        })
        .catch((err) => console.log("getSavedDocData ERROR", err));
    }
    handleGetCanvasHeightAndWidth();
  }, [LOCATION.pathname]);


  useEffect(() => {
    if (LOCATION.state.assoDocData.formid == activeFormIdToolkitState) {
      setfieldTypeData(fieldTypeDataToolkitState);
      setAddedFieldTypeData(addedFieldTypeDataToolkitState);
      setrecordOfPositionsOfAttributes(
        recordOfPositionsOfAttributesToolkitState
      );
      setdocumentData(assoDocDataToolkitState);
      setMakeSmoothDrag(recordOfPositionsOfAttributesToolkitState);
    }
  }, []);

  // METHODS SECTION
  const handleAddAttributesIntoTheCanvas = useCallback(
    (e) => {
      // Filter the fieldTypeData array to remove the element with a matching fieldType
      const updatedData = fieldTypeData.filter((ele) => {
        let val;
        if (ele.countOfAttribute > 0) val = ele.customFieldType;
        else val = ele.fieldType;
        if (val !== e.target.value) {
          // If the fieldType does not match the clicked element's value, keep the element
          return ele;
        } else {
          // If the fieldType matches the clicked element's value, move the element to addedFieldTypeData
          setAddedFieldTypeData([...addedFieldTypeData, ele]);
        }
      });
      // Update fieldTypeData state with the filtered array
      setfieldTypeData(updatedData);
    },
    [fieldTypeData]
  );

  /**
   * This method is going to help delete the element from the canvas container
   */
  const handleDestroy = useCallback(() => {
    const { val, fieldType } = handleDestroyAttributesArgument;
    // Filter out the element with a matching ID from addedFieldTypeData
    const updatedData = addedFieldTypeData.filter((ele) => {
      if (ele.id !== val) {
        return ele;
      } else {
        // Move the matched element to fieldTypeData
        setfieldTypeData([...fieldTypeData, ele]);
      }
    });

    // Here we are delete those key which are delete while setting the page layout
    let newObj = {};
    for (let key in recordOfPositionsOfAttributes) {
      if (key !== fieldType) newObj[key] = recordOfPositionsOfAttributes[key];
    }
    setrecordOfPositionsOfAttributes(newObj);

    // Update addedFieldTypeData state with the filtered array
    setAddedFieldTypeData(updatedData);
    setShowDialog(false);
  }, [addedFieldTypeData, fieldTypeData, handleDestroyAttributesArgument]);

  const handleSetDestroyAttributesValues = useCallback(
    (val, fieldType) => {
      setShowDialog(true);
      setHandleDestroyAttributesArgument({ val, fieldType });
    },
    [handleDestroyAttributesArgument]
  );
  console.log("showDialog:", showDialog);
  /**
   * This function is getting use for store the positions of the canvas attributes
   */
  const handleStoreAttributesPosition = (coordinates, attributes) => {
    let key = null;

    // Determine the key based on the attributes
    if (attributes.countOfAttribute > 0) {
      // If countOfAttribute is greater than 0, use customFieldType as the key
      key = attributes.customFieldType;
    } else {
      // Otherwise, use fieldType as the key
      key = attributes.fieldType;
    }

    if (recordOfPositionsOfAttributes[key] == undefined) {
      // If the key does not exist in recordOfPositionsOfAttributes, add it with the provided coordinates
      setrecordOfPositionsOfAttributes({
        ...recordOfPositionsOfAttributes,
        [key]: coordinates,
      });
    } else {
      // If the key already exists in recordOfPositionsOfAttributes, update its coordinates
      setrecordOfPositionsOfAttributes({
        ...recordOfPositionsOfAttributes,
        [key]: coordinates,
      });
    }
  };

  const handleRenderAttributes = () => {
    console.log(
      "recordOfPositionsOfAttributes:",
      recordOfPositionsOfAttributes
    );

    dispatch(
      dynamicFormStateManagementActions.setFieldTypeDataMethod(fieldTypeData)
    );
    dispatch(
      dynamicFormStateManagementActions.setAddedFieldTypeDataMethod(
        addedFieldTypeData
      )
    );
    dispatch(
      dynamicFormStateManagementActions.setRecordOfPositionsOfAttributesMethod(
        recordOfPositionsOfAttributes
      )
    );
    dispatch(
      dynamicFormStateManagementActions.setActiveFormIdMethod(
        LOCATION.state.assoDocData.formid
      )
    );

    navigate("/canvas-document-print", {
      state: {
        recordOfPositionsOfAttributes,
        canvasDimensions,
        documentData,
        formName: LOCATION.state?.assoDocData?.name,
        alignMent,
      },
    });
  };

  function handleGetCanvasHeightAndWidth(layout = "a4") {
    const parentDiv = setupCanvasContainerRef.current;
    console.log("parentDiv:", parentDiv);
    const parentWidth = parentDiv.clientWidth;
    const parentHeight = parentDiv.clientHeight;

    // Calculate the width and height of an A4 page
    const a4Width = 210; // mm
    const a4Height = 297; // mm

    // Calculate the scale factor for the child div based on the parent dimensions
    const scaleFactor = Math.min(
      parentWidth / a4Width,
      parentHeight / a4Height
    );

    // Set the width and height of the child div
    const childDiv = setupCanvasChildRef.current;
    if (layout == "a4") {
      childDiv.style.width = `${Math.floor(scaleFactor * a4Width)}px`;
      childDiv.style.height = `${Math.floor(scaleFactor * a4Height)}px`;
      setCanvasDimensions({
        width: `${Math.floor(scaleFactor * a4Width)}`,
        height: `${Math.floor(scaleFactor * a4Height)}`,
      });
    } else {
      childDiv.style.width = `${Math.floor(scaleFactor * a4Height)}px`;
      childDiv.style.height = `${Math.floor(scaleFactor * a4Width)}px`;
      setCanvasDimensions({
        height: `${scaleFactor * a4Width}`,
        width: `${scaleFactor * a4Height}`,
      });
    }
  }

  const handleDragEndForImage = ({ x, y }, element) => {
    console.log(`Image dragged to x: ${x}, y: ${y}`);
    handleStoreAttributesPosition({ x, y }, element);
  };

  console.log("recordOfAttibutesPositions", recordOfPositionsOfAttributes);

  console.log("makeSmoothDrag:", makeSmoothDrag);
  return (
    <div className={Styles.setup_canvas_main_container}>
      {/* Page heading section  */}
      <div className={Styles.setup_canvas_heading_container}>
        <h3>Document : {LOCATION.state?.assoDocData?.name}</h3>
        <div>
          <Link to={-1} className="std_btn">
            Back
          </Link>
        </div>
      </div>

      {/* Component Body */}
      <section className={Styles.setup_canvas_body_container}>
        <aside className={Styles.setup_canvas_controller_container}>
          {/* This section contain the dropdown section  */}
          <div>
            {/* This section is showing all the attributes  */}
            <section
              className={Styles.setup_canvas_drop_down_attributes_container}
            >
              <select
                className={`${Styles.setup_canvas_std_select_tag}`}
                onChange={handleAddAttributesIntoTheCanvas}
                required
              >
                <option>Pick Elements</option>
                {fieldTypeData?.map((ele) => {
                  return (
                    <option
                      className={
                        Styles.setup_canvas_drop_down_attributes_options
                      }
                      key={ele.id}
                      value={
                        ele.countOfAttribute > 0
                          ? `${ele.fieldType + ele.countOfAttribute}`
                          : ele.fieldType
                      }
                    >
                      {ele.countOfAttribute > 0
                        ? `${ele.fieldType} - ${ele.countOfAttribute}`
                        : ele.fieldType}{" "}
                      :: {ele.fieldName}
                    </option>
                  );
                })}
              </select>

              {/* In this section you can select the size of the canvas exp (A4, Horizontal) */}

              <select
                required
                className={Styles.setup_canvas_std_select_tag}
                onChange={(e) => {
                  handleGetCanvasHeightAndWidth(e.target.value);
                  setAlignment(e.target.value);
                }}
                defaultValue={alignMent}
              >
                <option value="a4">A4</option>
                <option value="landscape">Landscape</option>
              </select>
            </section>

            {/* This section contain one select tag which will store the retup on the backend and, If you have any previous setup than you can render that setup as well    */}
            <section>
              {/* <select className={Styles.setup_canvas_std_select_tag}>
                <option>Setup one</option>
                <option>Abhi</option>
                <option>Setup one</option>
                <option>Setup one</option>
              </select> */}
              <section className={Styles.setup_canvas_draw_control}>


                <button
                  className={allowLines ? "std_btn_active" : "std_btn"}
                  onClick={() => setAllowLines(!allowLines)}
                >
                  {allowLines ? <MdDraw /> : <MdGesture />}
                </button>


                <button
                  className={`std_btn ${!allowLines ? "std_btn_disabled" : ""}`}
                  onClick={() => handleUndoLines(lines, setLines, dispatch, dynamicFormStateManagementActions, undoLinesToolkitState, redoLinesToolkitState, recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState, recordOfLinesCoordinatesToolkitState,recordOfUndoLinesCoordinatesToolkitState,recordOfUndoLinesAreAvailableInToolkit)}
                ><ImUndo />
                </button>

                <button
                  className={`std_btn ${!allowLines ? "std_btn_disabled" : ""}`}
                  onClick={() => handleRedoLines(lines, setLines, dispatch, dynamicFormStateManagementActions, undoLinesToolkitState, redoLinesToolkitState, recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState, recordOfLinesCoordinatesToolkitState,recordOfUndoLinesCoordinatesToolkitState,recordOfUndoLinesAreAvailableInToolkit)}
                ><ImRedo />
                </button>

              </section>
              {/* <div>
                <button className={Styles.setup_canvas_std_button}>
                  Save Setup
                </button>
              </div> */}
            </section>

            {/* This section the container the render button which help us to render the page in based on the out retup attributes */}
            <section className={Styles.setup_canvas_render}>
              <button
                className={Styles.setup_canvas_std_button}
                onClick={handleRenderAttributes}
              >
                Render
              </button>
            </section>
          </div>
        </aside>
        <div className={Styles.setup_canvas_line}></div>
        <section
          className={Styles.setup_canvas_container}
          ref={setupCanvasContainerRef}
        >
          <div className={Styles.setup_canvas_child} ref={setupCanvasChildRef}>
            {/* This is the canvas section */}
            <Stage
              className={Styles.canvas_container}
              width={Number(canvasDimensions.width)}
              height={Number(canvasDimensions.height)}
              // from here these function will work for dynamic lines
              ref={stageRef}
              onMouseDown={(e) => handleMouseDown(e, allowLines, stageRef, startPos, clickTimeout, setIsDrawing, lines)}
              onMouseMove={(e) => handleMouseMove(e, stageRef, startPos, lines, isDrawing, setLines, dynamicFormStateManagementActions,
                recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState,
                recordOfLinesCoordinatesToolkitState, dispatch)}
              onMouseUp={() => handleMouseUp(allowLines, clickTimeout, setIsDrawing, recordOfLinesCoordinatesToolkitState, lines, dispatch, dynamicFormStateManagementActions, recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState,)}
            >
              <Layer ref={layerRef}>
                {addedFieldTypeData.map((ele, i) => {
                  console.log("ele:", ele);
                  let val =
                    ele.countOfAttribute > 0
                      ? ele.customFieldType
                      : ele.fieldType;
                  return (
                    <>
                      {ele.fieldType !== "file" ? (
                        <Group
                          x={makeSmoothDrag[val] ? makeSmoothDrag[val].x : ""}
                          y={makeSmoothDrag[val] ? makeSmoothDrag[val].y : ""}
                          key={i}
                          draggable
                          onDragStart={() => handleDragStart}
                          onDragEnd={(e) => {
                            setMakeSmoothDrag(
                              removeAnyKeyFromAnObject(val, makeSmoothDrag).updatedValues
                            ); // "removeAnyKeyFromAnObject" method is delete any specific key from your object, It needs two arguments (keyName,actualObject)
                            handleDragEnd(
                              e,
                              ele,
                              handleStoreAttributesPosition
                            );
                          }}
                          onDragMove={handleDragMove}
                          onDrop={handleDrop}
                          onDragOver={(e) => e.evt.preventDefault()}
                        >
                          <CanvasCustomText
                            canvasDimensions={canvasDimensions}
                            title={ele.fieldType}
                            element={ele}
                            handleDestroy={() =>
                              handleSetDestroyAttributesValues(
                                ele.id,
                                ele.countOfAttribute > 0
                                  ? ele.customFieldType
                                  : ele.fieldType
                              )
                            }
                          />
                        </Group>
                      ) : (
                        <DraggableResizableImage
                          src={defaultImage}
                          x={makeSmoothDrag[val] ? makeSmoothDrag[val].x : ""}
                          y={makeSmoothDrag[val] ? makeSmoothDrag[val].y : ""}
                          // x={15}
                          // y={15}
                          onDragEnd={handleDragEndForImage}
                          element={ele}
                          handleDestroy={() =>
                            handleSetDestroyAttributesValues(
                              ele.id,
                              ele.countOfAttribute > 0
                                ? ele.customFieldType
                                : ele.fieldType
                            )
                          }
                        />
                      )}
                    </>
                  );
                })}
              </Layer>
              <Layer ref={lineLayerRef}>
                {/* {lines.current.map((line, index) => ( */}
                {lines?.map((line, index) => (
                  <Line key={index} {...line} />
                ))}
              </Layer>
            </Stage>
          </div>
          {/* <button onClick={handleSplitLines}>split</button> */}
        </section>
      </section>
      <ClonosConfirmationDialog
        Open={showDialog}
        Title="Remove Attribute"
        Content="Are you really want to remove the element from the canvas?"
        CloseDialog={() => setShowDialog(false)}
        ProceedDialog={() => handleDestroy()}
      />
    </div>
  );
};

export default SetupCanvas;
