import { getAllUsers } from "../../Api/User/UserApi"

export const getAllUsersDropdownData = async (setUsers, dispatch, userActions) => {
    try {
        const response = await getAllUsers()
        console.log('usersResponse:', response)
        setUsers(response?.data?.result)
        dispatch(userActions.getAllUsers(response?.data?.result))

    } catch (error) {
        console.log('error:', error)
    }
}