import Api from "./Api"

export const getEquipments = () => {
    return Api.get('/equipment');
}
export const getParentEquipments = () => {
    return Api.get('/equipment/parents');
}
export function deleteEquipment(equipmentID) {
    return Api.delete(`/equipment/${equipmentID}`)
}

export function EquipmentDetails(equipmentID) {
    return Api.get(`/equipment/${equipmentID}`)
}
export const createEquipment = (data) => {
    return Api.post('/equipment', data)
}

export const updateEquipment = (data) => {
    return Api.put('/equipment', data)
}

export const getInventorySubMenu = () => {
    return Api.get('/inventory/subMenu')
}

export const getEquipmentFeatures = (equipmentID) => {
    return Api.post(`/equipment/features/${equipmentID}`)
}