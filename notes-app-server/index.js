import express, { response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });


app.get("/api/notes", async(req,res) => {
    // console.log("Here");
    const notes = await prisma.note.findMany();
    res.json(notes);
});

app.post("/api/notes", async(req,res) => {
    const {title,content} = req.body;
    
    if(!title || !content){
        return res
          .status(400)
          .send("title and content fields are required");
    }

    try {
    const note = await prisma.note.create({
        data: {title,content}
    })
    res.json(note);
    } catch (error) {
       res.status(500).send("Oops something went wrong try again later");    
    }
});


app.put("/api/notes/:id",async(req,res) => {
    console.log("HERE");
    const {title,content} = req.body;
    const id = parseInt(req.params.id);

    if(!id){
        return res.status(400).send("Id must be valid number");
    }

    if(!title || !content){
        return res.status(400).send("Note doesn't exist");
    }

    try {
        const updatedNote = await prisma.note.update({
            where: {id},
            data: {title,content}
        })
        res.json(updatedNote);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Oops an error occured");
    }
})

app.delete("/api/notes/:id", async(req,res) => {
    const id = parseInt(req.params.id);
    
    if(!id){
        return res.status(400).send("Id must be valid integer");
    }
    
    try {
       await prisma.note.delete({
            where: {id},
        });
     res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send("Oops an error occured");
    }
})


app.listen(5000,()=>{
    console.log("Server running on port:5000");
});