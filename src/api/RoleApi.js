import Api from "./Api"

export const getRoles = () => {
    return Api.get('role');
}

export const deleteRole = (roleID) => {
    return Api.delete(`/role/${roleID}`)
}

export const RoleDetails = (roleID) => {
    return Api.get(`/role/${roleID}`)
}
export const createRole = (data) => {
    return Api.post('/role', data)
}

export const updateRole = (data) => {
    return Api.put('/role/edit', data)
}

export const getRolePermissions = (roleID) => {
    return Api.post(`/role/${roleID}/permissions`)
}
export const assignRolePermission = (data) => {
return Api.post('/role/permission/add', data)
}