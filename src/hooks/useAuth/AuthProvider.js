import { useCallback, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { login } from "../../api/AuthApi";
import { toast } from "react-toastify";
import { StoreTokenInLocalStorage } from "../../utlis/constants/common";
import { getMyPermission } from "../../api/UserApi";
import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "../../utlis/constants/routePath";

const AuthProvider = ({ children }) => {

    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState({})
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

                    const token = result.token;
                    setToken(token)
                    StoreTokenInLocalStorage(token)
                    localStorage.setItem('user',JSON.stringify(result))

                    //console.log('loginResult',result)
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                    //localStorage.setItem("role", result.role)

                    //getPermission list
                     getPermissions()
                    
                    //Notify
                    toast.success("شما با موفقیت وارد شدید")


                }).catch(() => {
                    //toast.error("نام کاربری یا رمزعبور اشتباه است.")
                })

        },
        [setToken, token],
    );

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("permissions")

        window.location.href = '/login'
    }

    const getPermissions = async () => {
        await getMyPermission()
            .then(data => {
                const result = data.data['result'];
                const permissionNames = result.map(permission => permission.name).join(",")
                setPermissions(permissionNames)

                localStorage.setItem("permissions", permissionNames)
            }).catch(err => {
                console.log("getMyPermissionErr", err.response?.data)
                if (err.response?.data == 'IP_ADDRESS_IS_NOT_PERMITTED') {
                    window.location.href = APP_ROUTES.UNAUTHORIZED_PATH
                }
            });
    }

    const hasPermission = (rights) => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("hasPermissionRole", user?.role.toLowerCase());
       return user?.role.toLowerCase() == 'admin' ? true
        : rights.some(right => localStorage.getItem('permissions')?.includes(right));
    }


    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={{ token, setToken, loginAction, permissions, hasPermission, logout }}>
            {children}
        </AuthContext.Provider>
    );
}



export default AuthProvider