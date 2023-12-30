import React from 'react'
import Styles from "../../ModuleStyles/Comments/Comments.module.css"
import { handleTimeTimeISOToLocalFormat } from '../../utils/CanvasMethods/CommonMethods'
import { useState } from 'react'
import { useEffect } from 'react'


const CommentReply = ({ data }) => {
    console.log('data:', data)
    let [loading, setLoading] = useState(false)
    let [localData, setLocalData] = useState([])
    let [count, setCount] = useState(3)


    const handleReverse = (array) => {
        console.log('array:', array)
        let temp = [...array].reverse()
        if (temp.length > 3) {
            temp.splice(count)
        }

        return temp
    }
    useEffect(() => {
        let reversedArray = handleReverse(data)
        console.log('reversedArray:', reversedArray)
        setLocalData(reversedArray)
    }, [data.length, count])

    return (
        <section className={Styles.comments_reply_container}>
            {
                loading ? <h1>loading</h1> : localData?.map((ele) => {
                    return <div className={Styles.comments_reply}>
                        <div>
                            <header className={Styles.comments_reply_header}>
                                <span>{ele.commentedBy}</span>
                                <span>{handleTimeTimeISOToLocalFormat(ele.createdAt).ago}</span>
                            </header>
                            <div className={Styles.comments_content}>
                                <span>{ele.comment}</span>
                            </div>
                        </div>
                        <div className={Styles.comments_reply_name_first_letter}>
                            <span>{ele.commentedBy.split("")[0]}</span>
                        </div>
                    </div>
                })
            }
           { data.length > 3 && <section className={Styles.comments_reply_more_less_container}>
                <span onClick={() => {
                    if (count <= data.length) {
                        setCount(count + 3)
                    }
                }}>More</span>
                <span onClick={() => {
                    if (localData.length > 3) {
                        setCount(count - 3)
                    }
                }}>Less</span>
            </section>}
        </section>
    )
}

export default CommentReply