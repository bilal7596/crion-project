import { memo } from "react";
import Styles from "../../../ModuleStyles/Assets/assetReferenceManual.module.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";
import REFERENCE_MANUAL_FILE_TEXT from "../../../assets/UIUX/icons/file-text.svg";
import REFERENCE_MANUAL_MP3 from "../../../assets/UIUX/icons/music.svg";
import REFERENCE_MANUAL_MP4 from "../../../assets/UIUX/icons/movie.svg";

import REFERENCE_MANUAL_RED_TRASH from "../../../assets/UIUX/icons/redTrash.svg";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import REFERENCE_MANUAL_PAPER_CLIP from "../../../assets/UIUX/icons/paperclip.svg";
import Modal from "../../CommonComponents/Modal/Modal";
import { ClonosButton } from "../../CommonComponents/Button/Button";
import {
  handleShowErrorAndWarning,
  restrictSpecialCharacters,
} from "../../../utils/clonosCommon";
import REFERENCE_MANUAL_CREATION_REMOVEROW from "../../../assets/UIUX/icons/Checklist/circle-minus.svg";
import { Tooltip } from "@material-ui/core";
import { useDispatch } from "react-redux";
const CreateAssetReferenceManuals = ({ getData, data }) => {
  const [instructionsDocuments, setInstructionsDocuments] = useState([]);
  const [instructionDocumentName, setInstructionsDocumentName] = useState("");
  const [showDocumentNameModal, setShowDocumentNameModal] = useState(false);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const handleAddInstructionDocument = () => {
    if (!instructionDocumentName) {
      setError(true);
    } else {
      let document = {
        id: uuidv4(),
        instructionDocumentName,
        instructions: [
          {
            instructionId: uuidv4(),
            instructionTitle: "Instruction",
            instructionFile: null,
          },
        ],
      };
      setInstructionsDocuments((prev) => {
        let temp = [...prev, document];
        getData({ ...data, instructionsDocuments: temp });
        return temp;
      });
      setShowDocumentNameModal(false);
    }
  };

  const handleChangeDocumentName = (e) => {
    const { name, value } = e.target;
    const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
    const newValue = restrictSpecialCharacters({ value, specialCharacters });
    if (newValue) {
      setError(false);
    } else {
      setError(true);
    }
    setInstructionsDocumentName(newValue);
  };

  const handleRemoveDocument = (id) => {
    setInstructionsDocuments((prev) => {
      let remainingDocuments = instructionsDocuments?.filter(
        (doc) => doc?.id !== id
      );
      getData({ ...data, instructionsDocuments: remainingDocuments });
      return remainingDocuments;
    });
  };

  const handleAddInstructions = ({ docId, index }) => {
    setInstructionsDocuments((prev) => {
      let temp = instructionsDocuments?.map((doc) => {
        if (doc?.id === docId) {
          return {
            ...doc,
            instructions: [
              ...doc?.instructions,
              {
                instructionId: uuidv4(),
                instructionTitle: "Instruction",
                instructionFile: "",
              },
            ],
          };
        } else {
          return doc;
        }
      });
      getData({ ...data, instructionsDocuments: temp });
      return temp;
    });
  };

  const handleRemoveInstruction = (docId, instructionId) => {
    setInstructionsDocuments((prev) => {
      let temp = instructionsDocuments?.map((doc) => {
        if (doc?.id === docId) {
          return {
            ...doc,
            instructions: doc?.instructions?.filter(
              (instruction) => instruction?.instructionId !== instructionId
            ),
          };
        } else {
          return doc;
        }
      });
      getData({ ...data, instructionsDocuments: temp });
      return temp;
    });
  };

  const handleChangeInstructionValue = (e, instructionId, docId) => {
    const { value } = e.target;
    const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
    const newValue = restrictSpecialCharacters({ value, specialCharacters });
    console.log(newValue, "newValue");
    setInstructionsDocuments(() => {
      let temp = instructionsDocuments?.map((doc) => {
        if (doc?.id === docId) {
          let tempInstructions = doc?.instructions?.map((instruction) => {
            if (instruction?.instructionId === instructionId) {
              return {
                ...instruction,
                instructionTitle: newValue,
              };
            } else {
              return instruction;
            }
          });
          return {
            ...doc,
            instructions: tempInstructions,
          };
        } else {
          return doc;
        }
      });
      getData({ ...data, instructionsDocuments: temp });
      return temp;
    });
  };

  const handleUploadFile = (e, docId, instructionId) => {
    let file = e.target.files[0];
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes/(1024 * 1024);
    if(fileSizeInMB <= 20){
      if (file.type.includes("video") || file.type.includes("audio")) {
        setInstructionsDocuments(() => {
          let temp = instructionsDocuments?.map((doc) => {
            if (doc?.id === docId) {
              let tempInstructions = doc?.instructions?.map((instruction) => {
                if (instruction?.instructionId === instructionId) {
                  return {
                    ...instruction,
                    instructionFile: file,
                  };
                } else {
                  return instruction;
                }
              });
              return {
                ...doc,
                instructions: tempInstructions,
              };
            } else {
              return doc;
            }
          });
          getData({ ...data, instructionsDocuments: temp });
          return temp;
        });
      } else {
        handleShowErrorAndWarning({
          dispatch,
          type: "error",
          message: "Please upload only video or audio file.",
          showTime: "5000",
        });
      }
    } else  {
      handleShowErrorAndWarning({dispatch,type:"error",message:"File size limit exceeded. Max size: 20MB.",showTime:"5000"})
    }
  };

  const handleRemoveUploadedFile = (docId, instructionId) => {
    setInstructionsDocuments(() => {
      let temp = instructionsDocuments?.map((doc) => {
        if (doc?.id === docId) {
          let tempInstructions = doc?.instructions?.map((instruction) => {
            if (instruction?.instructionId === instructionId) {
              return {
                ...instruction,
                instructionFile: null,
              };
            } else {
              return instruction;
            }
          });
          return {
            ...doc,
            instructions: tempInstructions,
          };
        } else {
          return doc;
        }
      });
      getData({ ...data, instructionsDocuments: temp });
      return temp;
    });
  };
  useEffect(() => {
    setInstructionsDocuments(data?.instructionsDocuments || []);
  }, []);
  console.log(instructionsDocuments);
  return (
    <>
      <div
        aria-label="container to add reference manual"
        className={Styles.ast_rfml_contanier}
      >
        <div className={Styles.ast_rfml_header}>
          <h4 className={Styles.ast_rfml_header_title}>Instructions</h4>
        </div>
        <div className={Styles.ast_rfml_inner_container}>
          {!instructionsDocuments?.length && (
            <div className={Styles.ast_rfml_documents}>
              <div
                onClick={() =>
                  instructionsDocuments?.length === 0 &&
                  setShowDocumentNameModal(true)
                }
              >
                <span>+</span>
                <span>Create New Instruction Document</span>
              </div>
            </div>
          )}
          <div className={Styles.ast_rfml_doclist_container}>
            {instructionsDocuments?.length ? (
              instructionsDocuments?.map((doc) => {
                return (
                  <div key={doc?.id} className={Styles.ast_rfml_singledoc}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <div className={Styles.ast_rfml_doc_header}>
                          <div className={Styles.ast_rfml_doc_header_left}>
                            <div>
                              <img src={REFERENCE_MANUAL_FILE_TEXT} />
                            </div>
                            <p>{doc?.instructionDocumentName}</p>
                          </div>
                          <div className={Styles.ast_rfml_doc_header_right}>
                            <div>
                              <div
                                onClick={() => handleRemoveDocument(doc?.id)}
                              >
                                <img src={REFERENCE_MANUAL_RED_TRASH} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails style={{ padding: "8px 45px 16px" }}>
                        <div className={Styles.ast_rfml_instruction_list}>
                          {doc?.instructions?.map((instruction, index) => {
                            return (
                              <div
                                key={instruction?.instructionId}
                                className={Styles.ast_rfml_single_instruction}
                              >
                                <div
                                  className={
                                    Styles.ast_rfml_instruction_text_taker
                                  }
                                >
                                  <input
                                    value={instruction?.instructionTitle}
                                    onChange={(e) =>
                                      handleChangeInstructionValue(
                                        e,
                                        instruction?.instructionId,
                                        doc?.id
                                      )
                                    }
                                    placeholder="Add Text"
                                  />
                                </div>
                                <div
                                  className={
                                    Styles.ast_rfml_instruction_remover
                                  }
                                  onClick={() =>
                                    handleRemoveInstruction(
                                      doc?.id,
                                      instruction?.instructionId
                                    )
                                  }
                                >
                                  <img
                                    src={REFERENCE_MANUAL_CREATION_REMOVEROW}
                                  />
                                </div>
                                {instruction?.instructionFile ? (
                                  <div className={Styles.ast_rfml_file_preview}>
                                    <div>
                                      <img
                                        src={
                                          instruction?.instructionFile?.type?.includes(
                                            "video"
                                          )
                                            ? REFERENCE_MANUAL_MP4
                                            : instruction?.instructionFile?.type?.includes(
                                                "audio"
                                              )
                                            ? REFERENCE_MANUAL_MP3
                                            : ""
                                        }
                                      />
                                    </div>
                                    <Tooltip
                                      title={instruction?.instructionFile?.name}
                                    >
                                      <p
                                        className={
                                          Styles.ast_rfml_filename_preview
                                        }
                                      >
                                        {instruction?.instructionFile?.name}
                                      </p>
                                    </Tooltip>
                                    <div
                                      onClick={() =>
                                        handleRemoveUploadedFile(
                                          doc?.id,
                                          instruction?.instructionId
                                        )
                                      }
                                      className={
                                        Styles.ast_rfml_instructionfile_remover
                                      }
                                    >
                                      <img src={REFERENCE_MANUAL_RED_TRASH} />
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={
                                      Styles.ast_rfml_instructionfile_taker_container
                                    }
                                  >
                                    <label
                                      htmlFor={`instruction-${index + 1}`}
                                      name={`instruction-${index + 1}`}
                                    >
                                      <div
                                        className={
                                          Styles.ast_rfml_instructionfile_taker
                                        }
                                      >
                                        <div>
                                          <img
                                            src={REFERENCE_MANUAL_PAPER_CLIP}
                                          />
                                        </div>
                                        <p
                                          className={
                                            Styles.ast_rfml_filename_preview
                                          }
                                        >
                                          Attach File
                                        </p>
                                        <input
                                          type="file"
                                          accept="audio/*, video/*"
                                          name={`instruction-${index + 1}`}
                                          id={`instruction-${index + 1}`}
                                          onChange={(e) =>
                                            handleUploadFile(
                                              e,
                                              doc?.id,
                                              instruction?.instructionId
                                            )
                                          }
                                        />
                                      </div>
                                    </label>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className={Styles.ast_rfml_instruction_controller}>
                          <div
                            className={
                              Styles.ast_rfml_instruction_controller_btn
                            }
                          >
                            <span>+</span>
                            <span
                              onClick={() =>
                                handleAddInstructions({ docId: doc?.id })
                              }
                            >
                              Add Instruction
                            </span>
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                );
              })
            ) : (
              <h4 style={{ color: "#3f51b5", textAlign: "center" }}>
                Add New Instrunction Document to create.
              </h4>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={showDocumentNameModal}
        closeModalMethod={setShowDocumentNameModal}
        stopOverlayCloser={false}
      >
        <div className={Styles.ast_rfmlmodal_sub_container}>
          <h4>New Document</h4>
          <div>
            <div className={Styles.ast_rfmlmodal_input_controller}>
              <label>
                Document Name <span className={Styles.required}>*</span>
              </label>
              <div>
                <input
                  onChange={handleChangeDocumentName}
                  onBlur={() =>
                    setError(instructionDocumentName ? false : true)
                  }
                  name="instructionDocumentName"
                  placeholder="Document Name"
                />
              </div>
              {error && (
                <span className={Styles.required}>
                  Please provide document name!
                </span>
              )}
            </div>
            <div className={Styles.ast_rfmlmodal_btn_controller}>
              <ClonosButton onClick={handleAddInstructionDocument}>
                Create New Document
              </ClonosButton>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default memo(CreateAssetReferenceManuals);
