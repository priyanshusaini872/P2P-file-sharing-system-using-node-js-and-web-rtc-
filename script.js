
const socket = io();
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('fileInput');
const sendBtn = document.getElementById('sendBtn');
const progressBar = document.getElementById('progressBar');
const chatInput = document.getElementById('chatInput');
const sendMsgBtn = document.getElementById('sendMsgBtn');
const chatBox = document.getElementById('chatBox');
const downloadSection = document.getElementById('downloadSection');
const downloadLink = document.getElementById('downloadLink');

let selectedFile = null;

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.style.borderColor = 'green';
});

dropZone.addEventListener('dragleave', () => {
  dropZone.style.borderColor = '#007bff';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  selectedFile = e.dataTransfer.files[0];
  dropZone.textContent = selectedFile.name;
});

fileInput.addEventListener('change', () => {
  selectedFile = fileInput.files[0];
  dropZone.textContent = selectedFile.name;
});

sendBtn.addEventListener('click', () => {
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('file', {
        fileName: selectedFile.name,
        fileData: reader.result
      });
      progressBar.value = 100;
    };
    reader.readAsArrayBuffer(selectedFile);
  }
});

socket.on('file', (data) => {
  const blob = new Blob([data.fileData]);
  const url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = data.fileName;
  downloadLink.textContent = "📥 " + data.fileName;
  downloadSection.classList.remove('hidden');
});

sendMsgBtn.addEventListener('click', () => {
  const msg = chatInput.value.trim();
  if (msg) {
    socket.emit('chat', msg);
    chatInput.value = "";
  }
});

socket.on('chat', (msg) => {
  const p = document.createElement('p');
  p.textContent = msg;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
});
