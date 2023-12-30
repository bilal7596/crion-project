import { useEffect, useRef, useState } from "react";
import Styles from "../../ModuleStyles/Notifications/CreateNotification.module.css";
import SEARCHICON from "../../assets/UIUX/icons/search (1).svg";
import DOWNANGEL from "../../assets/UIUX/icons/chevron-down.svg";
import DropdownModal from "../CommonComponents/DropDownModal/DropdownModal";
import { useDispatch, useSelector } from "react-redux";
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer";
import {
  handleChange,
  handleGetAssetDropdown,
} from "../../utils/WorkOrderMethods/WorkOrderMethods";
import { userActions } from "../../Store/Reducers/ClonosUserReducer";
import { getAllUsersDropdownData } from "../../utils/UsersMethods/usersMethods";
import {
  getUser,
  handleSearchedData,
  updateLayout,
} from "../../utils/clonosCommon";
import {handleLoggedInUser, loginJumpLoadingStopper } from "../../utils/clonosCommon";
import { UnAuthorizedModal } from "../CommonComponents/UnAuthorizedPage/UnAuthorizedModal";
import useToggler from "../../CustomHooks/TogglerHook";
import { Container } from "@material-ui/core";
import { ClonosButton } from "../CommonComponents/Button/Button";
import { CloseOutlined } from "@material-ui/icons";
import {
  getAlarmsDropdownValues,
  getAlertTypesDropdownValues,
  getCommunicationChannelsDropdownValues,
  getMAMSDropdownValues,
  getUrgencyLevelDropdownValues,
  getUsersDropdownValues,
} from "../../utils/NotificationsMethods/NotificationsMethods";
import { CustomSelect } from "../CommonComponents/CustomSelect/CustomSelect";
import {handleCreateNotification} from "../../utils/NotificationsMethods/NotificationsMethods"
import { handleGetStaticDropdownValues } from "../../utils/DropdownsMethods/DropdownsMethods";
export const CreateNotification = () => {
  const user = getUser();
  const { mainLayoutChildrenPositionsToolkitState } = useSelector(
    (store) => store.globalEntitiesStateManagement
  );
  const [showAssetsList, setShowAssetsList] = useState(false);
  const [showRecipientsList, setShowRecipientsList] = useState(false);
  const [showAlarmList, setShowAlarmList] = useState(false);
  const [showCommunicationChannels, setShowCommunicationChannels] =
    useState(false);
  const store = useSelector((state) => state);
  const [showAlertType, setShowAlertType] = useState(false);
  const [showUrgencyLevel, setShowUrgencyLevel] = useState(false);
  const [showMAMSDropdown,setShowMAMSDropdown] = useState(false)
  const [assets, setAssets] = useState(
    store?.assetData?.assetDropdownToolkitState
  );
  const [users, setUsers] = useState(store?.userData?.allUsers);
  const [alarms, setAlarms] = useState(
    store?.notificationsData?.alarmsDropdown
  );
  const [communicationChannels, setCommunicationChannels] = useState(
    store?.notificationsData?.communicationChannels
  );
  const [mamsDropdownValues,setMamsDropdownValues] = useState(store?.notificationsData?.MAMSDropdownValues) 
  const [urgencyLevel, setUrgencyLevel] = useState(
    store?.notificationsData?.urgencyLevels
  );
  const [alertTypes, setAlertTypes] = useState(
    store?.notificationsData?.alertTypes
  );
  const dispatch = useDispatch();
  const alertTypeRef = useRef(null);
  const urgencyLevelRef = useRef(null);
  const mamsDropdownRef = useRef(null)
  const [formData, setFormData] = useState({});
  const sources = ["DCS", "Asset Reliability", "Process Optimization", "MAMS"];
  // const alarms = [{id:"1",name:"alarm1"},{id:"2",name:"alarm1"},{id:"3",name:"alarm1"},{id:"4",name:"alarm1"},{id:"5",name:"alarm1"},{id:"6",name:"alarm1"},]
  const [assetInputVal, setAssetInputVal] = useState("");
  const [alarmInputVal, setAlarmInputVal] = useState("");
  const [personInChargeInputVal, setPersonInChargeInputVal] = useState("");
  const [alternateInchargeIputVal, setAlternateInchargeInputVal] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")


  useEffect(() => {
    let interval = loginJumpLoadingStopper({ setterFunction: setIsLocalLoading, timeout: 5000 })
    return () => {
      clearInterval(interval)
    }
  }, [])
  const handleCloseDropdown = (event) => {
    if (alertTypeRef.current && !alertTypeRef.current.contains(event.target)) {
      setShowAlertType(false);
    }
    if (
      urgencyLevelRef.current &&
      !urgencyLevelRef.current.contains(event.target)
    ) {
      setShowUrgencyLevel(false);
    }
  };
  const handleSourceChange = (source) => {
    console.log(source,"ss")
    setFormData((prev) => {
      return {
        ...prev,
        sourcePreference: source,
      };
    });
  };
  const handleDeselectValue = (id,name) => {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: formData[name]?.filter((item) => item?.id !== id),
      };
    });
  };
  useEffect(() => {
    if (showAlertType) {
      document.addEventListener("mousedown", handleCloseDropdown);
    } else {
      document.removeEventListener("mousedown", handleCloseDropdown);
    }
    return () => {
      document.removeEventListener("mousedown", handleCloseDropdown);
    };
  }, [showAlertType]);
  useEffect(() => {
    if (urgencyLevelRef) {
      document.addEventListener("mousedown", handleCloseDropdown);
    } else {
      document.removeEventListener("mousedown", handleCloseDropdown);
    }
    return () => {
      document.removeEventListener("mousedown", handleCloseDropdown);
    };
  }, [showUrgencyLevel]);
  useEffect(() => {
    handleGetAssetDropdown(setAssets, dispatch, assetActions, {
      assetName: assetInputVal,
    });
  }, [assetInputVal]);
  useEffect(() => {
    getUsersDropdownValues(setUsers, dispatch);
  }, [personInChargeInputVal]);
  useEffect(() => {
    const seconds = hours * 3600 + minutes * 60;
    if(seconds){
      setFormData((prev) => {
        return {
          ...prev,
          recurrenceTime: seconds,
        };
      });
    }
  }, [minutes, hours]);
  useEffect(() => {
    updateLayout({ dispatch });
    // handleGetStaticDropdownValues({staticDropdownNameOrId:"CriticalityLevel",dispatch,setterFunctionForValues : setCriticalityDropdown})
    handleGetStaticDropdownValues({staticDropdownNameOrId:"Alarm",dispatch,setterFunctionForValues : setAlarms});
    handleGetStaticDropdownValues({staticDropdownNameOrId:"UrgencyLevel",dispatch,setterFunctionForValues : setUrgencyLevel});
    handleGetStaticDropdownValues({staticDropdownNameOrId:"AlertType",dispatch,setterFunctionForValues : setAlertTypes});
    handleGetStaticDropdownValues({staticDropdownNameOrId:"CommunicationChannel",dispatch,setterFunctionForValues : setCommunicationChannels});
    handleGetStaticDropdownValues({staticDropdownNameOrId:"UrgencyLevel",dispatch,setterFunctionForValues : setMamsDropdownValues});
  }, []);
  console.log(alarms, "...alarms");
