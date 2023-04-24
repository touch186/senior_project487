
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
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const sentiment = require('sentiment');
const session = require('express-session');

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://hongbinzhu4:0wP9Z9KIhxqoeJxm@cluster0.fsieggk.mongodb.net/project_database");

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.use(express.static(__dirname));

app.use(upload());

app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));
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
    // console.log("getcontent");
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
    console.log(item.str);
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
    // files.reverse();
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
      console.log(temp[i]);
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
      req.session.user = {
        id: user._id,
        username: user.username
      };
      res.redirect('/admin');
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

app.get('/export', async (req, res) => {
    await client.connect();
    const db = client.db('project_database');
    const collection = db.collection('notes');

    collection.find({}, { projection: { _id: 0, name: 1, date: 1 , wing: 1, text: 1, reason: 1} }).toArray(function(err, docs) {
      if (err) throw err;

      const csvWriter = createCsvWriter({
        path: 'data.csv',
        header: [
          { id: 'name', title: 'Name' },
          { id: 'date', title: 'Date' },
          { id: 'wing', title: 'Wing' },
          { id: 'text', title: 'Text' },
          { id: 'reason', title: 'Reason'}
        ]
      });

      csvWriter.writeRecords(docs)
        .then(() => {
          console.log('CSV file written successfully');
          res.download('data.csv', 'data.csv');
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });

      client.close(); // Maybe delete this so i can press it twice?
    });
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



// result = sent.analyze('Cats are stupid.');
// console.dir(result.score);
var sent = new sentiment();
var test = ""
app.post("/sentiment_score", async (req,res) => {
  var sentence = req.body.sentiment;
  console.log(sentence);
  var result = sent.analyze(sentence);
  test = result.score;
  res.json(result);
  // res.redirect('sentiment_score');
})
// app.get("/sentiment_score", async (req,res) => {
//   res.json(test);
// })

function requireAuth(req, res, next) {
  if (req.session.user) {
    // User is authenticated, continue with request
    next();
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/signin.html');
  }
}

app.get('/admin', requireAuth, (req, res) => {
  const filePath = path.join(__dirname, 'admin', 'admin.html');
  res.sendFile(filePath);
});

function checkSession(req, res, next) {
  if (req.session.lastInteraction) {
    // Check if it's been more than 5 minutes since last interaction
    const now = new Date();
    const lastInteraction = new Date(req.session.lastInteraction);
    const minutesSinceLastInteraction = (now - lastInteraction) / 1000 / 60;

    if (minutesSinceLastInteraction >= 5) {
      // Session has expired, destroy it
      req.session.destroy();
    }
  }

  // Update last interaction time
  req.session.lastInteraction = new Date();

  // Continue with request
  next();
}

// Apply the middleware to all routes
app.use(checkSession);
