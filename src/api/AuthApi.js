import Api from "./Api"

export const login = (data) =>{
    return Api.post('/auth/login',data)
}
