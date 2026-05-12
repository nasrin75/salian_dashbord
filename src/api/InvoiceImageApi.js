import Api from "./Api";

export const getImagesUrlByInvoiceNumber = (invoiceNumber) => {
    return Api.post(`/files/invoiceImages?invoiceNumber=${invoiceNumber}`)
}

