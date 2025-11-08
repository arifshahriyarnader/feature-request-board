import express, {Application} from 'express';
import bodyParser from 'body-parser';
import {appConfig} from './config';

const app: Application= express();
app.use(bodyParser.json());
app.use(express.json());

//start server
app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}`);
});