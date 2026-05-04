import Api from "./Api"

export const getEmployees = () => {
   return Api.get('/employee');
}

export function deleteEmployee(employeeID) {
    return Api.delete(`/employee/${employeeID}`)
}

export function EmployeeDetails(employeeID) {
    return Api.get(`/employee/${employeeID}`)
}
export const createEmployee = (data) =>{
    return Api.post('/employee',data)
}

export const updateEmployee = (data) =>{
    return Api.put('/employee',data)
}