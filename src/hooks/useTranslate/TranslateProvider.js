import { isNumber } from "@mui/x-data-grid/internals";
import { ResponseMessage } from "../../Response/ResponseMessage"
import TranslationContext from "./TranslateContext"

const TranslateProvider = ({ children }) => {

    const getMessage = (message) => {
         if( !message  || typeof(message) !== 'string'){
            return message;
        }
        console.log('mgs',message);
        if( message === undefined || message == null || isNumber(message)){
            return message;
        }
        
        const resp = ResponseMessage.find((item) => item?.key && item?.key.toUpperCase() === message.toUpperCase());
        const result = resp?.mgs || message;
        console.log("type : ",typeof(result))
        return  result;
    }

    return <TranslationContext.Provider value={{ getMessage }}>
        {children}
    </TranslationContext.Provider>
}

export default TranslateProvider;