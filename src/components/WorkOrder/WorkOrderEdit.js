import { useState } from 'react'
import { useEffect } from 'react'
import LabelUploader from './LabelUploader'
import LabelDateComp from './LabelDateComp'
import { AiFillDelete } from "react-icons/ai"
import LabelInputComp from './LabelInputComp'
import { useLocation, useNavigate } from 'react-router-dom'
import LabelSelectComp from './LabelSelectComp'
import { AiFillCloseCircle } from "react-icons/ai"
import Modal from '../CommonComponents/Modal/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { Checkbox, Container, Tooltip } from '@material-ui/core'
import useToggler from '../../CustomHooks/TogglerHook'
import searchIcon from "../../assets/UIUX/icons/search.svg"
import addTaskIcon from "../../assets/UIUX/icons/plus-square.svg"
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { userActions } from "../../Store/Reducers/ClonosUserReducer"
import selectDownIcon from "../../assets/UIUX/icons/chevron-down.svg"
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer"
import Styles from "../../ModuleStyles/WorkOrder/WorkOrder.module.css"
import ClonosConfirmationDialog from '../Dialogs/ClonosConfirmationDialog'
import { UnAuthorizedModal } from '../CommonComponents/UnAuthorizedPage/UnAuthorizedModal'
import { workOrderStateManagementActions } from "../../Store/Reducers/ClonosWorkOrderReducer"
import { getCurrentDate, handleGetHeightOrWidthBasedOnId, handleLoggedInUser, handleRedirectAfterEvent, handleUpdateLayoutDelaySetter, loginJumpLoadingStopper, updateLayout } from '../../utils/clonosCommon'
import { handleChange, handleDeleteSubtasks, handleDeleteWorkOrderDocument, handleDeleteWorkOrderTask, handleEditWorkOrderTask, handleGetAssetDropdown, handleGetPriorityDropdown, handleGetSingleWorkOrder, handleGetTeamsDropDown, handleGetUsersDropdownData, handleSubmitForEditWorkOrder, handleSubmitFormValues } from '../../utils/WorkOrderMethods/WorkOrderMethods'


// new imports 
import backButton from "../../assets/UIUX/icons/WO/circle-chevron-left.svg"
import { FaGreaterThan } from "react-icons/fa"
import { CheckBox } from '@material-ui/icons'
import DropdownModal from '../CommonComponents/DropDownModal/DropdownModal'
import DynamicDropdown from '../CommonComponents/DynamicDropdown/DynamicDropdown'
import { handleGetStaticDropdownValues } from '../../utils/DropdownsMethods/DropdownsMethods'
import FileUploader from '../CommonComponents/FileUploader/FileUploader'
import WO_Add_Task_Icon from "../../assets/UIUX/icons/WO/WO_add_task.svg"
import WO_Task_Delete_Icon from "../../assets/UIUX/icons/Common_Component/File_Uploader/file_uploader_delete.svg"
import WorkOrderTask from './WorkOrderTask'

