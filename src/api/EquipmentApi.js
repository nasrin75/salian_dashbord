import Api from "./Api"

export const getEquipments = () => {
   return Api.get('/equipment');
}

export function deleteEquipment(equipmentID) {
    return Api.delete(`/equipment/delete?id=${equipmentID}`)
}

export function EquipmentDetails(equipmentID) {
    return Api.get(`/equipment/${equipmentID}`)
}
export const createEquipment = (data) =>{
    return Api.post('/equipment/create',data)
}

export const updateEquipment = (data) =>{
    return Api.put('/equipment/edit',data)
}

export const getInventorySubMenu =()=>{
    return Api.get('/equipment/inventory/subMenu')
}

export const getEquipmentFeatures =(equipmentID)=>{
    return Api.get(`/equipment/features/${equipmentID}`)
}