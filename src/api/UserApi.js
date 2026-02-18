import Api from "./Api";

export const getUsers = () => {
    return Api.get('/user')
}

export const createUser = (data) => {
    return Api.post('/user/create', data)
}
export function deleteUser(userID) {
    return Api.delete(`/user/delete?id=${userID}`)
}
export const userDetails = (userID) => {
    return Api.get(`/user/${userID}`)
}
export const updateUser = (data) => {
    return Api.get("/user/edit", data)
}
export const getUserPermissions = (userID) => {
    return Api.post(`/user/permissions?userId=${userID}`)
}
export const getMyPermission = () => {
    return Api.get('/myPermissions')
}
