import Api from "./Api"

export const chargeCartridge = (data) => {
    return Api.post('/operation/chargeCartridge', data)
}
