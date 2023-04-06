
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const pdfjs = require("pdfjs-dist/build/pdf");
const pdfParse = require('pdf-parse');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://hongbinzhu4:0wP9Z9KIhxqoeJxm@cluster0.fsieggk.mongodb.net/project_database");

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.use(express.static(__dirname));

app.use(upload());

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


var list = [];

app.listen(3000, function() {
    console.log("server is running on 3000");
})

app.post("/post", (req,res) => {
    if(req.files) {
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        console.log(filename);

        file.mv('./uploads/'+filename, function(err) {
            if (err) {
              res.send(err);
            } else {
              // list = [];
              read_files();
              res.redirect('/admin.html');
            }
        });
    }
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

// const testFolder = './uploads';

// fs.readdir(testFolder, (err, files) => {
//     files.forEach(file => {
//       console.log(file);
//     });
// });

app.get('/get-files', function(req, res) {
    const folder = req.query.folder || '';
    const path = `${__dirname}/${folder}`;
    fs.readdir(path, function(err, files) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.json(files);
      }
    });
  });


app.delete('/deleteFile/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = `uploads/${fileName}`;

    fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          res.sendStatus(500);
        } else {
          list = [];
          read_files();
          res.sendStatus(200);
        }
    });
});



async function getContent(src, num, pages){
  const doc = await pdfjs.getDocument(src).promise;
  const page = await doc.getPage(num);
  if(num === pages){
    console.log("getcontent");
  }
  return await page.getTextContent();
}
// var list = "";


async function getItems(src, num, pages, str){
  // console.log((count++).toString() + str);
  // if(str != ''){
  //   list.push(str);
  // }
  let x = num
  let y = pages
  const content = await getContent(src, x, y);
  const items = content.items.map((item) => {
    // console.log(item.str);
    // list.push(item.str);
    // list += item.str;
    
    list.push(item.str);
    // console.log("hi");
    
    app.get('/data', (req, res) => {
      res.json(list);
    });
  });
  return items;
}
// getItems("./uploads/Project_requirements.pdf");

const directoryPath = "./uploads/";
let files = [];
function read_files(){
  fs.readdir(directoryPath, (err, result) => {
    let keyword = "END_OF_FILE";
    if (err) {
      console.error(err);
      return;
    }
    files = result;
    // console.log(files); // or do something else with the files array
    files.reverse();
    let temp = [];
    var count = 0;
    files.forEach(file => {
      filenames = directoryPath + file;
      temp.push(filenames);
      temp.push("./EOF/END_OF_FILE.pdf");
    });
    temp.pop();
    console.log(temp);
    for(let i = 0; i < temp.length; i++){
      
      pdfParse(temp[i]).then((pdfData) => {
          
          const numPages = pdfData.numpages;
          // console.log(filenames);
          console.log(numPages);
          for(var j = 1; j <= numPages; j++){
            // console.log(filenames);
            // console.log(j);
            console.log(count);
            if(j === 1){
              getItems(temp[i], j, numPages, keyword);
            }else {
              
              getItems(temp[i], j, numPages, '');
            }
          }
      });
  }
  
  
  // for(var i = 0; i < files.length; i++){
  //   filenames = directoryPath + files[i];
  //   pdfParse(filenames).then((pdfData) => {
  //     const numPages = pdfData.numpages;
  //     console.log(numPages);
  //     for(var j = 1; j <= numPages; j++){
  //       getItems(filenames, j);
  //     }
      
  //   })
  // }
  });
}

read_files();


const uri = 'mongodb+srv://hongbinzhu4:0wP9Z9KIhxqoeJxm@cluster0.fsieggk.mongodb.net/test?retryWrites=true&w=majority';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// Use body-parser to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the login form
// app.get('/login', (req, res) => {
//   res.send(`
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Login Form</title>
//       </head>
//       <body>
//         <h1>Login Form</h1>
//         <form action="/login" method="POST">
//           <label for="username">Username:</label>
//           <input type="text" id="username" name="username" required><br><br>

//           <label for="password">Password:</label>
//           <input type="password" id="password" name="password" required><br><br>

//           <input type="submit" value="Submit">
//         </form>
//       </body>
//     </html>
//   `);
// });

// Handle form submissions
app.post('/login', async (req, res) => {
  try {
    await client.connect();

    const users = client.db("mydatabase").collection("users");
    const user = await users.findOne({ username: req.body.username });

    if (!user) {
      res.send("User not found");
      return;
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (passwordMatch) {
      res.redirect('/admin.html');
    } else {
      res.send("Incorrect password");
    }
  } catch (err) {
    console.log(err);
    res.send("Internal server error");
  } finally {
    await client.close();
  }
});

// async function listUsernames() {
//   try {
//     await client.connect();

//     const users = client.db("mydatabase").collection("users");
//     const usernames = await users.distinct("username");

//     console.log(usernames);
//   } catch (err) {
//     console.log(err);
//   } finally {
//     await client.close();
//   }
// }

// listUsernames();