import express from "express";
import morgan from "morgan";
import bodyParse from "body-parser";
import multer from "multer";
import path from "path";
import {dirname} from 'path';
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
var name;
const app = express();
const port =  3000;
const write = []

app.use(morgan("tiny"));
app.use(express.static(__dirname+"/public")) 
app.use('/uploads', express.static('uploads'));
app.use(bodyParse.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname+"/views")
app.get("/", (req, res) => {
    const data = {
        title: "Home | Saadhan",
        blog: write
    }
    console.log(write.length);
    res.render("index.ejs", data);
})

app.get("/blogs", (req, res) => {
    const blogs = {
        title: "Blogs | Saadhan",
        blogs: write,
    }
    res.render("blogs.ejs", blogs)
})

app.get("/write", (req, res) => {
    var data = {
        title: "Write | Saadhan",
        blogs: write,
        
    }
    res.render("write.ejs", data);
})

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        return cb(null, `${__dirname}/public/img`)
    }, filename : function(req, file, cb){
        name = `${Date.now()}-${file.originalname}`;
        return cb(null, name);
    }
})

const upload = multer({storage: storage})
app.post("/submit", upload.single('img'), (req, res) => {
    console.log(req.body)
    req.body['img']=name;
    write.push(req.body)
    console.log(write)
    console.log(req.file)
    

    return res.redirect("/");
})


app.listen(port, (err) => {
    if(err){
        console.log("Something went Wrong");
    }else{
        console.log(`Server is Running at http://localhost:${port}`);
    }
})
