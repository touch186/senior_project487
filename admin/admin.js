

function deleteFile(fileName) {
  console.log("KASJDF;KLDJAF;LKSJALKFDJ;ALKJFDLKASJFDL;KADJFKAL;F")
  console.log(fileName);
  const url = `/deleteFile/${fileName}`;

  fetch(url, {
    method: 'DELETE',
  })

    console.log(`File ${fileName} deleted successfully`);
    const deleteBtn = document.getElementById(fileName);

    if (deleteBtn) {
      // Do something with the button
      console.log('Button found:', deleteBtn);
    } else {
      console.log('Button not found');
    }
    alert("File deleted");
    deleteBtn.remove();
    window.location.reload();
    

}

// const exportButton = document.getElementById('export-button');
// exportButton.addEventListener('click', function() {
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', '/export');
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.responseType = 'blob';
//   xhr.onload = function() {
//     const url = window.URL.createObjectURL(xhr.response);
//     const a = document.createElement('a');
//     a.href = url;
//     // a.download = 'data.csv';
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };
//   xhr.send();
// });

fetch('/file_names')
.then(response => response.json())
.then(data => {
  console.log(data);
  data.forEach(file => {
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = `Delete ${file}`;
    deleteBtn.setAttribute('id', file)
    deleteBtn.addEventListener('click', () => {
      deleteFile(file);
    });
    var deleteBtnsContainer = document.getElementById("delete-buttons-container");
    deleteBtnsContainer.appendChild(deleteBtn);
  });
})
.catch(error => {
  console.error(error);
});


// fetch('/export')
// .then(response => response.json())
// .then(data => {
//   if(data === "success"){
//     location.href = "https://storage.cloud.google.com/csv_download1/data.csv?authuser=2"
//   }
// })