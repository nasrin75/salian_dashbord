import Api from "./Api"

export const getBranches = () =>{
    return Api.get('/branch');
}
