import { handleFunctionCall } from "../services/vapiwebhook.service";
export async function vapiWebHook(req,res,next){
    const {message} = req.body;
    if(message?.type === 'function-call'){
        try {
            const resultData = handleFunctionCall(message);
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