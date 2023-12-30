import React from 'react'
import Styles from "../../ModuleStyles/Comments/Comments.module.css"
import useToggler from '../../CustomHooks/TogglerHook';


const Header = ({totalComments}) => {
    const [myBooleanState, toggleMyBooleanState] = useToggler(false);
    return (
        <>
            <header className={Styles.comments_header}>
                <div className={Styles.comments_content_heading}>
                    <span>Comments</span>
                    <span className={Styles.comments_content_total_comments_span}>{totalComments}</span>
                </div>
                <div className={Styles.comments_latest_and_popular}>
                    <span onClick={toggleMyBooleanState} className={myBooleanState ? Styles.comments_active_populer_and_active : Styles.comments_latest}>Latest</span>
                    <span onClick={toggleMyBooleanState} className={myBooleanState ? Styles.comments_populer : Styles.comments_active_populer_and_active}>Populer</span>
                </div>
            </header>
        </>
    )
}

export default React.memo(Header)