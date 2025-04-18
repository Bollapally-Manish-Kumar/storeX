const backendURL = 'https://storex-qmum.onrender.com/api/files';

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData();
  formData.append('filename', form.filename.value);
  formData.append('accessCode', form.accessCode.value);
  formData.append('tags', form.tags.value);
  formData.append('file', form.file.files[0]);

  try {
    const response = await fetch(`${backendURL}/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert('Error uploading file');
  }
});

document.getElementById('accessForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = {
    filename: form.filename.value,
    accessCode: form.accessCode.value
  };

  try {
    const response = await fetch(`${backendURL}/access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || 'Error accessing file');
      return;
    }

    const data = await response.json();
    if (data.url) {
      window.open(data.url, '_blank');
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Error accessing file');
  }
});

document.getElementById('deleteForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const body = {
    filename: form.filename.value,
    accessCode: form.accessCode.value
  };

  try {
    const response = await fetch(`${backendURL}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    alert(data.message);
  } catch (err) {
    console.error(err);
    alert('Error deleting file');
  }
});
