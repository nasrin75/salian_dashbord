import Api from "./Api";

export const getHistories = (request) => {
    return Api.get('/history', request)
}
export const deleteHistory = (historyID) => {
    return Api.delete(`/history/delete?id=${historyID}`)
}

export const getHistoryBy = (entityName, entityID) => {
    return Api.post(`/${entityName}/${entityID}/history`)
}
