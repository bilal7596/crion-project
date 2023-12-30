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
import { restrictSpecialCharacters } from "../../../utils/clonosCommon";
import REFERENCE_MANUAL_CREATION_REMOVEROW from "../../../assets/UIUX/icons/Checklist/circle-minus.svg";
import { Tooltip } from "@material-ui/core";
const EditAssetReferenceManuals = ({getData,data,getChangedValues,changedData}) => {
  const [instructionsDocuments, setInstructionsDocuments] = useState([]);
  const [instructionDocumentName,setInstructionsDocumentName] = useState("")
  const [showDocumentNameModal,setShowDocumentNameModal] = useState(false);
  const [error,setError] = useState(false)
  const [editedData,setEditedData] = useState([])

  const handleAddInstructionDocument = () => {
    if(!instructionDocumentName){
      setError(true)
    } else {
      let document = {
        id: uuidv4(),
        instructionDocumentName,
        instructions: [
          {
            _id: uuidv4(),
            instruction: "",
            instructionFile: null,
          },
        ],
      };
      setInstructionsDocuments((prev) => {
        let temp = [...prev, document]
        getData({...data,referenceManuals:temp})
        return temp
      });
      setShowDocumentNameModal(false)
    }
  };

  const handleChangeDocumentName = (e) => {
    const {name,value} = e.target;
    const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
    const newValue = restrictSpecialCharacters({value,specialCharacters})   
    if(newValue){
      setError(false)
    } else {
      setError(true)
    }        
    setInstructionsDocumentName(newValue)
  }

  const handleRemoveDocument = (id) => {
    setInstructionsDocuments((prev) => {
        let remainingDocuments = instructionsDocuments?.filter((doc) => doc?.id !== id)
        getData({...data,referenceManuals:remainingDocuments})
        return remainingDocuments
    })
  }

  const handleAddInstructions = ({docId,instructionId}) => {
    setInstructionsDocuments((prev) => {
        let temp = instructionsDocuments?.map((doc) => {
            if(doc?.id === docId){
                return {
                    ...doc,
                    instructions:[...doc?.instructions,{_id: uuidv4(),instruction: "",instructionFile: "",originalName:""}]
                }
            } else {
                return doc
            }
        })
        getData({...data,referenceManuals:temp})
        return temp
    })
  }

  const handleRemoveInstruction = (docId,instructionId) => {
    setInstructionsDocuments((prev) => {
      let temp = instructionsDocuments?.map((doc) => {
          if(doc?.id === docId){
              // if(doc?.isActive){
              //   getChangedValues({...changedData,referenceManuals:{...changedData?.referenceManuals,instructionsToDelete:changedData?.instructionsToDelete?.length ? [...changedData?.instructionsToDelete,instructionId] : [instructionId]}})
              // } 
              return {
                ...doc,
                instructions:doc?.instructions?.filter((instruction) => instruction?._id !== instructionId)
            }
          } else {
              return doc
          }
      })
      getData({...data,referenceManuals:temp})
      return temp
  })
  }

  const handleChangeInstructionValue = (e,instructionId,docId) => {
    const {value} = e.target;
    const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
    const newValue = restrictSpecialCharacters({value,specialCharacters})  
    console.log(newValue,"newValue")
    setInstructionsDocuments(() => {
      let temp = instructionsDocuments?.map((doc) => {
        if(doc?.id === docId){
          let tempInstructions = doc?.instructions?.map((inst) => {
            if(inst?._id === instructionId){
              if(changedData?.instructions?.length){
                let isPresent = false;
                let temp = changedData?.instructions?.map((instruction) => {
                    if(instruction?.id === instructionId){
                      isPresent = true;
                      return {...instruction,instruction:newValue}
                    } else {
                      return instruction
                    }
                })
                if(!isPresent){
                  temp = [...temp,{...inst,instruction:newValue}]
                }
                getChangedValues({...changedData,instructions:temp})
              } else {
                getChangedValues({...changedData,instructions:[{...inst,instruction:newValue}]})
              }
              return {
                ...inst,
                instruction:newValue
              }
            } else {
              return inst
            }
          })
          return {
            ...doc,
            instructions:tempInstructions
          }
        } else {
          return doc
        }
      })
      getData({...data,referenceManuals:temp})
      return temp
    })

  }

  const handleUploadFile = (e,docId,instructionId) => { 
    let file = e.target.files[0]
    setInstructionsDocuments(() => {
      let temp = instructionsDocuments?.map((doc) => {
        if(doc?.id === docId){
          let tempInstructions = doc?.instructions?.map((inst) => {
            console.log(inst,"instruction from upload")
            if(inst?._id === instructionId){
              if(changedData?.instructions?.length){
                let isPresent = false;
                let temp = changedData?.instructions?.map((instruction) => {
                    if(instruction?.id === instructionId){
                      isPresent = true;
                      return {...instruction,instructionFile:file,replace:instruction?.isActive ? true : false,create:!instruction?.isActive ? true : false}
                    } else {
                      return instruction
                    }
                })
                if(!isPresent){
                  temp = [...temp,{...inst,instructionFile:file,create:true}]
                }
                getChangedValues({...changedData,instructions:temp})
              } else {
                getChangedValues({...changedData,instructions:[{...inst,instructionFile:file,create:!inst?.isActive ? true : false,replace:inst?.isActive ? true : false}]})
              }
              // if(instruction?.isActive){
              //   let instructuionsToEdit = changedData?.instructionsToEdit?.length > 0 ? [...changedData?.instructionsToEdit,{id:instructionId}] : [{id:instructionId}];
              //   getChangedValues({...changedData,instructuionsToEdit})
              // } else {
              //   let newInstructions = changedData?.newInstructions ? [...changedData?.newInstructions,{...instruction,instructionFile:file}] : [{...instruction,instructionFile:file}];
              //   getChangedValues({...changedData,newInstructions})
              // }
              // changedData?.updatedInstructions?.length > 0 ? changedData?.updatedInstructions?.map((inst,index) => {
              //   if(inst?._id === instructionId){}
              // })  : 
              // if(changedData?.updatedInstructions?.length) {
              //   let temp = changedData?.updatedInstructions?.map((inst) => {
              //     if(inst?._id === instructionId){
              //       return {...inst,instructionFile:file,replace:instruction?.isActive ? true : false}
              //     } else {
              //       if(index === changedData?.updatedInstructions?.length -1){
              //         return {...instruction,instructionFile:file,replace:instruction?.isActive ? true : false}
              //       }
              //     }
              //   })
              // } else {
              //   getChangedValues({...changedData,updatedInstructions:[{...instruction,file:file,replace:true}]})
              // }
              return {
                ...inst,
                instructionFile:file,
                originalName:file?.name
              }
            } else {
              return inst
            }
          })
          return {
            ...doc,
            instructions:tempInstructions
          }
        } else {
          return doc
        }
      })
      getData({...data,referenceManuals:temp})
      return temp
    })
  }

  const handleRemoveUploadedFile = (docId,instructionId) => {
    setInstructionsDocuments(() => {
      let temp = instructionsDocuments?.map((doc) => {
        if(doc?.id === docId){
          let tempInstructions = doc?.instructions?.map((instruction) => {
            if(instruction?._id === instructionId){
              return {
                ...instruction,
                instructionFile:null,
                originalName:null
              }
            } else {
              return instruction
            }
          })
          return {
            ...doc,
            instructions:tempInstructions
          }
        } else {
          return doc
        }
      })
      getData({...data,referenceManuals:temp})
      return temp
    })
  }
  useEffect(() => {
    setInstructionsDocuments(data?.referenceManuals || [])
  },[data])
  console.log(changedData,"changedData")
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
        <div className={Styles.ast_rfml_documents}>
          <div onClick={() => setShowDocumentNameModal(true)}>
            <span>+</span>
            <span >
              Create New Instruction Document
            </span>
          </div>
        </div>
        <div className={Styles.ast_rfml_doclist_container}>
          {instructionsDocuments?.map((doc) => {
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
                        <p>{doc?.name}</p>
                      </div>
                      <div className={Styles.ast_rfml_doc_header_right}>
                        <div>
                          <div onClick={() => handleRemoveDocument(doc?.id)}>
                            <img src={REFERENCE_MANUAL_RED_TRASH} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className={Styles.ast_rfml_instruction_list}>
                      {doc?.instructions?.map((instruction, index) => {
                        return (
                          <div key={instruction?._id} className={Styles.ast_rfml_single_instruction}>
                            <div
                              className={Styles.ast_rfml_instruction_text_taker}
                            >
                              <input value={instruction?.instruction} onChange={(e) => handleChangeInstructionValue(e,instruction?._id,doc?.id)} placeholder="Add Text" />
                            </div>
                            <div className={Styles.ast_rfml_instruction_remover} onClick={() => handleRemoveInstruction(doc?.id,instruction?._id)}><img src={REFERENCE_MANUAL_CREATION_REMOVEROW}/></div>
                            {
                              instruction?.originalName ? <div className={Styles.ast_rfml_file_preview}>
                                <div>
                                  <img src={instruction?.originalName?.type?.includes("mp4") ? REFERENCE_MANUAL_MP4 : instruction?.originalName?.type?.includes("mp3") ? REFERENCE_MANUAL_MP3 : ""} />
                                </div>
                                <Tooltip title={instruction?.originalName}>
                                <p className={Styles.ast_rfml_filename_preview}>
                                {instruction?.originalName}
                                </p>
                                </Tooltip>
                                <div onClick={() => handleRemoveUploadedFile(doc?.id,instruction?._id)} className={Styles.ast_rfml_instructionfile_remover}>
                                  <img src={REFERENCE_MANUAL_RED_TRASH}/>
                                </div>
                              </div> : <div className={Styles.ast_rfml_instructionfile_taker_container}>
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
                                    <img src={REFERENCE_MANUAL_PAPER_CLIP} />
                                  </div>
                                  <p className={Styles.ast_rfml_filename_preview}>Attach File</p>
                                  <input
                                    type="file"
                                    accept="audio/*, video/*"
                                    name={`instruction-${index + 1}`}
                                    id={`instruction-${index + 1}`}
                                    onChange={(e) => handleUploadFile(e,doc?.id,instruction?._id)}
                                  />
                                </div>
                              </label>
                            </div>
                            }
                          </div>
                        );
                      })}
                    </div>
                    <div className={Styles.ast_rfml_instruction_controller}>
                      <div  className={Styles.ast_rfml_instruction_controller_btn}>
                        <span>+</span>
                        <span onClick={() => handleAddInstructions({docId:doc?.id})}>
                          Add Instruction
                        </span>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    <Modal isOpen={showDocumentNameModal} closeModalMethod={setShowDocumentNameModal} stopOverlayCloser={false}>
          <div className={Styles.ast_rfmlmodal_sub_container}>
              <h4>New Document</h4>
              <div>
                <div className={Styles.ast_rfmlmodal_input_controller}>
                  <label>Document Name <span className={Styles.required}>*</span></label>
                  <div>
                    <input onChange={handleChangeDocumentName} onBlur={() => setError(instructionDocumentName ? false : true)} name="instructionDocumentName" placeholder="Document Name"/>
                  </div>
                  {error && <span className={Styles.required}>Please provide document name!</span>}
                </div>
                <div className={Styles.ast_rfmlmodal_btn_controller}>
                  <ClonosButton onClick={handleAddInstructionDocument}>Create New Document</ClonosButton>
                </div>
              </div>
          </div>
    </Modal>
    </>
  );
};

export default memo(EditAssetReferenceManuals);