let primaryObject = {}
const WorkOrderEdit = () => {
      // Global States 
      const store = useSelector(store => store)
      const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
      const { singleWorkOrderToolkitState } = useSelector(store => store.workOrderStateManagement)
      const { workOrderDocuments, workOrderTasks, workOrderDetails } = singleWorkOrderToolkitState
      console.log('workOrderTasks:', workOrderTasks)

      console.log('singleWorkOrderToolkitState:', singleWorkOrderToolkitState)


      // Local States 
      let navigate = useNavigate()
      let [isOpen, setIsOpen] = useToggler()
      let [formValues, setFormValues] = useState({})
      let [inputSubtastLength, setInputSubtastLength] = useState([[]]);
      let [formValidation, setFormValidation] = useState(primaryObject)

      let [priorityDropdownData, setPriorityDropdownData] = useState(store?.workOrderStateManagement?.workOrderPriorityDropdownToolkitState)
      let [usersDropdownData, setUsersDropdownData] = useState(store?.userData?.allUsersDropdownToolkitState)
      let [assetDropdownData, setAssetDropdownData] = useState(store?.assetData?.assetDropdownToolkitState)
      let [teamDropdownData, setTeamDropdownData] = useState(store?.userData?.teamsDropdownToolkitState)
      let [assetDepartmentDropdownData, setAssetDepartmentDropdownData] = useState([])
      const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")
      let [draftAlert, setDraftAlert] = useToggler()
      let [lcIntervals, setLcIntevals] = useState({})
      let dispatch = useDispatch()
      let LOCATION = useLocation()


      // New Local States 
      let [isAssetDropdownOpen, setIsAssetDropdownOpen] = useToggler()
      let [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useToggler()
      let [isTeamDropdownOpen, setIsTeamDropdownOpen] = useToggler()
      let [needToDeleteTasks, setNeedToDeleteTask] = useState([])
      let [needToEditTasks, setNeedToEditTask] = useState([])
      console.log('needToEditTasks:', needToEditTasks)
      console.log('needToDeleteTasks:', needToDeleteTasks)
      let [lcDefaultTasks, setLcDefaultTasks] = useState([])
      console.log('lcDefaultTasks:', lcDefaultTasks)
      // Dropdown Pagination States 
      let [assetPaginationCurrentPage, setAssetPaginationCurrentPage] = useState(1)

      const handleGetValues = ({ e, files, selectedOption, type, name }) => {
            if (selectedOption && type == "select") {
                  selectedOption = selectedOption.length && JSON.parse(selectedOption)
            }

            if (type == "select") {
                  setFormValues({ ...formValues, [name]: { [`${name}Id`]: selectedOption.value, [`${name}Name`]: selectedOption.label } })
                  setFormValidation({ ...formValidation, [name]: { ...formValidation[name], ["value"]: selectedOption?.value } })
            }
            else if (type == "file") {
                  setFormValues({ ...formValues, [name]: files })
            }
            else if (type == "isEditable") {
                  setFormValues({ ...formValues, [name]: selectedOption })
            }
            else if (type == "dynamicDropdown") {
                  setFormValues({ ...formValues, [name]: selectedOption })
                  setFormValidation({ ...formValidation, [name]: { ...formValidation[name], ["value"]: selectedOption } })
            }
            else {
                  setFormValues({ ...formValues, [e.target.name]: e.target.value })
                  setFormValidation({ ...formValidation, [name]: { ...formValidation[name], ["value"]: e.target.value } })
            }
      }

      const handleGetErrorMethods = ({ name, selectedOption, setShowErrorMessage, type, valueSetterMethod, isMandatory }) => {
            if (selectedOption && type == "select") {
                  selectedOption = selectedOption.length > 0 && JSON.parse(selectedOption)
            }
            if (type == "select") {
                  if (primaryObject[name] == undefined) primaryObject[name] = { ["method"]: setShowErrorMessage, ["value"]: selectedOption?.value, ["emptyFieldsMethod"]: valueSetterMethod, isMandatory }
            }
            else if (type == "dynamicDropdown") {
                  if (primaryObject[name] == undefined) primaryObject[name] = { ["method"]: setShowErrorMessage, ["value"]: selectedOption?.name, ["emptyFieldsMethod"]: valueSetterMethod, isMandatory }
            }
            else {
                  if (primaryObject[name] == undefined) primaryObject[name] = { ["method"]: setShowErrorMessage, ["value"]: selectedOption, ["emptyFieldsMethod"]: valueSetterMethod, isMandatory }
            }
      }


      const handleMoreData = ({ isActivator }) => {
            if (isActivator) {
                  setAssetPaginationCurrentPage((prev) => {
                        let updatedPageCount = prev + 1
                        handleGetAssetDropdown({ setAssetDropdownData, assetDropdownData, assetPaginationCurrentPage: updatedPageCount, dispatch })
                        return updatedPageCount
                  })
            }
      }

      const handleMakeFocusOnTastInputTag = ({ elementIdName }) => {
            let lcElement = document.querySelectorAll(`#${elementIdName}`)
            console.log('lcElement:', lcElement)
            lcElement[lcElement.length - 1].focus()
      }

      const handleNeedToDeleteTasks = (props) => {
            props.lcNeedToDeleteTaskStateMethod((prev) => [...prev, props?.task?.woTaskId])
            let updatedDate = props?.lcDefaultTasksState?.filter(ele => ele.woTaskId != props?.task?.woTaskId)
            props?.lcDefaultTasksStateMethod(updatedDate)
      }

      const handleNeedToEditTasks = (props) => {
            props?.lcDefaultTasksStateMethod((prev) => {
                  let temp = prev?.map((ele) => {
                        let lcPrev = { ...ele }
                        if (props?.task?.woTaskId == lcPrev.woTaskId) {
                              lcPrev.woTaskName = props?.event?.target?.value
                              props?.lcNeedToEditTaskStateMethod((item) => {
                                    let oldElementWithoutCurrentItem = item.filter(lcItem => lcItem?.woTaskId !== lcPrev?.woTaskId)
                                    return [...oldElementWithoutCurrentItem, lcPrev]
                              })
                        }
                        return lcPrev
                  })
                  return temp
            })
      }


      useEffect(() => {
            // Update the layout based on dispatch action.
            updateLayout({ dispatch });

            // Set a timeout to stop loading (if applicable) after 5000 milliseconds.
            let interval = loginJumpLoadingStopper({ setterFunction: setIsLocalLoading, timeout: 5000 });

            // Fetch and update user dropdown data.
            handleGetUsersDropdownData({ setUsersDropdownData, usersDropdownData, dispatch });

            // Fetch and update asset dropdown data along with pagination information.
            handleGetAssetDropdown({ setAssetDropdownData, assetDropdownData, assetPaginationCurrentPage, dispatch });

            // Fetch and update static dropdown values for Asset Department.
            handleGetStaticDropdownValues({ staticDropdownNameOrId: "AssetDepartment", dispatch, setterFunctionForValues: setAssetDepartmentDropdownData });

            // Fetch and update static dropdown values for Work Order Priority.
            handleGetStaticDropdownValues({ staticDropdownNameOrId: "WorkOrderPriority", dispatch, setterFunctionForValues: setPriorityDropdownData });

            // Fetch and update static dropdown values for Team.
            handleGetStaticDropdownValues({ staticDropdownNameOrId: "Team", dispatch, setterFunctionForValues: setTeamDropdownData });

            // This function will set the layout after the component and return the interval that we will save in the local state.
            setLcIntevals({ ...lcIntervals, "updateLayoutInterval": handleUpdateLayoutDelaySetter({ dispatch }) })

            handleGetSingleWorkOrder({ dispatch, workOrderId: LOCATION?.state?.workOrderId })

            if (workOrderTasks?.length > 0) {
                  setLcDefaultTasks(workOrderTasks)
            }
            return () => {
                  // Clear the loading interval.
                  clearInterval(interval);
                  clearInterval(lcIntervals['subtasksInterval'])
                  clearInterval(lcIntervals['updateLayout'])
                  clearInterval(lcIntervals['editWorkOrder'])
                  // Reset the primaryObject (This varialbe is getting us for validate the fields).
                  primaryObject = {};
            };
      }, []);


      if (handleLoggedInUser()?.permissions?.includes('wko001')) {
            return (
                  <>
                        <div className={Styles.work_order_main_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
                              <nav className={Styles.work_order_nav} /** c = customize */ >
                                    <div className={Styles.work_order_nav_first_child}>
                                          <bdi>Status:</bdi>
                                          {
                                                ["Draft", "Scheduled", "Accepted", "Completed"].map((element, index) => {
                                                      let changeColor = workOrderDetails?.status == element
                                                      if (index > 0) return <div style={{ color: changeColor ? "#D24B5A" : "#757575", fontWeight: changeColor ? "500" : "400" }}> <FaGreaterThan /> <span>{element}</span></div>
                                                      return <span style={{ color: changeColor ? "#D24B5A" : "#757575", fontWeight: changeColor ? "500" : "400" }}>{element}</span>
                                                })
                                          }
                                    </div>
                                    <div className={Styles.work_order_nav_second_child}>
                                          <div className={Styles.work_order_nav_second_child_current_date}><bdi>Created On</bdi> <span>{getCurrentDate()}</span></div>
                                    </div>
                              </nav>
                              <section style={{ height: `${mainLayoutChildrenPositionsToolkitState?.pixelUnit?.remainingPart?.height.split("p")[0] - 70}px` }} className={Styles.work_order_content_container}>
                                    <div className={Styles.work_order_content_body}>
                                          <div id='work_order_first_child_container' className={Styles.work_order_first_child_container}>
                                                <LabelInputComp handleGetErrorMethods={handleGetErrorMethods} defaultValue={workOrderDetails?.title} itemRef={"itemRef"} label="Work order Title" type="text" handleGetValues={handleGetValues} name={"title"} placeholder="Work Order Title" isMandatory={true} />
                                                <div className={Styles.work_order_require_work_permit}>
                                                      <input type="checkbox" style={{ backgroundColor: "pink" }} />
                                                      <span>Require Work Permit</span>
                                                </div>
                                                <LabelInputComp handleGetErrorMethods={handleGetErrorMethods} defaultValue={workOrderDetails?.description} itemRef={"itemRef"} label="Description" type="text" handleGetValues={handleGetValues} name={"description"} placeholder="Description" unique={true} />
                                                <LabelSelectComp handleGetErrorMethods={handleGetErrorMethods} defaultValue={workOrderDetails?.department?.departmentId && workOrderDetails?.department?.departmentId} label="Department" handleGetValues={handleGetValues} name={"department"} placeholder="Select" options={assetDepartmentDropdownData} source={searchIcon} isMandatory={true} />
                                                <LabelSelectComp handleGetErrorMethods={handleGetErrorMethods} defaultValue={workOrderDetails?.priority?.priorityId && workOrderDetails?.priority?.priorityId} label="Priority" handleGetValues={handleGetValues} name={"priority"} placeholder="Select" options={priorityDropdownData} source={selectDownIcon} isMandatory={true} />
                                                <DynamicDropdown handleGetErrorMethods={handleGetErrorMethods} defaultValue={[workOrderDetails?.asset]} title={"Asset"} labelActivator={"Asset Name"} isOpen={isAssetDropdownOpen} isOpenMethod={setIsAssetDropdownOpen} heading={"Select from Asset Library"} placeholder={"Search"} isSearchable={true} isCheckbox={false} isAsset={true} isDynamicLoad={true} data={assetDropdownData} isActivator={true} isMandatory={true} url={searchIcon} handleMoreData={handleMoreData} handleGetValues={handleGetValues} />
                                                <div className={Styles.work_order_fc_date_and_time}>
                                                      <LabelDateComp handleGetErrorMethods={handleGetErrorMethods} defaultValue={workOrderDetails?.startDate} type="date" label="Start Date" handleGetValues={handleGetValues} name={"startDate"} placeholder="12/30/9999" isMandatory={true} />
                                                      <LabelDateComp handleGetErrorMethods={handleGetErrorMethods} type="date" defaultValue={workOrderDetails?.endDate} label="End Date" handleGetValues={handleGetValues} name={"endDate"} placeholder="12/30/9999" formValues={formValues} isMandatory={true} />
                                                </div>
                                                <div className={Styles.work_order_fc_date_and_time}>
                                                      <LabelInputComp handleGetErrorMethods={handleGetErrorMethods} defaultValue={workOrderDetails?.estimationDays} itemRef={"itemRef"} label="Estimation Days" type="number" handleGetValues={handleGetValues} name={"estimationDays"} placeholder="Estimation Days" isMandatory={true} />
                                                      <LabelInputComp handleGetErrorMethods={handleGetErrorMethods} defaultValue={workOrderDetails?.hours} itemRef={"itemRef"} label="Hours" type="number" handleGetValues={handleGetValues} name={"hours"} placeholder="Hours" isMandatory={true} />
                                                </div>
                                                <DynamicDropdown handleGetErrorMethods={handleGetErrorMethods} defaultValue={workOrderDetails?.team} title={"Team"} labelActivator={"Team Name"} heading={"Select from Team Library"} placeholder={"Search"} isSearchable={true} isCheckbox={true} isDynamicLoad={false} data={teamDropdownData} isActivator={true} isMandatory={true} url={searchIcon} handleMoreData={handleMoreData} handleGetValues={handleGetValues} />
                                                <DynamicDropdown handleGetErrorMethods={handleGetErrorMethods} defaultValue={workOrderDetails?.assignee} title={"Assignee"} labelActivator={"User Name"} isOpen={isAssigneeDropdownOpen} isOpenMethod={setIsAssigneeDropdownOpen} heading={"Select from Users Library"} placeholder={"Search"} isSearchable={true} isCheckbox={false} isUser={true} isDynamicLoad={false} data={usersDropdownData} isActivator={true} isMandatory={true} url={searchIcon} handleMoreData={handleMoreData} handleGetValues={handleGetValues} />
                                          </div>

                                          <div style={{ height: `${handleGetHeightOrWidthBasedOnId({ idName: "work_order_first_child_container" }).height}px` }} className={Styles.work_order_second_child_container}>
                                                <div>
                                                      <FileUploader label="Documents" typeOfRecord={"Files"} title="Documents" isMandatory={false} limit={10} fileSizeInMB={10} acceptableFileTypes={[".jpg", ".jpeg", ".pdf", ".docs"]} defaultValue={workOrderDocuments} handleGetSelectedData={handleGetValues} />
                                                      <div className={Styles.work_order_add_task}>
                                                            <header className={Styles.wo_ad_header}>
                                                                  <p>Add step-by-step procedures, safety precautions, required tools or equipment, and any additional documentation or references</p>
                                                            </header>
                                                            <section className={Styles.wo_ad_content}>
                                                                  <div className={Styles.wo_adc_controllers}>
                                                                        <span>Add from Task Library</span>
                                                                        <div onClick={() =>
                                                                              setInputSubtastLength([...inputSubtastLength, []])
                                                                        }>
                                                                              <img src={WO_Add_Task_Icon} alt="Add Task" />
                                                                              <span>Add Task</span>
                                                                        </div>
                                                                  </div>
                                                                  <div className={Styles.wo_adc_body}>
                                                                        {
                                                                              lcDefaultTasks?.map((ele, i) => {
                                                                                    return <WorkOrderTask index={i} element={ele}
                                                                                          handleChange={(event) => {
                                                                                                console.log('event:', event)
                                                                                                handleNeedToEditTasks({ task: ele, event, lcNeedToEditTaskStateMethod: setNeedToEditTask, lcDefaultTasksStateMethod: setLcDefaultTasks })
                                                                                          }
                                                                                          }
                                                                                          handleDeleteExistingTask={() => { handleNeedToDeleteTasks({ task: ele, lcNeedToDeleteTaskStateMethod: setNeedToDeleteTask, lcDefaultTasksState: lcDefaultTasks, lcDefaultTasksStateMethod: setLcDefaultTasks }) }} />
                                                                              })
                                                                        }
                                                                        {inputSubtastLength.map((ele, i) => {
                                                                              return (
                                                                                    <div
                                                                                          className={Styles.work_order_tasks}
                                                                                          key={i}
                                                                                          display="flex"
                                                                                          justifyContent="space-between"
                                                                                          margin="10px"
                                                                                    >
                                                                                          <div className={Styles.work_order_tasks_input}>
                                                                                                <p>Task {i + 1 + lcDefaultTasks?.length} -</p>
                                                                                                <input

                                                                                                      id="subtasks"
                                                                                                      value={ele}
                                                                                                      w="80%"
                                                                                                      onChange={(e) => handleChange(e, i, inputSubtastLength, setInputSubtastLength)}
                                                                                                      onKeyDown={(e) => {
                                                                                                            console.log("keyCode", e.keyCode)
                                                                                                            if (e.keyCode === 13) {
                                                                                                                  setInputSubtastLength([...inputSubtastLength, []])
                                                                                                                  let interval = setTimeout(() => {
                                                                                                                        handleMakeFocusOnTastInputTag({ elementIdName: "subtasks" })
                                                                                                                  }, 100)
                                                                                                                  setLcIntevals({ ...lcIntervals, ["subtasksInterval"]: interval })
                                                                                                            }
                                                                                                      }}
                                                                                                      required
                                                                                                      placeholder="Enter Your Task..."

                                                                                                />
                                                                                          </div>
                                                                                          <img src={WO_Task_Delete_Icon} alt='Delete WO' onClick={() => handleDeleteSubtasks(i, inputSubtastLength, setInputSubtastLength)} />
                                                                                    </div>
                                                                              );
                                                                        })}
                                                                  </div>

                                                            </section>
                                                      </div>
                                                </div>
                                                <div className={Styles.work_order_second_child_submit}>
                                                      <div>
                                                            {/* <button onClick={() => {
                                                                  setFormValues({})
                                                                  setInputSubtastLength([])
                                                                  navigate(-1)
                                                            }}>Cancel</button> */}
                                                            <button onClick={() => setDraftAlert(true)}>Cancel</button>
                                                            <button onClick={() => {
                                                                  handleSubmitForEditWorkOrder({ formValues, workOrderId: workOrderDetails?.workOrderId, inputSubtastLength, formValidation, dispatch, commonActions, isEditable: true, status: workOrderDetails?.status, navigate })
                                                                  formValues?.needToDeleteDocuments?.length > 0 && handleDeleteWorkOrderDocument({ dispatch, workOrderDocumentIds: formValues?.needToDeleteDocuments })
                                                                  needToDeleteTasks?.length > 0 && handleDeleteWorkOrderTask({ "workOrderTaskIds": needToDeleteTasks, dispatch })
                                                                  needToEditTasks?.length > 0 && handleEditWorkOrderTask({ "workOrderTasks": needToEditTasks, dispatch })
                                                            }}>Save</button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </section>
                        </div>
                        <Modal isOpen={isOpen} closeModalMethod={setIsOpen}>
                              <div className={Styles.work_order_add_task_modal} >
                                    <header className={Styles.work_order_add_task_modal_header}>
                                          <span>Add Tasks</span>
                                    </header>
                                    <section>
                                          <div>
                                                <p>Add step-by-step procedures, safety precautions, required tools or equipment, and any additional documentation or references</p>
                                          </div>
                                          <div>
                                                <span onClick={() =>
                                                      setInputSubtastLength([...inputSubtastLength, []])
                                                }>+ Tasks</span>
                                          </div>
                                          <div>
                                                {inputSubtastLength.map((ele, i) => {
                                                      return (
                                                            <div
                                                                  className={Styles.work_order_tasks}
                                                                  key={i}
                                                                  display="flex"
                                                                  justifyContent="space-between"
                                                                  margin="10px"
                                                            >
                                                                  <input
                                                                        id="subtasks"
                                                                        value={ele}
                                                                        w="80%"
                                                                        onChange={(e) => handleChange(e, i, inputSubtastLength, setInputSubtastLength)}
                                                                        onKeyDown={(e) => {
                                                                              console.log("keyCode", e.keyCode)
                                                                              if (e.keyCode === 13) {
                                                                                    setInputSubtastLength([...inputSubtastLength, []])
                                                                              }
                                                                        }}
                                                                        required
                                                                        placeholder="Enter Your Task..."

                                                                  />

                                                                  <AiFillCloseCircle onClick={() => handleDeleteSubtasks(i, inputSubtastLength, setInputSubtastLength)} />
                                                            </div>
                                                      );
                                                })}
                                          </div>
                                    </section>
                                    <button onClick={() => setIsOpen(false)} className={Styles.work_order_add_task_modal_back} >Back</button>
                                    <footer className={Styles.work_order_add_task_modal_footer}>
                                          <button onClick={() => setIsOpen(false)}>Continue</button>
                                    </footer>
                              </div>
                        </Modal>
                        <ClonosConfirmationDialog
                              Open={draftAlert}
                              Title="Edit Work Order"
                              Content="Are you sure, You don't want to edit this work order?"
                              CloseDialog={() => setDraftAlert(false)}
                              ProceedDialog={() => {
                                    let interval = handleRedirectAfterEvent({ targetRoute: -1, timeout: 1000, navigate })
                                    setLcIntevals({ ...lcIntervals, ["editWorkOrder"]: interval })
                                    setDraftAlert(false)
                              }}
                        />
                  </>

            )
      }
      return !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
            <Container component="main" maxWidth="sm">
                  <UnAuthorizedModal />
            </Container>
}

export default WorkOrderEdit