import React from 'react'
import Styles from "../../ModuleStyles/Comments/Comments.module.css"
import { useState } from 'react'
import { handleControlLengthOfComments, handleCreateCommentMethod, handleCreateCommentOnKeyPress } from '../../utils/CommentsMethods/CommentsMethods'
import colors from 'react-multi-date-picker/plugins/colors'
import { useDispatch } from 'react-redux'
import { commentsStateManagementActions } from "../../Store/Reducers/ClonosCommentsReducer"

const CommentBox = ({ LOCATION }) => {
    const [lengthOfTextInsideTheTextArea, setLengthOfTextInsideTheTextArea] = useState(0)
    const [inputBoxValue, setInputBoxValue] = useState("")
    const dispatch = useDispatch()
    let length = 200
    let message = `Your can only add ${length} letters in one comment!`

    return (
        <div className={Styles.comments_input_box_container}>
            <div>
                <textarea
                    onChange={(e) => {
                        handleControlLengthOfComments(e, lengthOfTextInsideTheTextArea, setLengthOfTextInsideTheTextArea)
                        if (lengthOfTextInsideTheTextArea < length) {
                            setInputBoxValue(e.target.value)
                        }
                    }}
                    type='text' placeholder='Write Your Comment...'
                    value={inputBoxValue}
                    autoFocus
                    onKeyDown={(e) => handleCreateCommentOnKeyPress(e, inputBoxValue, LOCATION.state.asset.assetId, LOCATION.state.assoDocData.formid, setInputBoxValue, setLengthOfTextInsideTheTextArea, dispatch, commentsStateManagementActions)}
                />

                {
                    lengthOfTextInsideTheTextArea > 0 && lengthOfTextInsideTheTextArea < length && <span style={{ color: "green" }} className={Styles.comments_letter_counter}>{lengthOfTextInsideTheTextArea}</span>
                }
                {
                    lengthOfTextInsideTheTextArea == length && <span style={{ color: "red" }}>{message}</span>
                }
            </div>
            <div>
                <button onClick={() => {
                    handleCreateCommentMethod(inputBoxValue, LOCATION.state.asset.assetId, LOCATION.state.assoDocData.formid, dispatch, commentsStateManagementActions)
                    setInputBoxValue("")
                    setLengthOfTextInsideTheTextArea(0)
                }}>Comments</button>
            </div>
        </div>
    )
}

export default React.memo(CommentBox)