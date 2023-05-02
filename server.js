
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
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const PDFParser = require('pdf-parse');
const streamToBuffer = require('stream-to-buffer');
const csvWriter = require('csv-write-stream');

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
const PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
    console.log("server is running on 8080");
})



const storage = new Storage({
  projectId: 'fresh-generator-383318',
  keyFilename: './keyfile/fresh-generator-383318-f79f6625deb9.json',
});

const bucket = storage.bucket('upload_pdfs');
const bucket_csv = storage.bucket('csv_download1')
var pdf_list = []
app.post('/post', (req, res, next) => {
  var file_t = req.files.file;
  
  var filename = file_t.name;
  const file = bucket.file(filename);
  pdf_list.push(filename);
  const stream = file.createWriteStream({
    metadata: {
      contentType: file_t.mimetype,
    },
    resumable: false,
  });

  stream.on('error', err => {
    file_t.buffer = null;
    next(err);
  });

  stream.on('finish', () => {
    file_t.buffer = null;
    res.status(200).send('File uploaded successfully.');
  });

  stream.end(file_t.data);
  setTimeout(function() {
      list = []
      file_list = []
      listFilesInBucket().then(fileNames => {
      console.log(fileNames);
      for(let i = 0; i < fileNames.length; i++) {
        console.log(fileNames[i])
        file_list.push(fileNames[i])
        getTextFromPDF(fileNames[i])
        .then((text) => {
          console.log(text);
          list.push(text);
          list.push("END_OF_FILE")
          if(i === fileNames.length-1) {
            list.pop()
          }
          app.get('/file_names', (req, res) => {
            res.json(file_list);
          });
          app.get('/data', (req, res) => {
            res.json(list);
          });
        })
        .catch((err) => {
          console.error(err);
        });
      }
    }).catch(error => {
      console.error(error);
    })
  }, 3000)
});


app.post("/", function(req, res){
    let newNote = new Note({
        name: req.body.name,
        date: today,
        wing: req.body.wing,
        text: req.body.highlight,
        reason: req.body.reason
    });
    newNote.save();
    res.json("Submitted");
})



app.delete('/deleteFile/:fileName', async (req, res) => {
  const fileName = req.params.fileName;

  // Get the file object
  const file = bucket.file(fileName);

  // Delete the file
  await file.delete();

  // Redirect to admin page after deletion
  res.redirect('/admin');
  setTimeout(function() {
    list = []
    file_list = []
    listFilesInBucket().then(fileNames => {
    console.log(fileNames);
    
    for(let i = 0; i < fileNames.length; i++) {
      console.log(fileNames[i])
      file_list.push(fileNames[i])
      getTextFromPDF(fileNames[i])
      .then((text) => {
        console.log(text);
        list.push(text);
        list.push("END_OF_FILE")
        if(i === fileNames.length-1) {
          list.pop()
        }
        app.get('/file_names', (req, res) => {
          res.json(file_list);
        });
        app.get('/data', (req, res) => {
          res.json(list);
        });
      })
      .catch((err) => {
        console.error(err);
      });
    }
  }).catch(error => {
    console.error(error);
  })
  }, 3000)
});


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

app.post('/export', async (req, res) => {
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
          
          const file = bucket_csv.file("data.csv");

          const fileStream = fs.createReadStream("data.csv");
          const uploadStream = file.createWriteStream();

          fileStream.pipe(uploadStream);
          console.log('CSV file written successfully');
          setTimeout(() => {
            res.redirect(301, "https://storage.cloud.google.com/csv_download1/data.csv?authuser=2")
          }, 3000);
          
        })
        .catch((err) => {
          console.error(err);
          res.sendStatus(500);
        });

      client.close();
    });
});

var sent = new sentiment();
var test = ""
app.post("/sentiment_score", async (req,res) => {
  var sentence = req.body.sentiment;
  console.log(sentence);
  var result = sent.analyze(sentence);
  test = result.score;
  res.json(result);
})


function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
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



async function getTextFromPDF(fileName) {
  // Get the PDF file from the bucket

  const file = bucket.file(fileName);

  // Download the file to memory
  const [fileBuffer] = await file.download();
  console.log(fileBuffer)
  // Parse the PDF file and get the text content
  const pdf = await pdfjs.getDocument(fileBuffer).promise;
  const numPages = pdf.numPages;
  let text = '';
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const pageText = await page.getTextContent();
    text += pageText.items.map(item => item.str).join(' ');
  }

  return text;
}
async function listFilesInBucket() {

  // Get a list of files in the bucket
  const [files] = await bucket.getFiles();

  // Get the file names and return as an array
  const fileNames = files.map(file => file.name);
  return fileNames;
}

var file_list = []
listFilesInBucket().then(fileNames => {
  console.log(fileNames);
  
  for(let i = 0; i < fileNames.length; i++) {
    console.log(fileNames[i])
    file_list.push(fileNames[i])
    getTextFromPDF(fileNames[i])
    .then((text) => {
      console.log(text);
      list.push(text);
      list.push("END_OF_FILE")
      if(i === fileNames.length-1) {
        list.pop()
      }
      app.get('/file_names', (req, res) => {
        res.json(file_list);
      });
      app.get('/data', (req, res) => {
        res.json(list);
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }
}).catch(error => {
  console.error(error);
});

