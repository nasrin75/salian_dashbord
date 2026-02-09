import { Children, useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import useAuth from "./useAuth";
import axios from "axios";
import { login } from "../../api/AuthApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ Children }) => {

    const [token, setToken_] = useState(localStorage.getItem("token"));
    //const navigate = useNavigate(); //TODO:check it

    // Function to set the authentication token
    const setToken = (newToken) => {
        setToken_(newToken)
    }

    // send username and password to verify user and get token
    const loginAction = (data) => {
        login(data)
            .then(data => {
                const result = data.data['result'];

                setToken(result.token)
                localStorage.setItem('token',result.token)
                //Notify
                toast.success("شما با موفقیت وارد شدید")

                //navigate
                //navigate('/') //TODO:check it
            }).catch(() => toast.error("نام کاربری یا رمزعبور اشتباه است."))
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            localStorage.setItem("token", token)
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem(token);
        }
    }, token)

    // Memoized value of the authentication context
    // const contextValue = useMemo(() => {
    //     token,
    //         setToken(),
    //         loginAction()
    // }, token)

    // Provide the authentication context to the children components
    return (
        <AuthContext.Provider value={{ token, loginAction }}>
            {Children}
        </AuthContext.Provider>
    );
}

export default AuthProvider