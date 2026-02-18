import Api from "./Api";

export const getDetails = (userID) => {
    return Api.get(`/profile/${userID}`)
}
export const updateProfile = (data) => {
    return Api.put("/profile/setting/edit", data)
}
