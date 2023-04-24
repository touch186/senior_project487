

// function getSelectionText() {
//     var text = "";
//         if (this.getSelection) {
//             text = this.getSelection().toString();
//         } else if (this.selection && this.selection.type != "Control") {
//             text = this.selection.createRange().text;
//         }
//     console.log(text);
//     document.getElementById("highlight").value = text;
//     return(text);
// }


// var pageX, pageY;
// document.addEventListener("mouseup", () => {
// // function copyfieldvalue() {
// //   var field = document.getElementById("output");
// //   field.focus();
// //   field.setSelectionRange(0, field.value.length);
// //   document.execCommand("copy");
// // }

//     let selection = document.getSelection();
//     let selectedText = selection.toString();
//     var menu = document.querySelector(".menu");
//     if (selectedText !== "") {
//         let rect = document.querySelector(".text").getBoundingClientRect();
//         menu.style.display = "block";
//         menu.style.left = pageX - Math.round(rect.left) + "px";
//         menu.style.top = pageY - Math.round(rect.top) + 130 + "px";

//         // document.getElementById("output").innerHTML = selectedText;

//         // var popup = document.getElementById("mypopup");
//         // var copybtn = document.getElementById("copy-btn");

//         // copybtn.addEventListener("click", () => {
//         //   copyfieldvalue();
//         //   popup.style.display = "block";
//         // });

//         // var span = document.getElementsByClassName("close-btn")[0];

//         // span.addEventListener("click", () => {
//         //   popup.style.display = "none";
//         // });

//         // window.addEventListener("click", (event) => {
//         //   if (event.target == popup) {
//         //     popup.style.display = "none";
//         //   }
//         // });
//     } else {
//         menu.style.display = "none";
//     }
//     });
// document.addEventListener("mousedown", (e) => {
//     pageX = e.pageX;
//     pageY = e.pageY;
// });

// const buttonleft = document.getElementById("left");
//   const buttonright = document.getElementById("right");


  // function addleft() {
  //     document.getElementById("wing").value = "Left";

  // }
  // function addright() {
  //     document.getElementById("wing").value = "Right";
  // }

  // document.getElementById("left").addEventListener("click", addleft());
  // buttonright.addEventListener("click", addright());

// function loadPDF() {
//     const pdfFile = document.getElementById("pdfFile").files[0];
//     const pdfViewer = document.getElementById("pdfViewer");
//     const fileReader = new FileReader();
  
//     fileReader.onload = () => {
//       const pdfData = new Uint8Array(fileReader.result);
//       const pdfDoc = window.pdfjsLib.getDocument({ data: pdfData });
  
//       pdfDoc.promise.then((doc) => {
//         const pages = [];
  
//         for (let i = 1; i <= doc.numPages; i++) {
//           doc.getPage(i).then((page) => {
//             const scale = 1.5;
//             const viewport = page.getViewport({ scale });
//             const canvas = document.createElement("canvas");
//             const context = canvas.getContext("2d");
  
//             canvas.height = viewport.height;
//             canvas.width = viewport.width;
  
//             const renderContext = {
//               canvasContext: context,
//               viewport: viewport,
//             };
  
//             page.render(renderContext).promise.then(() => {
//               pages.push(canvas.toDataURL());
//               if (pages.length === doc.numPages) {
//                 const html = pages.map((page) => `<img src="${page}">`).join("");
//                 pdfViewer.innerHTML = html;
//               }
//             });
//           });
//         }
//       });
//     };
  
//     fileReader.readAsArrayBuffer(pdfFile);
// }

// fetch('/get-files?folder=uploads')
//   .then(response => response.json())
//   .then(data => {
//     for (let i = 0; i < data.length; i++) {
//       console.log(data[i]);

//       var x = document.createElement("embed");
//       x.setAttribute("id", "pdfs");
//       x.setAttribute("src", "./uploads/"+data[i])
//       var y = document.getElementById("frame");
//       y.appendChild(x);
//   }
//   })
//   .catch(error => {
//     console.error(error);
//   });


// Get the iframe element
// const iframe = document.getElementById("frame");

// iframe.onload = function() {
//     // Get the document object of the iframe
//     const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  
//     // Get the current selection object
//     const selection = iframeDoc.getSelection();
  
//     // Get the highlighted text
//     const highlightedText = selection.toString();
  
//     // Log the highlighted text to the console
//     console.log(highlightedText);
//   };

