import Api from "./Api"

export const getActionTypes = () => {
    return Api.get('/actionType');
}
export const deleteActionType = (actionTypeID) => {
    return Api.delete(`/actionType/delete?id=${actionTypeID}`)
}

export const ActionTypeDetails = (actionTypeID) => {
    return Api.get(`/actionType/${actionTypeID}`)
}
export const createActionType = (data) => {
    return Api.post('/actionType/create', data)
}

export const updateActionType = (data) => {
    return Api.put('/actionType/edit', data)
}