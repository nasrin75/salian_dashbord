import Api from "./Api";

export const getHistories = () => {
    return Api.get('/history')
}
export const deleteHistory = (historyID) => {
    return Api.delete(`/history/delete?id=${historyID}`)
}
