import { useContext } from "react";
import TranslateContext from "./TranslateContext";

const useTranslate = () => {
    return useContext(TranslateContext);
}

export default useTranslate