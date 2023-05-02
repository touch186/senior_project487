
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

})
.catch(error => {
  console.error(error);
});


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

  const marks = document.getElementsByTagName("mark");
  while (marks.length) {
    const parent = marks[0].parentNode;
    parent.replaceChild(document.createTextNode(marks[0].textContent), marks[0]);
  }
  highlights = [];
  console.log(highlights);
});


const form = document.getElementById('myForm');
form.addEventListener('submit', function(event) {
  event.preventDefault();

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
