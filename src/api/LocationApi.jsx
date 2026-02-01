import Api from "./Api"

export const getLocations = () =>{
    return Api.get('/location');
}
export const deleteLocation = (locationID) =>{
    return Api.delete(`/location/delete?id=${locationID}`)
}

export const LocationDetails=(locationID) => {
    return Api.get(`/location/${locationID}`)
}
export const createLocation = (data) =>{
    return Api.post('/location/create',data)
}

export const updateLocation = (data) =>{
    return Api.put('/location/edit',data)
}