// pdfjsLib.getDocument('./uploads/Project_requirements.pdf').then(function(pdf) {
//   // Get the first page of the PDF
//   pdf.getPage(1).then(function(page) {
//     // Get the text layer of the PDF page
//     var textLayer = page.getTextContent();
//     // Add event listener to detect when user selects text
//     textLayer.div.addEventListener('mouseup', function() {
//       // Get the currently selected text
//       var selectedText = PDFViewerApplication.getSelectedText();
//       console.log('Selected text:', selectedText);
//     });
//   });
// });


// var pdfViewerContainer = document.getElementById('pdf-viewer-container');

// // Get the canvas element for displaying the PDF pages
// var pdfCanvas = document.getElementById('pdf-canvas');

// // Load the PDF document using the PDF.js library
// pdfjsLib.getDocument('./uploads/Project_requirements.pdf').then(function(pdfDocument) {

//   // Create a new PDF viewer instance
//   var pdfViewer = new pdfjsLib.PDFViewer({
//     container: pdfViewerContainer,
//     canvas: pdfCanvas
//   });

//   // Attach the PDF viewer to the PDF document
//   pdfDocument.getPage(1).then(function(page) {
//     pdfViewer.setDocument(pdfDocument);
//     pdfViewer.setInitialPage(page);
//     pdfViewer.update();
//   });

//   // Wait for the PDF viewer to finish rendering
//   pdfViewer.viewerPromise.then(function() {

//     // Define an empty array to hold the extracted text
//     var highlightedText = [];

//     // Get the PDF.js viewer application object
//     var pdfApplication = pdfViewer.PDFViewerApplication;

//     // Get the PDF.js viewer rendering queue object
//     var renderingQueue = pdfApplication.pdfRenderingQueue;

//     // Get the PDF.js viewer rendering queue ID
//     var queueId = pdfApplication.pdfDocument.loadingTask.taskId;

//     // Get the PDF.js viewer annotation layer renderer object
//     var annotationLayerRenderer = pdfApplication.pdfViewer.annotationLayer.renderer;

//     // Get all annotations from the PDF.js viewer
//     annotationLayerRenderer.getAnnotations().forEach(function(annotation) {

//       // Check if the annotation is a highlight
//       if (annotation.subtype === 'Highlight') {

//         // Get the text content of the highlight
//         var textContent = annotation.annotationText;

//         // Get the bounding rectangle of the highlight
//         var boundingRect = annotation.boundingBox;

//         // Convert the bounding rectangle to viewport coordinates
//         var viewport = pdfViewer.getPageView(annotation.page).viewport;
//         var viewportRect = pdfjsLib.Util.normalizeRect([
//           boundingRect[0],
//           viewport.height - boundingRect[3],
//           boundingRect[2],
//           viewport.height - boundingRect[1]
//         ]);

//         // Get the text in the highlight area
//         renderingQueue.getViewport(queueId, viewport).then(function(viewport) {
//           return pdfApplication.pdfDocument.getOperatorList(annotation.page, viewport).then(function(opList) {
//             var selectedText = pdfjsLib.Util.getHighlightedText(opList, viewportRect);
//             highlightedText.push(selectedText);
//           });
//         });
//       }
//     });

//     // Log the extracted text to the console
//     console.log(highlightedText);
//   });
// });

// const pdfUrl = './uploads/Project_requirements.pdf';
//     const loadingTask = pdfjsLib.getDocument(pdfUrl);

//     // Render the PDF file
//     loadingTask.promise.then(function(pdf) {
//       pdf.getPage(1).then(function(page) {
//         const canvas = document.getElementById('pdfCanvas');
//         const context = canvas.getContext('2d');
//         const viewport = page.getViewport({ scale: 1 });
//         canvas.height = viewport.height;
//         canvas.width = viewport.width;
//         page.render({ canvasContext: context, viewport: viewport }).promise.then(function() {
//           // Get highlighted text
//           const textLayerDiv = document.createElement('div');
//           textLayerDiv.className = 'textLayer';
//           canvas.parentNode.insertBefore(textLayerDiv, canvas.nextSibling);
//           const textLayer = new TextLayerBuilder({
//             textLayerDiv: textLayerDiv,
//             pageIndex: page.pageIndex,
//             viewport: viewport
//           });
//           textLayer.render(page).promise.then(function() {
//             const highlights = textLayer.query('div.highlight');
//             highlights.forEach(function(highlight) {
//               console.log(highlight.textContent);
//             });
//           });
//         });
//       });
//     });


