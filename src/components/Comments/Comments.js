import React from 'react'
import Styles from "../../ModuleStyles/Comments/Comments.module.css"
import { Link, useLocation } from 'react-router-dom'
import CommentBox from './CommentBox'
import Header from './Header'
import { useEffect } from 'react'
import { handleGetCommentsMethod } from '../../utils/CommentsMethods/CommentsMethods'
import { useDispatch, useSelector } from 'react-redux'

import { commentsStateManagementActions } from "../../Store/Reducers/ClonosCommentsReducer"
import CommentsLists from './CommentsLists'

const Comments = () => {
    const LOCATION = useLocation()
    const { commentsToolkitState } = useSelector((store) => store.commentsStateManagement);

    console.log('LOCATION:', LOCATION)
    return (
        <div className={Styles.comments_main_container} >
            <div className={Styles.comments_heading_container}>
                <h3>Document : {LOCATION.state?.assoDocData?.name}</h3>
                <div>
                    <Link to={-1} className="std_btn">
                        Back
                    </Link>
                </div>
            </div>
            <section className={Styles.comments_content_container}>
                <div className={Styles.comments_content_first_child_container}>
                    <Header totalComments = {commentsToolkitState.length} />
                    <CommentBox LOCATION={LOCATION} />
                    <CommentsLists LOCATION={LOCATION} />
                </div>
            </section>
        </div>
    )
}

export default React.memo(Comments)