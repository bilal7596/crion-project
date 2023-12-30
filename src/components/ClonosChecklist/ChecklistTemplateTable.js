import { memo } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TEMPLATE_CREATION_GRIP_VERTICAL from "../../assets/UIUX/icons/Checklist/grip-vertical.svg";
import Styles from "../../ModuleStyles/ChecklistAndReports/ClonosChecklist/TemplateCreationPage.module.css";
import { ChecklistTemplateRowActions } from "./ChecklistTemplateRowActions";
import SingleFieldValueComponent from "./AttributeElements/SingleFieldValueComponent";
import { MultipleFieldValueComponent } from "./AttributeElements/MultipleFieldValueComponent";
import { useSelector } from "react-redux";
import { handleReturnedFieldValue } from "../../utils/ChecklistAndReportsMethods/ChecklistMethod";
import { useDispatch } from "react-redux";
import { ChecklistAndReportsAction } from "../../Store/Reducers/ClonosChecklistAndReportsReducer";
const ChecklistTemplateTable = ({
  setSelectedAttributes,
  uploadedAttributesFiles,
  getUploadedAttributesFiles,
}) => {
  const columns = [
    { name: "SI.NO", width: "5%" },
    { name: "TASK NAME", width: "30%" },
    { name: "DEFAULT VALUE", width: "30%" },
    { name: "TYPE", width: "10%" },
    { name: "ACTION", width: "15%" },
  ];

  const { checklistTemplateAttributes } = useSelector(
    (store) => store?.checklistTemplateData
  );
  const dispatch = useDispatch();
  const handleDragEnd = (result) => {
    console.log(
      checklistTemplateAttributes,
      "checklistTemplateAttributes before"
    );
    const { source, destination } = result;

    // Check if the item was dropped outside any droppable area
    if (!destination) return;

    // Reorder the items in the state
    const reorderedAttributes = Array.from(checklistTemplateAttributes);
    const [removed] = reorderedAttributes.splice(source.index, 1);
    reorderedAttributes.splice(destination.index, 0, removed);
    console.log(reorderedAttributes, "reorderedAttributes", removed);
    // Update the state using your Redux action
    dispatch(
      ChecklistAndReportsAction.setSelectedAttributesToolkitState(
        reorderedAttributes
      )
    );
  };

  const handleGetAttributeComponentValule = ({id,dispatch,attributes,value}) => {
    if(Object.keys(value)?.length){
      handleReturnedFieldValue({id,...value,dispatch,attributes})
    } 
  }
  console.log(checklistTemplateAttributes, "checklistTemplateAttributes after");
  return (
    <div
      area-aria-label="checklist template main container"
      className={Styles.template_table_container}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={Styles.custom_table_container}>
          <div className={Styles.custom_table_head}>
            {columns?.map((col) => {
              return (
                <p style={{ width: col?.width }} key={col?.name}>
                  {col?.name}
                </p>
              );
            })}
          </div>
          <Droppable droppableId="droppable-1">
            {(provider) => (
              <div
                ref={provider.innerRef}
                {...provider.droppableProps}
                className={Styles.custom_table_body}
              >
                {checklistTemplateAttributes?.length > 0 &&
                  checklistTemplateAttributes?.map((attribute, index) => {
                    return (
                        <Draggable
                          key={attribute.attributeName}
                          draggableId={attribute.attributeName}
                          index={index}
                        >
                          {(provider) => (
                            <div
                              {...provider.draggableProps}
                              ref={provider.innerRef}
                              className={Styles.custom_table_row}
                            >
                              <div className={Styles.template_table_col_index}>
                                <div
                                  {...provider.dragHandleProps}
                                  className={Styles.template_table_col_handle}
                                >
                                  <img src={TEMPLATE_CREATION_GRIP_VERTICAL} />
                                </div>
                                <p>{index + 1}</p>
                              </div>
                              {attribute?.attributeName === "Text" && (
                                <SingleFieldValueComponent
                                  attribute={attribute}
                                  getFieldDetails={(value) =>
                                    handleGetAttributeComponentValule({
                                      id: attribute?.id,
                                      value,
                                      dispatch,
                                      attributes: checklistTemplateAttributes,
                                    })
                                  }
                                />
                              )}
                              {attribute?.attributeName === "Number" && (
                                <SingleFieldValueComponent
                                  attribute={attribute}
                                  getFieldDetails={(value) =>
                                    handleGetAttributeComponentValule({
                                      id: attribute?.id,
                                      value,
                                      dispatch,
                                      attributes: checklistTemplateAttributes,
                                    })
                                  }
                                />
                              )}
                              {attribute?.attributeName ===
                                "Multiple Choice" && (
                                <MultipleFieldValueComponent
                                  attribute={attribute}
                                  getFieldDetails={(value) =>
                                    handleGetAttributeComponentValule({
                                      id: attribute?.id,
                                      value,
                                      dispatch,
                                      attributes: checklistTemplateAttributes,
                                    })
                                  }
                                />
                              )}
                              {attribute?.attributeName === "Dropdown" && (
                                <MultipleFieldValueComponent
                                  attribute={attribute}
                                  getFieldDetails={(value) =>
                                    handleGetAttributeComponentValule({
                                      id: attribute?.id,
                                      value,
                                      dispatch,
                                      attributes: checklistTemplateAttributes,
                                    })
                                  }
                                />
                              )}
                              {attribute?.attributeName === "Date" && (
                                <SingleFieldValueComponent
                                  attribute={attribute}
                                  getFieldDetails={(value) =>
                                    handleGetAttributeComponentValule({
                                      id: attribute?.id,
                                      value,
                                      dispatch,
                                      attributes: checklistTemplateAttributes,
                                    })
                                  }
                                />
                              )}
                              {attribute?.attributeName === "Checkboxes" && (
                                <MultipleFieldValueComponent
                                  attribute={attribute}
                                  getFieldDetails={(value) =>
                                    handleGetAttributeComponentValule({
                                      id: attribute?.id,
                                      value,
                                      dispatch,
                                      attributes: checklistTemplateAttributes,
                                    })
                                  }
                                />
                              )}
                              <div
                                className={
                                  Styles.template_table_col_type_container
                                }
                              >
                                <p className={Styles.template_table_col_type}>
                                  {attribute?.attributeName}
                                </p>
                              </div>
                              <div
                                className={
                                  Styles.template_table_col_action_container
                                }
                              >
                                <ChecklistTemplateRowActions
                                  attribute={attribute}
                                  attributes={checklistTemplateAttributes}
                                  uploadedAttributesFiles={uploadedAttributesFiles}
                                  getUploadedAttributesFiles={(val) =>
                                    getUploadedAttributesFiles(val)
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                    );
                  })}
                  {provider.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
};

export default memo(ChecklistTemplateTable);
