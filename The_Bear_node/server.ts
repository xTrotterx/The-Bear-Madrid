import express,{Express} from 'express';
import configPipeline from './config_server/configPipeline';

const app: Express= express();

configPipeline(app);

app.listen(3003, (error?:Error)=>{
    if(!error) console.log('....servidor escuchando en puerto 3003');
});
