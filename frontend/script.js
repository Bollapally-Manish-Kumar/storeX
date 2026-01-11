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
    duration: 4000,
    gravity: "top",
    position: "center",
    style: {
      background: type === 'success'
        ? "linear-gradient(135deg, #059669, #10b981)"
        : "linear-gradient(135deg, #dc2626, #ef4444)",
      color: "#fff",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "500",
      padding: "14px 24px",
      boxShadow: type === 'success'
        ? "0 10px 30px rgba(16, 185, 129, 0.3)"
        : "0 10px 30px rgba(239, 68, 68, 0.3)"
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
      // Reset file input display
      const dropText = document.querySelector('.drop-text');
      if (dropText) dropText.innerHTML = 'Drop your file here or <span>browse</span>';
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

// File input display update
const fileInput = document.getElementById('fileInput');
if (fileInput) {
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const dropText = document.querySelector('.drop-text');
    if (file && dropText) {
      const fileName = file.name.length > 30
        ? file.name.substring(0, 27) + '...'
        : file.name;
      const fileSize = (file.size / (1024 * 1024)).toFixed(2);
      dropText.innerHTML = `<strong>${fileName}</strong> (${fileSize} MB)`;
    }
  });
}

// Parallax tilt animation for form cards
VanillaTilt.init(document.querySelectorAll(".form-card, .step-card"), {
  max: 5,
  speed: 400,
  glare: true,
  "max-glare": 0.1,
  perspective: 1000,
});

// Scroll reveal animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add reveal animation to elements
document.querySelectorAll('.form-card, .step-card, .section-title').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// Add revealed class styles
const style = document.createElement('style');
style.textContent = `
  .revealed {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

console.log('🚀 StoreX Premium UI Loaded');
