import { useCallback, useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import { login } from "../../api/AuthApi";
import { toast } from "react-toastify";
import { StoreTokenInLocalStorage } from "../../utlis/constants/common";

const AuthProvider = ({ children }) => {

    const [token, setToken_] = useState(localStorage.getItem("token"));

    // Function to set the authentication token
    const setToken = (newToken) => {
        setToken_(newToken)
    }

    // send username and password to verify user and get token
    const loginAction = useCallback(
        (data) => {
            login(data)
                .then(data => {
                    const result = data.data['result'];
                    const token = result.token;
                    setToken(token)
                    StoreTokenInLocalStorage(token);
                    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    
                    //Notify
                    toast.success("شما با موفقیت وارد شدید")

                }).catch(() => toast.error("نام کاربری یا رمزعبور اشتباه است."))

        },
        [setToken, token],
    );

    // useEffect(() => {
    //     if (token) {
    //         console.log('delhasTokenToken')
    //         axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    //         StoreTokenInLocalStorage(token);
    //     } else {
    //         console.log('delToken::', token)
    //         //alert("توکن اکسپایر شده")

    //         // delete axios.defaults.headers.common["Authorization"];
    //         // localStorage.removeItem(token);
    //     }
    // }, [token])


    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={{ token, setToken, loginAction }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider