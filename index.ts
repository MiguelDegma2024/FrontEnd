import express, {Express} from "express";
import apiRouter from './src/routes/Routes';
import morgan from "morgan";
import cors from "cors";
import Api from "./src/Api";


const app: Express = express();

const port = 3000;


app.use(cors({ origin: true }));

app.use(morgan('dev'));

app.use(express.json());

app.use();



app.listen(port, () => {

console.log(`Example app listening on port ${port}`);

});