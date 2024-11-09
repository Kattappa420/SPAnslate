
document.addEventListener("DOMContentLoaded", function () {
  const closeBtn = document.getElementById("closeBtn");
  const leftBox = document.getElementById("leftBox");
  const fileInput = document.getElementById("fileInput");

  // Function to display the uploaded file
  function displayFile(file) {
    const fileReader = new FileReader();

    // When the file is successfully read
    fileReader.onload = function (e) {
      // Create a PDF viewer (or use any other method based on file type)
      leftBox.innerHTML = `<embed src="${e.target.result}" type="application/pdf" width="100%" height="100%" />`;

      // Show the close button when a file is displayed
      closeBtn.style.display = "block";
    };

    // Read the file
    fileReader.readAsDataURL(file);  // Converts file to base64
  }

  // Handle file input change (when a user uploads a file)
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0]; // Get the first uploaded file

    if (file) {
      displayFile(file);
    }
  });

  // Function to close the file when the close button is clicked
  closeBtn.addEventListener("click", function () {
    // Clear the left box content
    leftBox.innerHTML = "";

    // Hide the close button
    closeBtn.style.display = "none";
  });
});


function updateButtonLabel() {
  const select = document.getElementById("languageSelect");
  const selectedLanguage = select.options[select.selectedIndex].text;
  select.style.background = selectedLanguage ? "#e0f7fa" : "#fff";
}

// Variables to hold the uploaded files
let uploadedFiles = [];
let currentFile = null;

document.getElementById("uploadBtn").addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".pdf";
  fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
          uploadedFiles.push(file);
          displayFile(file, "leftBox");
      }
  };
  fileInput.click();
});


document.getElementById("addFileBtn").addEventListener("click", () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".pdf";
  fileInput.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
          uploadedFiles.push(file);
          addFileToList(file, "extraFilesBox");
      }
  };
  fileInput.click();
});

function displayFile(file, containerId) {
  const reader = new FileReader();
  reader.onload = (e) => {
      const box = document.getElementById(containerId);
      box.innerHTML = `<embed src="${e.target.result}" type="application/pdf" width="100%" height="100%" style="min-height:500px;"/>`;
      currentFile = file;
      document.querySelector(".close-btn").style.display = "inline";
  };
  reader.readAsDataURL(file);
}

function addFileToList(file, containerId) {
  const extraFilesBox = document.getElementById(containerId);
  const fileItem = document.createElement("div");
  fileItem.textContent = file.name;
  fileItem.classList.add("file-item");
  fileItem.addEventListener("click", () => displayFile(file, "leftBox"));
  extraFilesBox.appendChild(fileItem);
}


document.getElementById("detectLanguageBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("fileUpload");
  const languagesDetected = document.getElementById("languagesDetected");

  if (uploadedFiles.length === 0) {
      alert("Please upload a file first.");
      return;
  }

  const formData = new FormData();
  formData.append("file", uploadedFiles[0]);

  try {
      const response = await fetch("API_URL_HERE", {
          method: "POST",
          body: formData,
      });

      if (!response.ok) throw new Error("Error detecting language");

      const data = await response.json();
      languagesDetected.textContent = data.languages.join(", ");
  } catch (error) {
      console.error("Error:", error);
      languagesDetected.textContent = "Could not detect language.";
  }
});
/*
document.getElementById("closeBtn").addEventListener("click", () => {
  const leftBox = document.getElementById("leftBox");
  leftBox.innerHTML = "";
  document.querySelector(".close-btn").style.display = "none";
});
*/

document.getElementById("detectLanguageBtn").addEventListener("click", async () => {
  if (!currentFile) {
    alert("No file selected for language detection.");
    return;
  }
  const languages = await detectLanguage(currentFile);
  document.getElementById("languagesDetected").innerText = languages.join(", ") || "None";
});

document.getElementById("closeBtn").addEventListener("click", () => {
  const leftBox = document.getElementById("leftBox");
  leftBox.innerHTML = ""; // Clear the content
  currentFile = null; // Clear the current file reference
  document.querySelector(".close-btn").style.display = "none"; // Hide the close button
});

function notifyUser(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.innerText = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

/*
document.getElementById("uploadBtn").addEventListener("click", () => {
  notifyUser("File uploaded successfully.");
});
*/

// Toggle dropdown visibility on click
function toggleDropdown() {
  const dropdownList = document.getElementById('dropdownList');
  dropdownList.style.display = dropdownList.style.display === 'none' ? 'block' : 'none';
}

// Filter languages based on search input
function filterLanguages() {
  const input = document.getElementById("dropdownSearch").value.toLowerCase();
  const options = document.querySelectorAll("#languageDropdown option");
  
  options.forEach(option => {
      const text = option.textContent.toLowerCase();
      option.style.display = text.includes(input) ? "block" : "none";
  });
}


// Update input box with the selected language
function selectLanguage() {
  const dropdown = document.getElementById('languageDropdown');
  const selectedText = dropdown.options[dropdown.selectedIndex].text;
  document.getElementById('dropdownSearch').value = selectedText; // Display selected language in the input box
  toggleDropdown(); // Close dropdown after selection
}

// Close dropdown if clicked outside
document.addEventListener('click', function(event) {
  const dropdownContainer = document.querySelector('.dropdown-container');
  if (!dropdownContainer.contains(event.target)) {
    document.getElementById('dropdownList').style.display = 'none';
  }
});




