import { useState } from 'react'
import { useEffect } from 'react'
import LabelUploader from './LabelUploader'
import LabelDateComp from './LabelDateComp'
import { AiFillDelete } from "react-icons/ai"
import LabelInputComp from './LabelInputComp'
import { useNavigate } from 'react-router-dom'
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
import { generateUniqueId, getCurrentDate, handleGetHeightOrWidthBasedOnId, handleLoggedInUser, handleRedirectAfterEvent, handleUpdateLayoutDelaySetter, loginJumpLoadingStopper, updateLayout } from '../../utils/clonosCommon'
import { handleChange, handleDeletePredefineTaskOfTaskLibrary, handleDeleteSubtasks, handleGetAllPredefineTasksFromTaskLibrary, handleGetAssetDropdown, handleGetPriorityDropdown, handleGetTeamsDropDown, handleGetUsersDropdownData, handleSubmitFormValues } from '../../utils/WorkOrderMethods/WorkOrderMethods'


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
import TaskLibraryDropdown from '../../Clonos_Modules/TaskLibrary/Components/TaskLibraryDropdown/TaskLibraryDropdown'

let primaryObject = {}
const WorkOrder = () => {
      // Global States 
      const store = useSelector(store => store)
      const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
      console.log('mainLayoutChildrenPositionsToolkitState:', mainLayoutChildrenPositionsToolkitState)

      // Local States 
      const navigate = useNavigate()
      const [isOpen, setIsOpen] = useToggler()
      const [formValues, setFormValues] = useState({})
      const [inputSubtastLength, setInputSubtastLength] = useState([[]]);
      const [formValidation, setFormValidation] = useState(primaryObject);

      const [priorityDropdownData, setPriorityDropdownData] = useState(store?.workOrderStateManagement?.workOrderPriorityDropdownToolkitState)
      const [usersDropdownData, setUsersDropdownData] = useState(store?.userData?.allUsersDropdownToolkitState)
      const [assetDropdownData, setAssetDropdownData] = useState(store?.assetData?.assetDropdownToolkitState)
      const [teamDropdownData, setTeamDropdownData] = useState(store?.userData?.teamsDropdownToolkitState)
      const [assetDepartmentDropdownData, setAssetDepartmentDropdownData] = useState([])
      const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")
      const [draftAlert, setDraftAlert] = useToggler()
      const [lcIntervals, setLcIntevals] = useState({})
      const dispatch = useDispatch()


      // New Local States 
      const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useToggler()
      const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useToggler()
      const [isAddTaskFromTaskLibraryModal, setIsAddTaskFromTaskLibraryModal] = useState(false)
      const [taskLibraryData, setTaskLibraryData] = useState([])
      console.log('taskLibraryData:', taskLibraryData)

      // Dropdown Pagination States 
      let [assetPaginationCurrentPage, setAssetPaginationCurrentPage] = useState(1)
      console.log('formValues:', formValues)

      const handleGetValues = ({ e, files, selectedOption, type, name, uniqueKey }) => {
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
            else if (type == "dynamicDropdown") {
                  setFormValues({ ...formValues, [name]: selectedOption })
                  setFormValidation({ ...formValidation, [name]: { ...formValidation[name], ["value"]: selectedOption } })
            }
            else if (type == "taskLibrary") {
                  setFormValues({ ...formValues, [uniqueKey]: selectedOption[0]?.preview })
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

            // Fetch all the predefine tasks from the task library.
            handleGetAllPredefineTasksFromTaskLibrary({ dispatch, locallyResponseSetterMethod: setTaskLibraryData })

            return () => {
                  // Clear the loading interval.
                  clearInterval(interval);
                  clearInterval(lcIntervals['subtasksInterval'])
                  clearInterval(lcIntervals['updateLayout'])
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
                                                      if (index > 0) return <div> <FaGreaterThan /> <span>{element}</span></div>
                                                      return <span>{element}</span>

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
                                                <LabelInputComp handleGetErrorMethods={handleGetErrorMethods} itemRef={"itemRef"} label="Work order Title" type="text" handleGetValues={handleGetValues} name={"title"} placeholder="Work Order Title" isMandatory={true} />
                                                <div className={Styles.work_order_require_work_permit}>
                                                      <input type="checkbox" style={{ backgroundColor: "pink" }} />
                                                      <span>Require Work Permit</span>
                                                </div>
                                                <LabelInputComp handleGetErrorMethods={handleGetErrorMethods} limit={500} itemRef={"itemRef"} label="Description" type="text" handleGetValues={handleGetValues} name={"description"} placeholder="Description" unique={true} />
                                                <LabelSelectComp handleGetErrorMethods={handleGetErrorMethods} label="Department" handleGetValues={handleGetValues} name={"department"} placeholder="Select" options={assetDepartmentDropdownData} source={searchIcon} isMandatory={true} />
                                                <LabelSelectComp handleGetErrorMethods={handleGetErrorMethods} label="Priority" handleGetValues={handleGetValues} name={"priority"} placeholder="Select" options={priorityDropdownData} source={selectDownIcon} isMandatory={true} />
                                                <DynamicDropdown handleGetErrorMethods={handleGetErrorMethods} title={"Asset"} labelActivator={"Asset Name"} isOpen={isAssetDropdownOpen} isOpenMethod={setIsAssetDropdownOpen} heading={"Select from Asset Library"} placeholder={"Search"} isSearchable={true} isCheckbox={false} isAsset={true} isDynamicLoad={true} data={assetDropdownData} isActivator={true} isMandatory={true} url={searchIcon} handleMoreData={handleMoreData} handleGetValues={handleGetValues} />
                                                <div className={Styles.work_order_fc_date_and_time}>
                                                      <LabelDateComp handleGetErrorMethods={handleGetErrorMethods} range={[0, 34]} type="date" label="Start Date" handleGetValues={handleGetValues} name={"startDate"} placeholder="12/30/9999" isMandatory={true} />
                                                      <LabelDateComp handleGetErrorMethods={handleGetErrorMethods} range={[0, 34]} type="date" label="End Date" handleGetValues={handleGetValues} name={"endDate"} placeholder="12/30/9999" formValues={formValues} isMandatory={true} />
                                                </div>
                                                <div className={Styles.work_order_fc_date_and_time}>
                                                      <LabelInputComp handleGetErrorMethods={handleGetErrorMethods} itemRef={"itemRef"} label="Estimation Days" type="number" handleGetValues={handleGetValues} name={"estimationDays"} placeholder="Estimation Days" isMandatory={true} />
                                                      <LabelInputComp handleGetErrorMethods={handleGetErrorMethods} range={[0, 23]} itemRef={"itemRef"} label="Hours" type="number" handleGetValues={handleGetValues} name={"hours"} placeholder="Hours" isMandatory={true} />
                                                </div>
                                                <DynamicDropdown handleGetErrorMethods={handleGetErrorMethods} title={"Assignee"} labelActivator={"User Name"} isOpen={isAssigneeDropdownOpen} isOpenMethod={setIsAssigneeDropdownOpen} heading={"Select from Users Library"} placeholder={"Search"} isSearchable={true} isCheckbox={false} isUser={true} isDynamicLoad={false} data={usersDropdownData} isActivator={true} isMandatory={true} url={searchIcon} handleMoreData={handleMoreData} handleGetValues={handleGetValues} />
                                                <DynamicDropdown handleGetErrorMethods={handleGetErrorMethods} title={"Team"} labelActivator={"Team Name"} heading={"Select from Team Library"} placeholder={"Search"} isSearchable={true} isCheckbox={true} isDynamicLoad={false} data={teamDropdownData} isActivator={true} isMandatory={true} url={searchIcon} handleMoreData={handleMoreData} handleGetValues={handleGetValues} />
                                          </div>

                                          <div style={{ height: `${handleGetHeightOrWidthBasedOnId({ idName: "work_order_first_child_container" }).height}px` }} className={Styles.work_order_second_child_container}>
                                                <div>
                                                      <FileUploader label="Documents" typeOfRecord={"Files"} title="Documents" isMandatory={false} limit={10} fileSizeInMB={10} acceptableFileTypes={[".jpg", ".jpeg", ".pdf", ".docs"]} handleGetSelectedData={handleGetValues} />
                                                      <div className={Styles.work_order_add_task}>
                                                            <header className={Styles.wo_ad_header}>
                                                                  <p>Add step-by-step procedures, safety precautions, required tools or equipment, and any additional documentation or references</p>
                                                            </header>
                                                            <section className={Styles.wo_ad_content}>
                                                                  <div className={Styles.wo_adc_controllers}>
                                                                        <span onClick={() => setIsAddTaskFromTaskLibraryModal(true)}>Add from Task Library</span>
                                                                        <div onClick={() =>
                                                                              setInputSubtastLength([...inputSubtastLength, []])
                                                                        }>
                                                                              <img src={WO_Add_Task_Icon} alt="Add Task" />
                                                                              <span>Add Task</span>
                                                                        </div>
                                                                  </div>
                                                                  <div className={Styles.wo_adc_body}>
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
                                                                                                <p>Task {i + 1} -</p>
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
                                                                        {
                                                                              formValues?.predefineTasks?.map((task, index) => {
                                                                                    return <div key={generateUniqueId(2)}
                                                                                          // className={Styles.work_order_tasks_input}
                                                                                          className={Styles.work_order_predefine_task}
                                                                                    >
                                                                                          <p>Task {inputSubtastLength.length + index + 1} -</p>
                                                                                          <span>{task?.name}</span>
                                                                                          <img src={WO_Task_Delete_Icon} alt='Delete WO' onClick={() => handleDeletePredefineTaskOfTaskLibrary({ lcValuesMethod: setFormValues, "id": task._id })} />
                                                                                    </div>
                                                                              })
                                                                        }
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
                                                            <button onClick={() => setDraftAlert(true)}>Save as Draft</button>
                                                            <button onClick={() => {
                                                                  handleSubmitFormValues({ formValues, inputSubtastLength, formValidation, dispatch, commonActions, isEditable: false, status: "Scheduled", navigate })
                                                            }}>Submit</button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div >
                              </section >
                        </div >
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
                        <Modal isOpen={isAddTaskFromTaskLibraryModal} closeModalMethod={setIsAddTaskFromTaskLibraryModal}>
                              <TaskLibraryDropdown data={taskLibraryData} closeModalMethod={setIsAddTaskFromTaskLibraryModal} uniqueKey={"predefineTasks"} handleGetValues={handleGetValues} type={"taskLibrary"} />
                        </Modal>
                        <ClonosConfirmationDialog
                              Open={draftAlert}
                              Title="Draft Work Order"
                              Content="Are you sure, You want to draft this work order ?"
                              CloseDialog={() => setDraftAlert(false)}
                              ProceedDialog={() => {
                                    handleSubmitFormValues({ formValues, inputSubtastLength, formValidation, dispatch, commonActions, isEditable: true, status: "Draft", navigate })
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

export default WorkOrder
