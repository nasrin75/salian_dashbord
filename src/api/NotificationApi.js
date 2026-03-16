import Api from "./Api"

export const SendEmailToUsers = (data) => {
    return Api.post("/notification/sendEmailToUsers", data);
}

export const SendSmsToUsers = (data) => {
    return Api.post("/notification/sendSmsToUsers", data);
}
