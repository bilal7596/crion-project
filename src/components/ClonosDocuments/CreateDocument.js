import { Container, SelectPicker } from "rsuite";
import Styles from "../../ModuleStyles/Documents/documents.module.css";
import { memo, useEffect, useRef, useState } from "react";
import {
  getAssetDropdown,
  getFilteredAssetLevelDropdown,
  getFunctionalAreaDropdown,
} from "../../Api/Asset/assetApi";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import {
  getUser,
  handleLoggedInUser,
  handleLoginExpiry,
  loginJumpLoadingStopper,
  removeUserSession,
  updateLayout,
} from "../../utils/clonosCommon";
import { useDispatch, useSelector } from "react-redux";
import {
  getDocumentTypesDropdown,
  getDocumentsAssociatedWithAsset,
} from "../../Api/Documents/DocumentApi";
import { getApprovalStatusDropdown } from "../../Api/ApprovalSystem/approvalApi";
import {
  checkForDuplicateDocuments,
  createDocument,
} from "../../utils/DocumentMethods/documentMethods";
import { UnAuthorizedModal } from "../CommonComponents/UnAuthorizedPage/UnAuthorizedModal";
import { useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { AssetListModal } from "../ClonosAssets/AssetListModal";
import DropdownModal from "../CommonComponents/DropDownModal/DropdownModal";
import { Close } from "@material-ui/icons";
import { LinearProgress } from "@material-ui/core";
import useToggler from "../../CustomHooks/TogglerHook";
import { CssBaseline } from "@material-ui/core";
import { handleGetAssetDropdown } from "../../utils/WorkOrderMethods/WorkOrderMethods";
import DynamicDropdown from "../CommonComponents/DynamicDropdown/DynamicDropdown";
import SearchIcon from "../../assets/UIUX/icons/search (1).svg"
const CreateDocument = () => {
  const inputref = useRef(null);
  const dispatch = useDispatch();
  const user = getUser();
  const { mainLayoutChildrenPositionsToolkitState } = useSelector(
    (store) => store.globalEntitiesStateManagement
  );
  const fileTypes = [
    "doc",
    "docx",
    "pdf",
    "csv",
    "fbx",
    "png",
    "jpg",
    "cad",
    "dwg",
  ];
  const [functionalAreaDropdown, setFunctionalAreaDropdown] = useState([]);
  const [documentTypesDropdown, setDocumentTypeDropdown] = useState([]);
  const [statusDropdown, setStatusDropdown] = useState([]);
  const [formData, setFormData] = useState({});
  const Navigate = useNavigate();
  const [showWrongFileAlert, setShowWrongFileAlert] = useState(false);
  const [showRenameAlert, setShowRenameAlert] = useState(false);
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  // const [assets, setAssets] = useState([]);
  const [assetDropdownData,setAssetDropdownData] = useState([]);

  const [associatedDocuments, setAssociatedDocuments] = useState([]);
  const [newName, setNewName] = useState("");

  // Dropdown Pagination States 
  let [assetPaginationCurrentPage, setAssetPaginationCurrentPage] = useState(1)
  const [progress, setProgress] = useState({
    show: false,
    percent: 0,
  });
  const [showError, setShowError] = useState([]);
  const fields = [
    "documentTitle",
    "asset",
    "documentNumber",
    "documentType",
    "functionalArea",
    "revisionNumber",
    "status",
    "file0",
  ];
  const [showAssetsList, setShowAssetsList] = useState(false);
  let [assetDepartmentDropdownData, setAssetDepartmentDropdownData] = useState([])
  const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")
  useEffect(() => {
    let interval = loginJumpLoadingStopper({ setterFunction: setIsLocalLoading, timeout: 5000 })
    return () => {
      clearInterval(interval)
    }
  }, [])

  const handleMoreData = ({ isActivator }) => {
    if (isActivator) {
          setAssetPaginationCurrentPage((prev) => {
                let updatedPageCount = prev + 1
                handleGetAssetDropdown({ setAssetDropdownData, assetDropdownData, assetPaginationCurrentPage: updatedPageCount, dispatch })
                return updatedPageCount
          })
    }
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    const specialCharacters = `!"#$%&'*+,./:;<=>?@\\^_\`|~`;
    if (name === "document") {
      setShowWrongFileAlert(false);
      setShowRenameAlert(false);
      const file = e.target.files[0];
      const tempArr = file?.name.split(".");
      const fileType = tempArr[tempArr?.length - 1];
      const reader = new FileReader();
      
      console.log("reader outside",reader)
      if (formData?.asset?.id) {
        if (fileTypes.includes(fileType)) {
          setProgress((prev) => ({ ...prev, show: true }));
          reader.addEventListener("progress", (event) => {
            const percent = Math.round((event.loaded / event.total) * 100);
            console.log("percent", percent);
            setProgress((prev) => ({
              ...prev,
              percent: percent,
            }));
            if (percent === 100) {
              setTimeout(
                () =>
                  setProgress((prev) => ({
                    ...prev,
                    show: false,
                  })),
                1000
              );
            }
          });
          reader.addEventListener("load", (event) => console.log(event));
          reader.readAsBinaryString(file)
          setFormData((prev) => {
            return {
              ...prev,
              file0: file,
              noOfFiles: 1,
            };
          });
          if (!checkForDuplicateDocuments(associatedDocuments, file)) {
            setShowRenameAlert(true);
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message:
                  "File already exists. Please rename the file and try again.",
                type: "error",
              })
            );
          }
        } else {
          setShowWrongFileAlert(true);
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: "Uploaded file has not valid file type",
              type: "error",
            })
          );
        }
      }
    } else {
      if (name === "documentTitle") {
        let charArr = value.split("");
        const newValue = charArr
          .filter((char) => {
            return !specialCharacters.includes(char);
          })
          .join("");
        setFormData((prev) => {
          return {
            ...prev,
            [name]: newValue,
          };
        });
        if (newValue) {
          showError.filter((field) => field !== name);
        }
      } else {
        setFormData((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });
      }
    }
  };
  

  const handleRenameFile = () => {
    if (newName) {
      let fileName = newName + "." + formData?.file0?.name.split(".")[1];
      const updatedFile = new File([formData?.file0], fileName, {
        type: formData?.file0?.type,
      });
      setFormData((prev) => {
        return {
          ...prev,
          file0: updatedFile,
        };
      });
    } else {
      dispatch(
        commonActions.handleSnackbar({
          show: true,
          message: "Please provide valid name",
          type: "error",
        })
      );
    }
  };
  const handleDropdownChange = (value, name) => {
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value ? JSON.parse(value) : null,
      };
    });
  };
  const handleUploadDocument = () => {
    if (
      formData?.documentTitle &&
      formData?.asset &&
      formData?.documentNumber &&
      formData?.documentTitle &&
      formData?.functionalArea &&
      formData?.revisionNumber &&
      formData?.status &&
      formData?.file0
    ) {
      formData["uploadedBy"] = user?.userId;
      console.log(formData, "saved");
      createDocument(formData, dispatch, setFormData, Navigate);
    } else {
      let temp = [];
      fields?.map((field) => {
        if (!formData[field]) {
          temp.push(field);
        }
      });
      setShowError(temp);
    }
  };

  const handleGetValues = (val) => {
    setFormData((prev) => ({
      ...prev,
      asset:{id:val?.selectedOption[0]?.id,name:val?.selectedOption[0]?.name}
    }))
  }

  useEffect(() => {
    updateLayout({ dispatch });
    getFunctionalAreaDropdown()
      .then((res) => {
        setFunctionalAreaDropdown(res.data.result);
      })
      .catch((err) => {
        handleLoginExpiry(err, dispatch);
      });
    getDocumentTypesDropdown()
      .then((res) => {
        setDocumentTypeDropdown(res?.data?.result);
      })
      .catch((err) => {
        handleLoginExpiry(err, dispatch);
      });
    getApprovalStatusDropdown()
      .then((res) => {
        setStatusDropdown(res?.data?.result);
      })
      .catch((err) => {
        handleLoginExpiry(err, dispatch);
      });
      handleGetAssetDropdown({ setAssetDropdownData, assetDropdownData, assetPaginationCurrentPage, dispatch })
  }, []);

  useEffect(() => {
    if (formData?.asset && !associatedDocuments.length) {
      getDocumentsAssociatedWithAsset(formData?.asset?.id).then((res) => {
        setAssociatedDocuments(res?.data?.result);
      });
    }
    if(formData?.asset && associatedDocuments.length){
      if (!checkForDuplicateDocuments(associatedDocuments, formData?.file0)) {
        setShowRenameAlert(true);
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message:
              "File already exists. Please rename the file and try again.",
            type: "error",
          })
        );
      }
    }
  }, [formData]);
  console.log(formData, "checked");
  if (handleLoggedInUser()?.permissions?.includes('doc001')) {
    return (
      <div style={{
        height:
          mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart
            ?.height,
      }} className={Styles.documentMainContainer}>
        <nav className={Styles.header}>
          <span>Create Document</span>
        </nav>
        <div className={Styles.documentSubContainer}>
          <div style={{height:"100%",background:"#FFF",borderRadius:"6px"}}>
          <div className={Styles.documentsContainer}>
            <div className={Styles.documentsLeftContainer}>
              <div>
                <label>Document Title</label>
                <input
                  // onBlur={() => validateForm(formData, setErrors)}
                  placeholder="Document Title"
                  name="documentTitle"
                  onChange={handleChange}
                  value={formData?.documentTitle || ""}
                  onBlur={() =>
                    !formData?.documentTitle &&
                    setShowError((prev) => [...prev, "documentTitle"])
                  }
                />
                {showError.includes("documentTitle") &&
                !formData?.documentTitle ? (
                  <p className={Styles.errorText}>
                    Document title is required. Please fill.
                  </p>
                ) : (
                  <></>
                )}
              </div>
              {/* {errors.assetName && (
                <span className={Styles.error}>{errors.assetName}</span>
              )} */}
              <div>
                <label>Document Number</label>
                <input
                  // onBlur={() => validateForm(formData, setErrors)}
                  placeholder="Document Number"
                  name="documentNumber"
                  onChange={handleChange}
                  // type="number"
                  value={formData?.documentNumber || ""}
                  onBlur={() =>
                    !formData?.documentNumber &&
                    setShowError((prev) => [...prev, "documentNumber"])
                  }
                />
                {showError.includes("documentNumber") &&
                !formData?.documentNumber ? (
                  <p className={Styles.errorText}>
                    Document number is required. Please fill.
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <label>Revision Number</label>
                <input
                  // onBlur={() => validateForm(formData, setErrors)}
                  // type="number"
                  placeholder="Revision Number"
                  name="revisionNumber"
                  onChange={handleChange}
                  value={formData?.revisionNumber || ""}
                  onBlur={() =>
                    !formData?.revisionNumber &&
                    setShowError((prev) => [...prev, "revisionNumber"])
                  }
                />
                {showError.includes("revisionNumber") &&
                !formData?.revisionNumber ? (
                  <p className={Styles.errorText}>
                    Revision number is required. Please fill.
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <label>Document Type</label>
                <div className="assetCreationSelectPicker">
                  <SelectPicker
                    data={documentTypesDropdown?.map((type) => {
                      return {
                        label: type?.name,
                        value: JSON.stringify({
                          name: type?.name,
                          id: type?.id,
                        }),
                      };
                    })}
                    onClean={(val) => {
                      setFormData((prev) => {
                        return {
                          ...prev,
                          documentType: null,
                        };
                      });
                    }}
                    value={JSON.stringify(formData?.documentType) || ""}
                    onSelect={(val) =>
                      handleDropdownChange(val, "documentType")
                    }
                    block
                    placeholder="Select Type"
                  />
                </div>
                {showError.includes("documentType") &&
                !formData?.documentType ? (
                  <p className={Styles.errorText}>
                    Document type is required. Please fill.
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <label>Asset</label>
                <div
                  className={Styles.assetsDropdownToggler}
                  onClick={() => setShowAssetsModal(true)}
                  // onBlur={() => !formData?.asset?.id && setShowError((prev) => ([...prev,"asset"]))}
                >
                  <p>
                    {formData?.asset?.name
                      ? formData?.asset?.name
                      : "Select Asset"}
                  </p>
                  <div>
                    {formData?.asset?.id ? (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          delete formData.asset;
                          delete formData.file0;
                          setFormData({ ...formData });
                          setShowRenameAlert(false)
                          setShowError((prev) => [...prev, "asset"]);
                        }}
                      >
                        <Close fontSize="small" />
                      </div>
                    ) : (
                      <BsSearch />
                    )}
                  </div>
                </div>
                {showError.includes("asset") && !formData?.asset?.id ? (
                  <p className={Styles.errorText}>
                    Asset is required. Please select.
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <label>Status</label>
                <div className="assetCreationSelectPicker">
                  <SelectPicker
                    onClean={(prev) => {
                      setFormData((prev) => {
                        return {
                          ...prev,
                          status: null,
                        };
                      });
                    }}
                    onSelect={(val) => handleDropdownChange(val, "status")}
                    data={statusDropdown?.map((status) => {
                      return {
                        label: status?.name,
                        value: JSON.stringify({
                          name: status?.name,
                          id: status?.id,
                        }),
                      };
                    })}
                    block
                    placeholder="Select Status"
                    value={JSON.stringify(formData?.status) || ""}
                  />
                </div>
                {showError.includes("status") && !formData?.status ? (
                  <p className={Styles.errorText}>
                    Status is required. Please fill.
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <label>Functional Area</label>
                <div className="assetCreationSelectPicker">
                  <SelectPicker
                    onClean={(prev) => {
                      setFormData((prev) => {
                        return {
                          ...prev,
                          functionalArea: null,
                        };
                      });
                    }}
                    onSelect={(val) =>
                      handleDropdownChange(val, "functionalArea")
                    }
                    block
                    placeholder="Select Area"
                    placement="topStart"
                    data={functionalAreaDropdown.map((item) => {
                      return {
                        label: item?.name,
                        value: JSON.stringify({
                          name: item?.name,
                          id: item?.id,
                        }),
                      };
                    })}
                    value={JSON.stringify(formData?.functionalArea) || ""}
                  />
                </div>
                {showError.includes("functionalArea") &&
                !formData?.functionalArea ? (
                  <p className={Styles.errorText}>
                    Functional Area is required. Please fill.
                  </p>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className={Styles.documentsRightContainer}>
              <div className={Styles.uploadContainer}>
                <h4>Upload Document</h4>
                <p>
                  Accepts document files in DOC, DOCX, PDF,CSV,PNG,JPG,CAD, DWG
                  and FBX formats.
                </p>
                <div className={Styles?.inputTaker}>
                  <input
                    onChange={handleChange}
                    name="document"
                    ref={inputref}
                    type="file"
                    style={{ visibility: "hidden" }}
                    accept=".pdf, .cad, .doc, .docx, image/png, image/jpg, .csv, .dwg, .fbx"
                  />
                </div>
                <div>
                  <button
                    onClick={() => {
                      if (formData?.asset?.id) {
                        inputref.current.click();
                      } else {
                        !showError.includes("asset") &&
                          setShowError((prev) => [...prev, "asset"]);
                      }
                    }}
                  >
                    Upload
                  </button>
                </div>
              </div>
              {progress?.show && (
                <div className={Styles.progressBar}>
                  <LinearProgress
                    variant="determinate"
                    value={progress.percent}
                  />
                  <span>Uploading ...</span>
                </div>
              )}
              {showWrongFileAlert ? (
                <h4
                  style={{ width: "70%", margin: "auto" }}
                  className={"wrongFileError"}
                >
                  Selected file is not valid. Please upload valid file.
                </h4>
              ) : (
                <></>
              )}
              {formData?.file0 && !showWrongFileAlert ? (
                <div className={Styles.docTitleView}>
                  <h4>{formData?.file0?.name}</h4>
                </div>
              ) : (
                <></>
              )}
              {showError.includes("file0") && !formData?.file0 ? (
                <p
                  style={{ width: "70%", margin: "auto" }}
                  className={Styles.errorText}
                >
                  Please upload file.
                </p>
              ) : (
                <></>
              )}
              {showRenameAlert ? (
                <div className={Styles.renameDocContainer}>
                  <input
                    onChange={(e) => {
                      const specialCharacters = `!"#$%&'*+,/:;<=>?@\\^\`|~`;
                      let charArr = e.target.value.split("");
                      const newValue = charArr
                        .filter((char) => {
                          return !specialCharacters.includes(char);
                        })
                        .join("");
                      setNewName(newValue);
                    }}
                    defaultValue={formData?.file0?.name}
                  />
                  <button
                    onClick={() => handleRenameFile(formData?.document)}
                    className={Styles.reNameBtn}
                  >
                    Rename{" "}
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className={Styles.submitContainer}>
            <div className={Styles.buttonsContainer}>
              <button
                onClick={() => {
                  setFormData({});
                  Navigate(-1);
                  setShowError([]);
                }}
                className={Styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDocument}
                className={Styles.submitBtn}
              >
                Submit
              </button>
            </div>
          </div>

          {
            showAssetsModal ? <DynamicDropdown
            title={"Asset"}
            labelActivator={"Asset Name"}
            isOpen={showAssetsModal}
            isOpenMethod={setShowAssetsModal}
            heading={"Select from Asset Library"}
            placeholder={"Search"}
            isSearchable={true}
            isCheckbox={false}
            isUser={true}
            isDynamicLoad={true}
            data={assetDropdownData}
            isActivator={false}
            isMandatory={false}
            url={SearchIcon}
            handleMoreData={handleMoreData}
            handleGetValues={handleGetValues}
            handleGetErrorMethods={() => {}} 
          /> : <></>
          }
        </div>
      </div>
      </div>
    );
}
  return (
    <>
      {
        !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
          <Container component="main" maxWidth="sm">
            <UnAuthorizedModal />
          </Container>
      }
    </>
  )
};

export default memo(CreateDocument);
