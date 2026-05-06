import Api from "./Api"

export const getBrands = () => {
    return Api.get('/brand');
}
