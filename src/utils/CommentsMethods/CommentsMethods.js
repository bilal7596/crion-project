import { createCommentAPI, deleteCommentAPI, editCommentAPI, getCommentAPI } from "../../Api/Comments/CommentsApi"

export const handleControlLengthOfComments = (e, lengthOfTextInsideTheTextArea, setLengthOfTextInsideTheTextArea) => {
    if (e.target.value.length <= 200) {
        setLengthOfTextInsideTheTextArea(e.target.value.length)
    }
}


export const handleCreateCommentMethod = async (inputBoxValue, assetId, formId, dispatch, commentsStateManagementActions) => {
    let loggedInUser = JSON.parse(localStorage.getItem("loginUser"))
    let payload = {
        assetId,
        formId,
        isReply: "",
        replyOf: "",
        comment: inputBoxValue,
        commentedBy: loggedInUser.userId
    }
    try {
        let response = await createCommentAPI(payload)
        console.log('response:', response)
        handleGetCommentsMethod(formId, dispatch, commentsStateManagementActions)
    } catch (error) {
        console.log(error)
    }
}


export const handleReplyOnCommentMethod = async (inputBoxValue, assetId, formId, dispatch, commentsStateManagementActions, commentId) => {
    let loggedInUser = JSON.parse(localStorage.getItem("loginUser"))
    let payload = {
        assetId,
        formId,
        isReply: true,
        replyOf: commentId,
        comment: inputBoxValue,
        commentedBy: loggedInUser.userId
    }

    console.log('payloadd:', payload)
    try {
        let response = await createCommentAPI(payload)
        console.log('response:', response)
        handleGetCommentsMethod(formId, dispatch, commentsStateManagementActions)
    } catch (error) {
        console.log(error)
    }
}



export const handleCreateCommentOnKeyPress = async (e, inputBoxValue, assetId, formId, setInputBoxValue, setLengthOfTextInsideTheTextArea, dispatch, commentsStateManagementActions) => {
    if (e.key == "Enter") {
        let loggedInUser = JSON.parse(localStorage.getItem("loginUser"))
        let payload = {
            assetId,
            formId,
            isReply: "",
            replyOf: "",
            comment: inputBoxValue,
            commentedBy: loggedInUser.userId
        }
        try {
            let response = await createCommentAPI(payload)
            console.log('response:', response)
            setInputBoxValue("")
            setLengthOfTextInsideTheTextArea(0)
            handleGetCommentsMethod(formId, dispatch, commentsStateManagementActions)
        } catch (error) {
            console.log(error)
        }
    }

}


export const handleReplyOnCommentOnKeyPress = async (e, inputBoxValue, assetId, formId, setInputBoxValue, setLengthOfTextInsideTheTextArea, dispatch, commentsStateManagementActions) => {
    if (e.key == "Enter") {
        let loggedInUser = JSON.parse(localStorage.getItem("loginUser"))
        let payload = {
            assetId,
            formId,
            isReply: "",
            replyOf: "",
            comment: inputBoxValue,
            commentedBy: loggedInUser.userId
        }
        try {
            let response = await createCommentAPI(payload)
            console.log('response:', response)
            setInputBoxValue("")
            setLengthOfTextInsideTheTextArea(0)
            handleGetCommentsMethod(formId, dispatch, commentsStateManagementActions)
        } catch (error) {
            console.log(error)
        }
    }

}


export const handleEditComments = async (commentId, newCommentText, formId, dispatch, commentsStateManagementActions, setEditToggl, commentedBy) => {
    let payload = { commentId, body: { comment: newCommentText, commentedBy } }
    try {
        let response = await editCommentAPI(payload)
        console.log('response:', response)
        handleGetCommentsMethod(formId, dispatch, commentsStateManagementActions)
        setEditToggl(false)
    } catch (error) {
        console.log(error)
    }
}


export const handleDeleteComments = async (commentId, formId, dispatch, commentsStateManagementActions) => {
    try {
        let response = await deleteCommentAPI(commentId)
        console.log('response:', response)
        handleGetCommentsMethod(formId, dispatch, commentsStateManagementActions)
    } catch (error) {
        console.log(error)
    }
}



export const handleGetCommentsMethod = async (formId, dispatch, commentsStateManagementActions) => {
    console.log('formId:', formId)
    try {
        let response = await getCommentAPI(formId)
        console.log('response of the get:', response)
        let mainComments = {};
        let reversedData = response.data
        console.log('reversedData:', reversedData)
        reversedData.map((ele) => {
            if (!ele.isReply) mainComments[ele.cdid] = { ...ele, replies: [] }
        })
        reversedData.map((ele) => {
            if (ele.isReply && mainComments[ele.replyOf]) {
                mainComments[ele.replyOf].replies = [...mainComments[ele.replyOf].replies, ele]
            }
        })
        let data = [];
        for (let key in mainComments) data.push(mainComments[key])
        data = data.reverse()
        console.log('mainComments:', mainComments)
        dispatch(commentsStateManagementActions.setCommentsMethod(data))
    } catch (err) {
        console.log(err)
    }
}