//   if (
//     user?.role_id === "086" ||
//     user?.role_id === "001" ||
//     user?.role_id === "002"
//   )
  if (handleLoggedInUser()?.permissions?.includes('ntf001'))
    return (
      <div
        style={{
          height:
            mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart
              ?.height,
        }}
        className={Styles.createNotificationMainContainer}
      >
        <div className={Styles.createNotificationSubContainer}>
          <div className={Styles.createNotificationLeftContainer}>
            <div className={Styles.labelInputContainer}>
              <label>Asset</label>
              <div
                onClick={() => setShowAssetsList(true)}
                className={Styles.dropdownToggler}
              >
                <h4>
                  {formData?.asset?.id ? formData?.asset?.name : "Select Asset"}
                </h4>
                <div>
                  <img className={Styles.dropdownIcon} src={SEARCHICON} />
                </div>
              </div>
            </div>
            <div className={Styles.labelInputContainer}>
              <label>Source Preference</label>
              <div className={Styles.preferencesContainer}>
                {sources?.map((source) => {
                  return (
                    <div>
                      <input
                        name="source"
                        onChange={() => handleSourceChange(source)}
                        type="radio"
                      />
                      <label>{source}</label>
                    </div>
                  );
                })}
              </div>
            </div>
              {
                formData?.sourcePreference === "MAMS" ? <div onClick={() => setShowMAMSDropdown(!showMAMSDropdown)}>
                <CustomSelect
                  title={"Select"}
                  isOpen={showMAMSDropdown}
                  closeMethod={setShowMAMSDropdown}
                  icon={DOWNANGEL}
                  data={mamsDropdownValues?.map((type) => {
                    return {label:type?.name,value:type?.id}
                  })}
                  elementRef={mamsDropdownRef}
                  formData={formData}
                  setFormData={setFormData}
                  type={"sourcePreferenceType"}
                />
                </div> : <></>
              }
            <div className={Styles.labelInputContainer}>
              <label>Alarm</label>
              <div
                className={Styles.dropdownToggler}
                onClick={() => setShowAlarmList(true)}
              >
                <h4>Select Alarm</h4>
                <div>
                  <img className={Styles.dropdownIcon} src={SEARCHICON} />
                </div>
              </div>
              <div className={Styles.tagsWrapper}>
                {formData?.alarms?.map((alarm) => {
                  return (
                    <div className={Styles.tagItem}>
                      <p>{alarm?.name}</p>
                      <div onClick={() => handleDeselectValue(alarm?.id,"alarms")}>
                        <CloseOutlined fontSize="small" />{" "}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={Styles.labelInputContainer}>
              <label>Communication Channel</label>
              <div
                className={Styles.dropdownToggler}
                onClick={() => setShowCommunicationChannels(true)}
              >
                <h4>Select Communication Channel</h4>
                <div>
                  <img className={Styles.dropdownIcon} src={SEARCHICON} />
                </div>
              </div>
              <div className={Styles.tagsWrapper}>
                {formData?.communicationChannels?.map((channel) => {
                  return (
                    <div className={Styles.tagItem}>
                      <p>{channel?.name}</p>
                      <div onClick={() => handleDeselectValue(channel?.id,"communicationChannels")}>
                        <CloseOutlined fontSize="small" />{" "}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={Styles.labelInputContainer}
              onClick={() => setShowAlertType(!showAlertType)}
            >
              <label>Alert Type</label>
              <CustomSelect
                title={"Select Alert Type"}
                isOpen={showAlertType}
                closeMethod={() => setShowAlertType(false)}
                icon={DOWNANGEL}
                data={alertTypes?.map((type) => {
                  return {label:type?.name,value:type?.id}
                })}
                elementRef={alertTypeRef}
                formData={formData}
                setFormData={setFormData}
                type={"alertType"}
              />
            </div>
            <div className={Styles.labelInputContainer} onClick={() => setShowUrgencyLevel(!showUrgencyLevel)}>
              <label>Urgency Level</label>
              <CustomSelect
                title={"Select Urgency Level"}
                isOpen={showUrgencyLevel}
                closeMethod={() => setShowUrgencyLevel(false)}
                icon={DOWNANGEL}
                data={urgencyLevel?.map((type) => {
                  return {label:type?.name,value:type?.id}
                })}
                elementRef={urgencyLevelRef}
                formData={formData}
                setFormData={setFormData}
                type={"urgencyLevel"}
              />
            </div>
              <div className={Styles.recurrenceContainer}>
                <div className={Styles.flexBox}>
                  <input
                    checked={formData?.isRecurring}
                    onChange={(e) => {
                      e.stopPropagation()
                      setFormData((prev) => {
                        return {
                          ...prev,
                          isRecurring: formData?.isRecurring ? false : true,
                        };
                      });
                    }}
                    type="checkbox"
                  />
                  <label>Make the Notification Recurring</label>
                </div>
                {formData?.isRecurring ? (
                  <div className={Styles.flexBox}>
                    <select
                      className={Styles.customSelect}
                      onChange={(e) => setHours(e.target.value)}
                    >
                      <option value={0}>HH</option>
                      {new Array(24).fill(1).map((el, index) => {
                        if (index < 10) {
                          return <option value={index}>{`0${index}`}</option>;
                        } else {
                          return <option value={index}>{index}</option>;
                        }
                      })}
                    </select>
                    <select
                      className={Styles.customSelect}
                      onChange={(e) => setMinutes(e.target.value)}
                    >
                      <option value={0}>MM</option>
                      {new Array(60).fill(1).map((el, index) => {
                        if (index < 10) {
                          return <option value={index}>{`0${index}`}</option>;
                        } else {
                          return <option value={index}>{index}</option>;
                        }
                      })}
                    </select>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            <div className={Styles.labelInputContainer}>
              <label>Recipients</label>
              <div
                className={Styles.dropdownToggler}
                onClick={() => setShowRecipientsList(true)}
              >
                <h4>Select Users</h4>
                <div>
                  <img className={Styles.dropdownIcon} src={SEARCHICON} />
                </div>
              </div>
              <div className={Styles.tagsWrapper}>
                {formData?.recipients?.map((user) => {
                  return (
                    <div className={Styles.tagItem}>
                      <p>{user?.name}</p>
                      <div onClick={() => handleDeselectValue(user?.id,"recipients")}>
                        <CloseOutlined fontSize="small" />{" "}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <div className={Styles.labelInputContainer}>
              <label>Person In Charge</label>
              <div
                className={Styles.dropdownToggler}
                onClick={() => setShowPersonInchargeList(true)}
              >
                <h4>{formData?.personInCharge?.name ? formData?.personInCharge?.name : "In charge Name"}</h4>
                <div>
                  <img className={Styles.dropdownIcon} src={SEARCHICON} />
                </div>
              </div>
            </div> */}
            {/* <div className={Styles.contactDetailsBox}>
              <div>
                <label>Email</label>
                <input />
              </div>
              <div>
                <label>Contact Number</label>
                <input />
              </div>
            </div> */}
            {/* <div className={Styles.labelInputContainer}>
              <label>Alternate In Charge</label>
              <div
                className={Styles.dropdownToggler}
                onClick={() => setShowAlternateInchargeList(true)}
              >
                <h4>Asset Owner</h4>
                <div>
                  <img className={Styles.dropdownIcon} src={SEARCHICON} />
                </div>
              </div>
            </div>
            <div className={Styles.contactDetailsBox}>
              <div>
                <label>Email</label>
                <input />
              </div>
              <div>
                <label>Contact Number</label>
                <input />
              </div>
            </div> */}
          </div>
          <div className={Styles.controllerBtns}>
            <div>
              <ClonosButton style={{color:'#3f51b5',paddingRight:'20px',paddingLeft:"20px"}} isHollow={true} onClick={() => setFormData({})}>Cancel</ClonosButton>

              <ClonosButton style={{color:'#FFF',paddingRight:'20px',paddingLeft:"20px"}} isHollow={false} onClick={() => handleCreateNotification(formData,dispatch)}>Submit</ClonosButton>
              {/* <button className="cancelBtn">Cancel</button>
          <button className="submitBtn">Submit</button> */}
            </div>
          </div>
        </div>
        {/* FOR ASSETS LIST */}
        {showAssetsList ? (
          <DropdownModal
            isOpen={showAssetsList}
            closeModalMethod={() => setShowAssetsList(false)}
            width={"700px"}
            title={"Select from Asset library"}
            isSearchable={true}
            searchPlaceHolder={"Search Asset"}
            type="asset"
            data={
              assets?.length &&
              assets?.map((asset) => {
                return {
                  label: (
                    <div>
                      <p>{asset?.assetName}</p>
                      <p style={{ fontSize: "14px" }}>{asset?.assetNumber}</p>
                    </div>
                  ),
                  value: { id: asset?._id, name: asset?.assetName },
                };
              })
            }
            formData={formData}
            setFormData={setFormData}
            handelSearch={(e) =>
              handleSearchedData({
                e,
                setMethod: setAssetInputVal,
                type: "asset",
              })
            }
          />
        ) : (
          <></>
        )}
        {/* FOR ALARM LIST */}
        {showAlarmList ? (
          <DropdownModal
            isOpen={showAlarmList}
            closeModalMethod={() => setShowAlarmList(false)}
            width={"700px"}
            title={"Select from Alarm List"}
            isSearchable={true}
            searchPlaceHolder={"Search Alarm"}
            multiSelect={true}
            type={"alarms"}
            formData={formData}
            setFormData={setFormData}
            data={alarms?.map((alarm) => {
              return {
                label: alarm?.name,
                value: { id: alarm?.id, name: alarm?.name },
              };
            })}
          />
        ) : (
          <></>
        )}
        {/* FOR COMMUNICATION CHANNEL */}
        {showCommunicationChannels ? (
          <DropdownModal
            isOpen={showCommunicationChannels}
            closeModalMethod={() => setShowCommunicationChannels(false)}
            width={"400px"}
            title={"Communication Channel"}
            type={"communicationChannels"}
            multiSelect={true}
            formData={formData}
            setFormData={setFormData}
            data={communicationChannels?.map((channel) => {
              return {
                label: channel?.name,
                value: { id: channel?.id, name: channel?.name },
              };
            })}
          />
        ) : (
          <></>
        )}
        {/* FOR PERSON IN CHARGE LIST */}
        {showRecipientsList ? (
          <DropdownModal
            isOpen={showRecipientsList}
            closeModalMethod={() => setShowRecipientsList(false)}
            width={"700px"}
            title={"Select from Users List"}
            isSearchable={true}
            searchPlaceHolder={"Search User"}
            multiSelect={true}
            data={
              users?.length &&
              users?.map((user) => {
                return {
                  label: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{width:"20%",textOverflow:"ellipsis",overflow:"hidden"}}>
                        {user?.name} 
                      </div>
                      <div style={{width:"40%",textOverflow:"ellipsis",overflow:"hidden"}}>{user?.email}</div>
              <div style={{width:"20%"}}>{user?.phone}</div>
                    </div>
                  ),
                  value: {
                    id: user?.id,
                    name: user?.name,
                  },
                };
              })
            }
            type={"recipients"}
            formData={formData}
            setFormData={setFormData}
            handelSearch={(e) =>
              handleSearchedData({
                e,
                setMethod: setPersonInChargeInputVal,
                type: "recipients",
              })
            }
          />
        ) : (
          <></>
        )}
        {/* FOR ALTERNATE INCHARGE LIST */}
        {/* {showAlternateInchargeList ? (
          <DropdownModal
            isOpen={showAlternateInchargeList}
            closeModalMethod={() => setShowAlternateInchargeList(false)}
            width={"700px"}
            title={"Select from Users List"}
            type={"alternateIncharge"}
            isSearchable={true}
            searchPlaceHolder={"Search User"}
            data={
              users?.length &&
              users?.map((user) => {
                return {
                  label: (
                    <p>
                      {user?.first_name} {user?.last_name}
                    </p>
                  ),
                  value: { id: user?.userId, name: user?.first_name },
                };
              })
            }
            formData={formData}
            setFormData={setFormData}
          />
        ) : (
          <></>
        )} */}
      </div>
    );
 return !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
    <Container component="main" maxWidth="sm">
      <UnAuthorizedModal />
    </Container>
};
