import { useCallback, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { login } from "../../api/AuthApi";
import { toast } from "react-toastify";
import { StoreTokenInLocalStorage } from "../../utlis/constants/common";
import { getMyPermission } from "../../api/UserApi";
import { APP_ROUTES } from "../../utlis/constants/routePath";

const AuthProvider = ({ children }) => {

    const [token, setToken_] = useState(localStorage.getItem("token"));
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
                    const result = data.data.data;
                    console.log(data.data.data)
                    const token = result.token;
                    setToken(token)
                    StoreTokenInLocalStorage(token)
                    localStorage.setItem('user', JSON.stringify(result))

                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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

        window.location.href = APP_ROUTES.LOGIN_PATH
    }

    const getPermissions = async () => {
        await getMyPermission()
            .then(data => {
                const result = data.data.data;
                const permissionNames = result.map(permission => permission.name).join(",")
                //if(result?.role.toLowerCase() != 'admin'){
                    setPermissions(permissionNames)
                //}
                

                localStorage.setItem("permissions", permissionNames)
            }).catch(err => {

                if (err.response?.data == 'IP_ADDRESS_IS_NOT_PERMITTED') {
                    window.location.href = APP_ROUTES.UNAUTHORIZED_PATH
                }
            });
    }

    const getUserID = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        return user.userId;
    }

    const hasPermission = (rights) => {
        //return false;
        const user = JSON.parse(localStorage.getItem('user'));

        return user?.role.toLowerCase() == 'admin' ? true
            : rights.some(right => localStorage.getItem('permissions')?.includes(right));
    }


    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={{ token, setToken, loginAction, permissions, hasPermission, logout, getUserID }}>
            {children}
        </AuthContext.Provider>
    );
}



export default AuthProvider