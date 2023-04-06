fetch('/get-files?folder=uploads')
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
  }
  })
  .catch(error => {
    console.error(error);
  });


fetch('/get-files?folder=uploads')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to get file list');
    }
    return response.json();
  })
  .then(files => {
    files.forEach(file => {
      const deleteBtn = document.createElement('button');
      deleteBtn.innerText = `Delete ${file}`;
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

function deleteFile(fileName) {
  const url = `/deleteFile/${fileName}`;

  fetch(url, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      console.log(`File ${fileName} deleted successfully`);
      const deleteBtn = document.querySelector(`button[data-file="${fileName}"]`);
      alert("File deleted");
      window.location.reload();
      deleteBtn.remove();
    })
    .catch(error => {
      console.error(error);
    });
}