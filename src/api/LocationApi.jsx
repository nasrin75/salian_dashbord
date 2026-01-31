import Api from "./Api"

export const getLocations = () =>{
    return Api.get('/location');
}