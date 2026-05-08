import Api from "./Api";

export const getSettings = () => {
    return Api.get('/setting')
}


export const updateSetting = (data) => {
    return Api.put('/setting/edit', data)
}
