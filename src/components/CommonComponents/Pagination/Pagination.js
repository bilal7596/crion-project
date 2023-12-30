import React from 'react'
import leftArrayIcon from "../../../assets/UIUX/icons/chevron-left.svg"
import rightArrayIcon from "../../../assets/UIUX/icons/chevron-right.svg"
import Styles from "./Pagination.module.css"


const Pagination = ({ length, activePage, updateMethod, totalPage, handleGetDataBasedOnPagination }) => {
    activePage = Number(activePage)
    console.log('updateMethod:', updateMethod)
    console.log('activePage:', activePage)

    let next = () => {
        updateMethod(activePage + 1)
        handleGetDataBasedOnPagination()
    }
    let prev = () => {
        updateMethod(activePage - 1)
        handleGetDataBasedOnPagination()
    }
    return (
        <div className={Styles.pagination}>
            <button onClick={() => prev()} disabled={activePage == 1}><img src={leftArrayIcon} /></button>
            <div>
                {
                    new Array(length).fill(0).map((_, index) => {
                        return <span onClick={(e) => {
                            updateMethod(e.target.innerText)
                            handleGetDataBasedOnPagination()
                        }} style={activePage == index + 1 ? { backgroundColor: "#06337E", color: "white" } : {}}>{index + 1}</span>
                    })
                }
            </div>
            <button onClick={() => next()} disabled={activePage == totalPage}><img src={rightArrayIcon} /></button>
        </div>
    )
}

export default Pagination