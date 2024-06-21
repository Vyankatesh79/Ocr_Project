//  *************************   this is for the download button count    ****************************
document.addEventListener('DOMContentLoaded', () => {
    const dragAndDropArea = document.querySelector('.drag-and-drop');
    const fileInput = document.querySelector('.file-input');
    const fileListElement = document.querySelector('.file-list');
    const instructions = dragAndDropArea.querySelector('p');
    const fileCountSpan = document.querySelector('.file-count');

    // ************ this for the scrolling event *******************
    const fileContainer = document.querySelector('.file-container');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');
    // ****************** this is for download event *********************
    const downloadForm = document.getElementById('downloadForm');
    
    // ************************** left arrow and right arrow *******************************************
    leftArrow.addEventListener('click', function () {
        fileContainer.scrollBy({ left: -200, behavior: 'smooth' }); // Adjust scroll amount as needed
    });

    rightArrow.addEventListener('click', function () {
        fileContainer.scrollBy({ left: 200, behavior: 'smooth' }); // Adjust scroll amount as needed
    });
    // **************************** this is code for selected the file and language *************************************************************
    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        var languageSelect = document.getElementById('language');
        var fileInput = document.getElementById('fileInput');
        var languageError = document.getElementById('languageError');
        var fileError = document.getElementById('fileError');
        var valid = true;
    
        // Check if a language is selected
        if (languageSelect.value === '') {
            languageError.style.display = 'block';
            valid = false;
        } else {
            languageError.style.display = 'none';
        }
    
        // Check if a file is uploaded
        if (fileInput.files.length === 0) {
            fileError.style.display = 'block';
            valid = false;
        } else {
            fileError.style.display = 'none';
        }
    
        // Prevent form submission if validation fails
        if (!valid) {
            event.preventDefault();
        }
    });
// ********************  this is js code for download ********************************************************************
    downloadForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        // Show the loading screen
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'block';
    
        const formData = new FormData(downloadForm);
    
        fetch(downloadForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to download file.');
            }
        }).then(data => {
            if (data.success) {
                data.download_urls.forEach(url => {
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = url.split('/').pop();
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
                // Hide the loading screen after successful download
                loadingScreen.style.display = 'none';
            } else {
                console.error('Errors:', data.errors);
                alert('An error occurred.');
                // Hide the loading screen if there's an error
                loadingScreen.style.display = 'none';
            }
        }).catch(error => {
            console.error('Error:', error);
            alert('An error occurred.');
            // Hide the loading screen if there's an error
            loadingScreen.style.display = 'none';
        });
    });
// *******************************************************************************************************

dragAndDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragAndDropArea.style.borderColor = '#007BFF';
});

dragAndDropArea.addEventListener('dragleave', () => {
    dragAndDropArea.style.borderColor = '#060505';
});

dragAndDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dragAndDropArea.style.borderColor = '#060505';
    const files = event.dataTransfer.files;
    handleFiles(files);
});
// *************************** this is function for file input file  **************************************************
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    handleFiles(files);
});
// ****************************************** this function for the file handle and show the count ***************************************
function handleFiles(files) {
    clearPreviousFiles();

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const listItem = document.createElement('li');

        // Create an image preview if the file is an image
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onload = () => URL.revokeObjectURL(img.src); // Free up memory
        listItem.appendChild(img);

        // Create a div for the file name
        const fileName = document.createElement('div');
        fileName.className = 'file-name';
        fileName.textContent = file.name;
        listItem.appendChild(fileName);

        fileListElement.appendChild(listItem);
    }

    updateFileCount(files.length);

    if (files.length > 0) {
        instructions.style.display = 'none';
    } else {
        instructions.style.display = 'block';
    }
}

function clearPreviousFiles() {
    while (fileListElement.firstChild) {
        fileListElement.removeChild(fileListElement.firstChild);
    }
    updateFileCount(0);
    instructions.style.display = 'block';
}

function updateFileCount(count) {
    fileCountSpan.textContent = `${count}`;
    // console.log(fileCountSpan);
}

window.uploadFile = function () {
    fileInput.click();
    fileInput.onchange = function () {
        const files = fileInput.files;
        handleFiles(files);
    };
};

