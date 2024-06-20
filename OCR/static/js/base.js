function toggleNavbar() {
    var navbar = document.querySelector('.nav-ul');
    if (navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    } else {
      navbar.classList.add('show');
    }
  }
  
  
  function displayFileName() {
    const fileInput = document.getElementById('fileInput');
    const fileName = document.getElementById('fileName');
    const fileDisplay = document.getElementById('fileDisplay');
  
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      fileName.textContent = file.name;
      fileDisplay.textContent = `Selected file: ${file.name}`;
    } else {
      fileName.textContent = 'No file chosen';
      fileDisplay.textContent = '';
    }
  }
  document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Show the loading screen
    document.getElementById('loading-screen').style.display = 'block';
    
    const formData = new FormData(this);
    
    fetch("", {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
      },
    })
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      // Simulate a delay for processing
      setTimeout(function() {
        document.querySelector('#loading-screen p').textContent = 'File upload in progress.... !';
    
        setTimeout(function() {
          window.location.href = "/Ocr/"; // Redirect to the target URL
        }, 4000); // Redirect after 4 seconds
      }, 1000); // Update text after 1 second
    
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  });
    