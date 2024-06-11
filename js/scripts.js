function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return false;
}

function loadMarkdown(folder, file) {
  fetch(`${folder}/${file}.md`)
    .then(response => response.text())
    .then(text => {
      const converter = new showdown.Converter();
      const html = converter.makeHtml(text);
      document.getElementById('markdown-content').innerHTML = html;
    })
    .catch(error => {
      document.getElementById('markdown-content').innerHTML = "<p>File tidak ditemukan.</p>";
    });
}

function listMarkdownFiles(folder, elementId, isPortofolio = false) {
  fetch(`${folder}/index.json`)
    .then(response => response.json())
    .then(files => {
      const container = document.getElementById(elementId);
      files.forEach(file => {
        const item = document.createElement('div');
        item.classList.add(isPortofolio ? 'card' : 'list-item');

        if (isPortofolio || file.image) {
          const img = document.createElement('img');
          img.src = `images/${file.image}`;
          img.alt = file.title;
          item.appendChild(img);
        }

        const title = document.createElement('h3');
        title.textContent = file.title;
        item.appendChild(title);

        if (isPortofolio) {
          const narasi = document.createElement('p');
          narasi.textContent = file.narasi;
          item.appendChild(narasi);
        } else {
          fetch(`${folder}/${file.name}.md`)
            .then(response => response.text())
            .then(text => {
              const preview = document.createElement('p');
              preview.textContent = text.split('\n')[0]; // Mengambil paragraf pertama
              item.appendChild(preview);
            });
        }

        const link = document.createElement('a');
        link.href = `template.html?folder=${folder}&file=${file.name}`;
        link.textContent = 'Baca Selengkapnya';
        item.appendChild(link);

        container.appendChild(item);
      });
    });
}

const folder = getQueryVariable('folder');
const markdownFile = getQueryVariable('file');
if (folder && markdownFile) {
  loadMarkdown(folder, markdownFile);
} else {
  if (document.getElementById('daftar-blog')) {
    listMarkdownFiles('blog', 'daftar-blog');
  }
  if (document.getElementById('daftar-portofolio')) {
    listMarkdownFiles('portofolio', 'daftar-portofolio', true);
  }
}

document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const data = {
      nama: document.getElementById('nama').value,
      email: document.getElementById('email').value,
      pesan: document.getElementById('pesan').value
    };
    fetch('https://script.google.com/macros/s/AKfycbxmW_uryNS4PA-aYE87Ddjz9I1gFbLu5MqkCmKjxvfRvDeviD4QMYSLlqpw6fZY_Mii/exec', { // Ganti dengan URL Web App kamu
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        alert('Pesan berhasil dikirim!');
      } else {
        alert('Terjadi kesalahan, coba lagi.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Terjadi kesalahan, coba lagi.');
    });
  });
  