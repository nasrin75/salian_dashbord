import Api from "./Api"

export const getPermissions = () =>{
    return Api.get('permission');
}

export const deletePermission = (permissionID) => {
    return Api.delete(`/permission/delete?id=${permissionID}`)
}

export const PermissionDetails = (permissionID) => {
    return Api.get(`/permission/${permissionID}`)
}
export const createPermission = (data) => {
    return Api.post('/permission/create', data)
}

export const updatePermission = (data) => {
    return Api.put('/permission/edit', data)
}
export const assignUserPermission = (data) => {
    return Api.post('/user/permission/add', data)
}