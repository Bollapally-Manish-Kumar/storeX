const backendURL = 'https://storex-qmum.onrender.com/api/files';

// Show loading spinner
function showSpinner() {
  document.getElementById('spinner').style.display = 'flex';
}

// Hide loading spinner
function hideSpinner() {
  document.getElementById('spinner').style.display = 'none';
}

// Show toast notifications
function showToast(message, type = 'success') {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "center",
    style: {
      background: type === 'success' ? "#4caf50" : "#e53935",
      color: "#fff",
      borderRadius: "10px",
      fontSize: "16px"
    }
  }).showToast();
}

// Upload form handler
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData();
  formData.append('filename', form.filename.value);
  formData.append('accessCode', form.accessCode.value);
  formData.append('tags', form.tags.value);
  formData.append('file', form.file.files[0]);

  try {
    showSpinner();
    const response = await fetch(`${backendURL}/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (response.ok) {
      showToast(data.message, 'success');
      form.reset();
    } else {
      showToast(data.message || 'Error uploading file', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Error uploading file', 'error');
  } finally {
    hideSpinner();
  }
});

// Access form handler
document.getElementById('accessForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = {
    filename: form.filename.value,
    accessCode: form.accessCode.value
  };

  try {
    showSpinner();
    const response = await fetch(`${backendURL}/access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (response.ok && data.url) {
      window.open(data.url, '_blank');
      showToast('Media accessed successfully!', 'success');
      form.reset();
    } else {
      showToast(data.message || 'Error accessing file', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Error accessing file', 'error');
  } finally {
    hideSpinner();
  }
});

// Delete form handler
document.getElementById('deleteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = {
    filename: form.filename.value,
    accessCode: form.accessCode.value
  };

  try {
    showSpinner();
    const response = await fetch(`${backendURL}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    if (response.ok) {
      showToast(data.message, 'success');
      form.reset();
    } else {
      showToast(data.message || 'Error deleting file', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Error deleting file', 'error');
  } finally {
    hideSpinner();
  }
});

// Parallax tilt animation for forms
VanillaTilt.init(document.querySelectorAll("form"), {
  max: 10,
  speed: 400,
  glare: true,
  "max-glare": 0.3,
});
