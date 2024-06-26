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

        if (isPortofolio && file.narasi) {
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

  if (form) {
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
  }

  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });

    // Menambahkan event listener ke setiap item menu untuk mobile view
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function() {
  fetch('index.json')
    .then(response => response.json())
    .then(data => {
      const portfolioContainer = document.getElementById('daftar-portofolio');
      data.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.classList.add('portfolio-item');
        
        fetch(`${item.name}.md`)
          .then(response => response.text())
          .then(markdown => {
            // Render markdown to HTML
            const htmlContent = marked(markdown);
            
            // Create a temporary div to manipulate HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;

            // Add lazy loading to images
            const images = tempDiv.querySelectorAll('img');
            images.forEach(img => {
              img.setAttribute('loading', 'lazy');
            });

            // Add the content to the portfolio item
            portfolioItem.innerHTML = tempDiv.innerHTML;
            portfolioContainer.appendChild(portfolioItem);
          })
          .catch(error => console.error('Error loading markdown:', error));
      });
    })
    .catch(error => console.error('Error loading portfolio:', error));
});
