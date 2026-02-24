import { ResponseMessage } from "../../Response/ResponseMessage"
import TranslationContext from "./TranslationContext"

const TranslationProvider = ({ children }) => {

    const getMessage = (message) => {
        const resp = ResponseMessage.find((item) => item.key.toUpperCase() == message.toUpperCase());
        return resp === undefined || resp == null || resp.length <= 0  ? message : resp.mgs;
    }
    console.log(getMessage("TOKEN_TIME_REMAINED"))


    return <TranslationContext.Provider value={{ getMessage }}>
        {children}
    </TranslationContext.Provider>
}

export default TranslationProvider;