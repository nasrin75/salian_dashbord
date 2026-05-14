import Api from "./Api"

export const chargeCartridge = (data) => {
    return Api.post('/operation/chargeCartridge', data)
}

export const AddReplace = (data) => {
    return Api.post('/operation/addReplace', data)
}
