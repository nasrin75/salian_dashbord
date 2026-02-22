import Api from "./Api"

export const login = (data) =>{
    return Api.post('/auth/login',data)
}


export const resetPassword = (email) =>{
    return Api.post(`/resetPassword?email=${email}`)
}

export const verifyResetPassword= (data) =>{
    return Api.post('/verifyResetPassword',data)
}