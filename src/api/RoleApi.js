import Api from "./Api"

export const getRoles = () =>{
    return Api.get('role');
}