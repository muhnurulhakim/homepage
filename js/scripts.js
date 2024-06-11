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

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const resultDiv = document.getElementById('form-result');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    fetch('https://hook.eu2.make.com/yd69n10993422m0itz8r1zihc3geftm2', {
      method: 'POST',
      body: JSON.stringify(jsonData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        resultDiv.innerHTML = '<p>Pesan sudah dikirim...</p>';
        resultDiv.style.color = 'green';
        form.reset();
      } else {
        resultDiv.innerHTML = '<p>Terjadi kesalahan, coba lagi.</p>';
        resultDiv.style.color = 'red';
      }
    })
    .catch(error => {
      resultDiv.innerHTML = '<p>Terjadi kesalahan, coba lagi.</p>';
      resultDiv.style.color = 'red';
    });
  });
});

function listMarkdownFiles(folder, elementId, isPortofolio = false) {
  fetch(`${folder}/index.json`)
    .then(response => response.json())
    .then(files => {
      const container = document.getElementById(elementId);
      files.forEach(file => {
        const item = document.createElement('div');
        item.classList.add(isPortofolio ? 'card' : 'list-item');

        // Menambahkan event listener untuk membuat kotak preview portofolio menjadi klik-able
        if (isPortofolio || file.image) {
          item.addEventListener('click', function() {
            window.location.href = `template.html?folder=${folder}&file=${file.name}`;
          });
        }

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

        // Hapus link "Baca Selengkapnya" dan ganti dengan kotak preview portofolio yang bisa di-klik
        // const link = document.createElement('a');
        // link.href = `template.html?folder=${folder}&file=${file.name}`;
        // link.textContent = 'Baca Selengkapnya';
        // item.appendChild(link);

        container.appendChild(item);
      });
    });
}
