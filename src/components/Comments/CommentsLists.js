import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CommentsListAndReply from './CommentsListAndReply';
import { useEffect } from 'react';
import { handleGetCommentsMethod } from '../../utils/CommentsMethods/CommentsMethods';
import { commentsStateManagementActions } from "../../Store/Reducers/ClonosCommentsReducer"
import Styles from "../../ModuleStyles/Comments/Comments.module.css"



const CommentsLists = ({ LOCATION }) => {
    const { commentsToolkitState } = useSelector((store) => store.commentsStateManagement);
    const dispatch = useDispatch()
    console.log('commentsToolkitState:', commentsToolkitState)

    useEffect(() => {
        handleGetCommentsMethod(LOCATION.state.assoDocData.formid, dispatch, commentsStateManagementActions)
    }, [])
    return (
        <div className={Styles.comments_comments_list}>
            {
                commentsToolkitState.map((ele) => {
                    return <CommentsListAndReply key={ele._id} element={ele} LOCATION={LOCATION} />
                })
            }
        </div>
    )
}

export default CommentsLists