window.clearQueue = function () {
    fileInput.value = '';
    clearPreviousFiles();
};
});
// ********************************* this fuction is show file*******************************************************************
function showFiles(input) {
    const fileList = document.querySelector('.file-list');
    fileList.innerHTML = '';
    for (let i = 0; i < input.files.length; i++) {
        const li = document.createElement('li');
        li.textContent = input.files[i].name;
        fileList.appendChild(li);
    }
}
// *********************************** this is for scan button function *************************************************************************
const scanButton = document.getElementById('scanButton');
scanButton.addEventListener('click', (event) => {
    // Prevent the default form submission
    event.preventDefault();

    const loadingScreen = document.getElementById('loading-screen-OCR');
    const readyMessage = document.getElementById('ready-message'); // Element to display the "file is ready" message
    loadingScreen.style.display = 'block';
    readyMessage.style.display = 'none'; // Hide the ready message initially

    const formData = new FormData(uploadForm);

    fetch(uploadForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => {
        if (response.ok) {
            // Add a delay before hiding the loading screen
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                readyMessage.style.display = 'block'; // Show the ready message
            }, 4000); // Hide loading screen and show ready message after 4 seconds
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while uploading the file. Please try again.');
        loadingScreen.style.display = 'none';
    });
});

//  ***********************  pop msg for when file is download ********************************

const popupMessage = document.getElementById('popup-message');
const closePopupButton = document.getElementById('close-popup');

scanButton.addEventListener('click', (event) => {
    // Prevent the default form submission
    event.preventDefault();

    const loadingScreen = document.getElementById('loading-screen-OCR');
    loadingScreen.style.display = 'block';

    const formData = new FormData(uploadForm);

    fetch(uploadForm.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        }
    })
    .then(response => {
        if (response.ok) {
            // Add a delay before hiding the loading screen
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                popupMessage.classList.remove('hidden');
            }, 4000); // Hide loading screen after 4 seconds
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while uploading the file. Please try again.');
        loadingScreen.style.display = 'none';
    });
});

closePopupButton.addEventListener('click', () => {
    popupMessage.classList.add('hidden');
});

    
// ************************************************************************************************************
// document.addEventListener('DOMContentLoaded', () => {
//     const fileInput = document.querySelector('.file-input');
//     const fileListElement = document.querySelector('.file-list');
//     const instructions = document.querySelector('.drag-and-drop p');
//     const fileCountSpan = document.querySelector('.file-count');

//     function handleFiles(files) {
//         clearPreviousFiles();

//         for (let i = 0; i < files.length; i++) {
//             const file = files[i];
//             const listItem = document.createElement('li');

//             // Create an image preview if the file is an image
//             const img = document.createElement('img');
//             img.src = URL.createObjectURL(file);
//             img.onload = () => URL.revokeObjectURL(img.src); // Free up memory
//             listItem.appendChild(img);

//             // Create a div for the file name
//             const fileName = document.createElement('div');
//             fileName.className = 'file-name';
//             fileName.textContent = file.name;
//             listItem.appendChild(fileName);

//             fileListElement.appendChild(listItem);
//         }

//         updateFileCount(files.length);

//         if (files.length > 0) {
//             instructions.style.display = 'none';
//         } else {
//             instructions.style.display = 'block';
//         }
//     }

//     function clearPreviousFiles() {
//         while (fileListElement.firstChild) {
//             fileListElement.removeChild(fileListElement.firstChild);
//         }
//         updateFileCount(0);
//         instructions.style.display = 'block';
//     }

//     function updateFileCount(count) {
//         fileCountSpan.textContent = `${count}`;
//     }

//     fileInput.addEventListener('change', (event) => {
//         const files = event.target.files;
//         handleFiles(files);
//     });

//     const dragAndDropArea = document.querySelector('.drag-and-drop');



//     dragAndDropArea.addEventListener('dragover', (event) => {
//         event.preventDefault();
//         dragAndDropArea.style.borderColor = '#007BFF';
//     });

//     dragAndDropArea.addEventListener('dragleave', () => {
//         dragAndDropArea.style.borderColor = '#060505';
//     });

//     dragAndDropArea.addEventListener('drop', (event) => {
//         event.preventDefault();
//         dragAndDropArea.style.borderColor = '#060505';
//         const files = event.dataTransfer.files;
//         handleFiles(files);
//     });
// });
