import { useContext } from "react";
import TranslationContext from "./TranslationContext";

const UseTranslation = () => {
    return useContext(TranslationContext);
}

export default UseTranslation