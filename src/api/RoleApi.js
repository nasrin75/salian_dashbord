import Api from "./Api"

export const getRoles = () =>{
    return Api.get('role');
}

export const deleteRole = (roleID) => {
    return Api.delete(`/role/delete?id=${roleID}`)
}

export const RoleDetails = (roleID) => {
    return Api.get(`/role/${roleID}`)
}
export const createRole = (data) => {
    return Api.post('/role/create', data)
}

export const updateRole = (data) => {
    return Api.put('/role/edit', data)
}