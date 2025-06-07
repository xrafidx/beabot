import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.get('/',(req,res) => {
    console.log("Home!");
})

app.listen(port,()=>{
    console.log(`Server is listening at port ${port}`);
})