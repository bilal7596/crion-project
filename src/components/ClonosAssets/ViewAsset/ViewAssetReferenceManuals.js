import { memo, useEffect } from "react"
import Styles from "../../../ModuleStyles/Assets/assetReferenceManual.module.css";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Tooltip } from "@mui/material";
import { useState } from "react";
import REFERENCE_MANUAL_FILE_TEXT from "../../../assets/UIUX/icons/file-text.svg";
import REFERENCE_MANUAL_MP3 from "../../../assets/UIUX/icons/music.svg";
import REFERENCE_MANUAL_MP4 from "../../../assets/UIUX/icons/movie.svg";

import REFERENCE_MANUAL_RED_TRASH from "../../../assets/UIUX/icons/redTrash.svg";
import { getReferenceManualForAsset } from "../../../Api/Asset/assetApi";
import { referenceManualsOptionalParams } from "../../../SharedEnums/ReferencemanualsEnums";
const ViewAssetReferenceManuals = ({data}) => {
    const [instructionsDocuments,setInstructionsDocuments] = useState([])
    // const [instructionsDocuments,setInstructionsDocuments] = useState([
    //     {
    //         id:1,
    //         instructionDocumentName:"instructionDocumentName",
    //         instructions : [ {instructionId:11,instructionTitle:"instructionTitle",instructionFile:{name:"videofile.mp4",type:"video"}},{instructionId:12,instructionTitle:"instructionTitle",instructionFile:{name:"videofile.mp4",type:"video"}}]
    //     }
    // ])

    useEffect(() => {
      getReferenceManualForAsset(data?._id,referenceManualsOptionalParams).then((res) => {
        setInstructionsDocuments(res?.data?.result)
      })
    },[data?._id])
    console.log(instructionsDocuments,"from refs")
    return <div style={{width:"80%",margin:"auto",padding:"80px"}}>
        {
            instructionsDocuments?.map((doc) => {
                return <div key={doc?.id} className={Styles.ast_rfml_singledoc}>
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
                      {/* <div className={Styles.ast_rfml_doc_header_right}>
                        <div>
                          <div onClick={() => handleRemoveDocument(doc?.id)}>
                            <img src={REFERENCE_MANUAL_RED_TRASH} />
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className={Styles.ast_rfml_instruction_list}>
                      {doc?.instructions?.map((instruction, index) => {
                        return (
                          <div key={instruction?.instructionId} className={Styles.ast_rfml_single_instruction}>
                            <div
                              className={Styles.ast_rfml_instruction_text_taker}
                            >
                              <input readOnly value={instruction?.instruction} style={{border:"none"}} />
                            </div>
                            {/* <div className={Styles.ast_rfml_instruction_remover} ><img src={REFERENCE_MANUAL_CREATION_REMOVEROW}/></div> */}
                            {
                              instruction?.originalName ? <div className={Styles.ast_rfml_file_preview}>
                                <div>
                                  <img src={instruction?.extension?.includes("mp4") ? REFERENCE_MANUAL_MP4 : instruction?.extension?.includes("mp3") ? REFERENCE_MANUAL_MP3 : ""} />
                                </div>
                                <Tooltip title={instruction?.originalName}>
                                <p className={Styles.ast_rfml_filename_preview}>
                                {instruction?.originalName}
                                </p>
                                </Tooltip>
                                {/* <div  className={Styles.ast_rfml_instructionfile_remover}>
                                  <img src={REFERENCE_MANUAL_RED_TRASH}/>
                                </div> */}
                              </div> : <div className={Styles.ast_rfml_instructionfile_taker_container}>
                              {/* <label
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
                                  />
                                </div>
                              </label> */}
                            </div>
                            }
                          </div>
                        );
                      })}
                    </div>
                    {/* <div className={Styles.ast_rfml_instruction_controller}>
                      <div  className={Styles.ast_rfml_instruction_controller_btn}>
                        <span>+</span>
                        <span onClick={() => handleAddInstructions({docId:doc?.id})}>
                          Add Instruction
                        </span>
                      </div>
                    </div> */}
                  </AccordionDetails>
                </Accordion>
              </div>
            })
        }
    </div>
}

export default memo(ViewAssetReferenceManuals)