fetch('/data')
.then(response => response.json())
.then(data => {
  let num = 1;
  let article = document.createElement("p");
  article.setAttribute("id", "text")
  article.setAttribute("class", "text")
  article.setAttribute("onMouseup", "getSelectionText();")
  let temp = document.getElementById("article")
  temp.appendChild(article);
  let header = document.createElement("h1")
  header.append("Article " + (num++).toString());
  article.append(header);
  for(let i = 0; i < data.length; i++) {
    if(data[i].length === 0){
      article.appendChild(document.createElement('br'))
      article.appendChild(document.createElement('br'))
    }
    if(data[i] === "END_OF_FILE"){
      let header1 = document.createElement("h1");
      header1.append("Article " + (num++).toString());
      article.append(header1);
    }else{
      article.append(data[i])
    }
    
  }
  console.log(data);

  // console.log(data[67].length); // log the retrieved string

})
.catch(error => {
  console.error(error);
});


// document.addEventListener("mouseup", function() {
//   var selection = window.getSelection();
//   if (selection.toString().length > 0) {
//     var range = selection.getRangeAt(0);
//     var newNode = document.createElement("span");
//     newNode.setAttribute("class", "highlight");
//     range.surroundContents(newNode);
//   }
// });

var highlights = [];
document.getElementById("article").addEventListener("mouseup", function() {
  var selection = window.getSelection().toString();
  if(selection !== '') {
    var range = window.getSelection().getRangeAt(0);
    var newNode = document.createElement('mark');
    range.surroundContents(newNode);
    highlights.push(selection);
    console.log("hi");
    document.getElementById("sentiment").innerHTML = selection
    document.getElementById("highlight").append(selection + "(sep)");
    var popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = '<p>Was it politically left or right biased?</p>';
    var leftButton = document.createElement('button');
    leftButton.innerHTML = 'Left';
    var rightButton = document.createElement('button');
    rightButton.innerHTML = 'Right';
    popup.appendChild(leftButton);
    popup.appendChild(rightButton);

    // get bounding rectangle of selection
    var rect = range.getBoundingClientRect();

    // set popup position
    popup.style.top = rect.top - popup.offsetHeight - 10 + 'px';
    popup.style.left = rect.left + rect.width/2 - popup.offsetWidth/2 + 'px';
    document.body.appendChild(popup);

    // remove popup when button is clicked
    leftButton.addEventListener('click', function() {
      document.body.removeChild(popup);
      console.log('Left button clicked');
      console.log(highlights);
      document.getElementById("wing").append("Left ");
    });
    rightButton.addEventListener('click', function() {
      document.body.removeChild(popup);
      console.log('Right button clicked');
      console.log(highlights);
      document.getElementById("wing").append("Right ");
    });
  }
});

var clearButton = document.getElementById("clearButton");
clearButton.addEventListener("click", function() {
  document.getElementById("highlight").innerHTML = "";
  document.getElementById("wing").innerHTML = "";
  // var markedElements = document.getElementsByTagName("mark");
  // for (var i = markedElements.length - 1; i >= 0; i--) {
  //   var textNode = markedElements[i].firstChild;
  //   console.log(textNode);
  //   markedElements[i].parentNode.insertBefore(textNode, markedElements[i]);
  //   markedElements[i].parentNode.removeChild(markedElements[i]);
  // }
  const marks = document.getElementsByTagName("mark");
  while (marks.length) {
    const parent = marks[0].parentNode;
    parent.replaceChild(document.createTextNode(marks[0].textContent), marks[0]);
  }
  highlights = [];
  console.log(highlights);
});



// fetch('/sentiment_score')
// .then(response => response.json())
// .then(data => {
//   console.log(data);
// })
// async function fetchScore() {
//   const response = await fetch('/sentiment_score');
//   const score = await response.json();
//   return score;
// }

// fetchScore().then(score => {
//   console.log(score);
// })

const form = document.getElementById('myForm');
form.addEventListener('submit', function(event) {
  event.preventDefault(); // prevent the form from submitting normally

  const formData = new FormData(form);
  fetch('/sentiment_score', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById('p-score').innerHTML = data.score;
      console.log(data.score);
    })
    .catch(error => {
      console.error(error);
    });
});