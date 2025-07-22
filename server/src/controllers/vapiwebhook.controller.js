import { handleFunctionCall } from "../services/vapiwebhook.service.js";
export async function vapiWebHook(req,res,next){

// contoh message
// {

//   "message": {

//     "type": "function-call",

//     "call": { Call Object },

//     ...other message properties

//   }

// }
    const {message} = req.body;
    if(message.type === 'function-call'){
        try {
            const resultData = await handleFunctionCall(message);
            return res.json({
                result:{
                    type: 'function-call-result',
                    result: JSON.stringify(resultData)
                }
            });
        } catch (error) {
            next(error);
            
        }
    }
    
}