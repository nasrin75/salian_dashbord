import Api from "./Api"

export const getInventories = (equipment="ALL") => {
    return Api.get(`/inventory?equipment=${equipment}`);
}
export const deleteInventory = (inventoryID) => {
    return Api.delete(`/inventory/delete?id=${inventoryID}`)
}

export const InventoryDetails = (inventoryID) => {
    return Api.get(`/inventory/${inventoryID}`)
}
export const createInventory = (data) => {
    return Api.post('/inventory/create', data)
}

export const updateInventory = (data) => {
    return Api.put('/inventory/edit', data)
}