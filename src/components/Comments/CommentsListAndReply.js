import React from 'react'
import Styles from "../../ModuleStyles/Comments/Comments.module.css"
import { BsThreeDots } from "react-icons/bs"
import { Menu, MenuItem } from '@material-ui/core'
import useToggler from '../../CustomHooks/TogglerHook'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { commentsStateManagementActions } from "../../Store/Reducers/ClonosCommentsReducer"
import { handleControlLengthOfComments, handleDeleteComments, handleEditComments, handleReplyOnCommentMethod, handleReplyOnCommentOnKeyPress } from '../../utils/CommentsMethods/CommentsMethods'
import { MdCancel } from "react-icons/md"
import { handleTimeTimeISOToLocalFormat } from '../../utils/CanvasMethods/CommonMethods'
import { useEffect } from 'react'
import { FaUserCircle } from "react-icons/fa"
import CommentReply from './CommentReply'
import { AiFillCheckCircle } from "react-icons/ai"
import { useRef } from 'react'

const CommentsListAndReply = ({ element, LOCATION }) => {
  console.log('element:', element)
  console.log('LOCATION:', LOCATION)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [toggle, setToggle] = useToggler()
  const [editToggle, setEditToggl] = useToggler()
  const [lengthOfTextInsideTheTextArea, setLengthOfTextInsideTheTextArea] = useState(0)
  const [inputBoxValue, setInputBoxValue] = useState("")
  const editInputRef  = useRef(null)
  const dispatch = useDispatch()
  let [time, setTime] = useState({})
  let length = 200
  let message = `Your can only add ${length} letters in one comment!`

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (state) => {
    if(state) setEditToggl(true)
    setAnchorEl(null);
  };




  useEffect(() => {
    let val = handleTimeTimeISOToLocalFormat(element.createdAt)
    setTime(val)
  }, [])
  return (
    <>
      <div className={Styles.comments_list_and_reply_container}>
        <section className={Styles.comments_list_and_reply_comment}>

          <header className={Styles.comments_list_and_reply_header}>
            <div><span>{element.commentedBy}</span></div>
            <BsThreeDots onClick={handleClick} />
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={()=>handleClose(false)}
            >
              <MenuItem onClick={()=>handleClose(true)}>Edit</MenuItem>
              <MenuItem onClick={()=>{
                handleClose(false)
                handleDeleteComments(element._id,LOCATION.state.assoDocData.formid, dispatch, commentsStateManagementActions)
                }}>Delete</MenuItem>
            </Menu>
          </header>

          <section className={Styles.comments_list_and_reply_content} >
            {
              !editToggle ? <p>{element.comment}</p>
                : <div  className={Styles.comments_list_and_reply_content_edit_container}>
                  <input ref={editInputRef} defaultValue={element.comment} autoFocus/>
                  <div>
                    <AiFillCheckCircle onClick={()=>handleEditComments(element._id,editInputRef?.current?.value,LOCATION.state.assoDocData.formid, dispatch, commentsStateManagementActions,setEditToggl,element.userId)}/>
                    <MdCancel onClick={()=>setEditToggl(false)}/>
                  </div>
                </div>
            }
            <div>
              {
                !toggle && <button onClick={setToggle}>Reply</button>
              }
            </div>
          </section>
          <section className={`${Styles.comments_list_and_reply_reply_box_container_common} ${!toggle ? Styles.comments_list_and_reply_reply_box_container_inactive : Styles.comments_list_and_reply_reply_box_container_active}`}>
            <div>
              <textarea
                className={Styles.comments_list_and_reply_reply_textarea}
                onChange={(e) => {
                  handleControlLengthOfComments(e, lengthOfTextInsideTheTextArea, setLengthOfTextInsideTheTextArea)
                  if (lengthOfTextInsideTheTextArea < length) {
                    setInputBoxValue(e.target.value)
                  }
                }}
                type='text' placeholder='Reply...'
                value={inputBoxValue}
                autoFocus
                onKeyDown={(e) => handleReplyOnCommentOnKeyPress(e, inputBoxValue, LOCATION.state.asset.assetId, LOCATION.state.assoDocData.formid, setInputBoxValue, setLengthOfTextInsideTheTextArea, dispatch, commentsStateManagementActions)}
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
                handleReplyOnCommentMethod(inputBoxValue, LOCATION.state.asset.assetId, LOCATION.state.assoDocData.formid, dispatch, commentsStateManagementActions, element?.cdid)
                setInputBoxValue("")
                setLengthOfTextInsideTheTextArea(0)
                setToggle()
              }}>Reply</button>
              <MdCancel onClick={setToggle} />
            </div>
          </section>
        </section>
        <section className={Styles.comments_list_and_reply_details}>
          <div>
            <span><FaUserCircle color="#5c5b5b" />{element.email}</span>
          </div>
          <div>
            <span>{time.date}</span>
            <span>{time.time}</span>
            <span>{time.zone}</span>
            <span>{time.ago}</span>
          </div>
        </section>
      </div>
      <CommentReply data={element.replies} />
    </>
  )
}

export default CommentsListAndReply