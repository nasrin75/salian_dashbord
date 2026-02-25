import { isNumber } from "@mui/x-data-grid/internals";
import { ResponseMessage } from "../../Response/ResponseMessage"
import TranslationContext from "./TranslateContext"

const TranslateProvider = ({ children }) => {

    const getMessage = (message) => {
        console.log('mgs',message);
        if( message === undefined || message == null || isNumber(message)){
            return message;
        }
        const resp = ResponseMessage.find((item) => item.key.toUpperCase() == message.toUpperCase());
        return resp === undefined || resp == null || resp.length <= 0  ? message : resp.mgs;
    }

    return <TranslationContext.Provider value={{ getMessage }}>
        {children}
    </TranslationContext.Provider>
}

export default TranslateProvider;