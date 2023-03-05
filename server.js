// function check(text) {
//     return new Promise(resolve => {
//         while(text === ""){
//             if (this.getSelection) {
//                 text = window.getSelection().toString();
//             } else if (this.selection && this.selection.type != "Control") {
//                 text = this.selection.createRange().text;
//             }
//             continue;
//         }

//     })
// }


// console.log(getSelectionText());

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jsdom = require("jsdom");

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://hongbinzhu4:0wP9Z9KIhxqoeJxm@cluster0.fsieggk.mongodb.net/project_database");

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.use(express.static(__dirname));

//gets today's date
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;

const schema = {
    name: String,
    date: String,
    wing: String,
    text: String,
    reason: String
}

const Note = mongoose.model("Note", schema);




app.listen(3000, function() {
    console.log("server is running on 3000");
})


app.post("/", function(req, res){
    let newNote = new Note({
        name: req.body.name,
        date: today,
        wing: req.body.wing,
        text: req.body.highlight,
        reason: req.body.reason
    });
    newNote.save();
})