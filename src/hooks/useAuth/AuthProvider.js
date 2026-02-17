import { useCallback, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { login } from "../../api/AuthApi";
import { toast } from "react-toastify";
import { StoreTokenInLocalStorage } from "../../utlis/constants/common";
import { getMyPermission } from "../../api/UserApi";

const AuthProvider = ({ children }) => {

    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState('')
    const [permissions, setPermissions] = useState([])

    // Function to set the authentication token
    const setToken = (newToken) => {
        setToken_(newToken)
    }



    // send username and password to verify user and get token
    const loginAction = useCallback(
        async (data) => {
            await login(data)
                .then(data => {
                    const result = data.data['result'];

                    console.log('result', result)
                    const token = result.token;
                    setToken(token)
                    StoreTokenInLocalStorage(token)
                    
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                    localStorage.setItem("role", result.role)

                    //getPermission list
                    getPermissions()
                    //Notify
                    toast.success("شما با موفقیت وارد شدید")
                    

                }).catch(() => toast.error("نام کاربری یا رمزعبور اشتباه است."))

        },
        [setToken, token],
    );


    const getPermissions = async () => {
        await getMyPermission()
            .then(data => {
                const result = data.data['result'];
                const permissionNames = result.map(permission => permission.name).join(",")
                setPermissions(permissionNames)

                localStorage.setItem("permissions", permissionNames)

                console.log(permissions)
            });
    }
    // const hasPermission = async (permissionName) => {
    //     let allUserPermission = localStorage.getItem('permissions');
    //     if (allUserPermission === null) {
    //         allUserPermission = permissions;
    //     }
    //     const has = role.toString().toLowerCase() == 'admin' ? true : allUserPermission?.includes(permissionName);
    //     //const has = permissions.includes(permissionName)
    //     return false;
    //     //console.log("hasPermission333", has)
    // }
    const hasPermission = (rights) => localStorage.getItem('role')?.toString().toLowerCase() == 'admin' ? true : rights.some(right => localStorage.getItem('permissions')?.includes(right));
    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={{ token, setToken, loginAction, permissions, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}



export default AuthProvider