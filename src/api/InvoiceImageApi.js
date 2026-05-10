import Api from "./Api";

export const getImagesUrlByInvoiceNumber = (invoiceNumber) => {
    return Api.post(`/invoiceImages?invoiceNumber=${invoiceNumber}`)
}

