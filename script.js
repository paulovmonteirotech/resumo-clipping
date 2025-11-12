let noticiasData = [];
const itemsPerPage = 15;
let currentPage = 1;
let filteredNews = [];

async function loadNoticias() {
    const response = await fetch('./posts/noticias.json'); // Caminho do JSON
    const data = await response.json();
    noticiasData = data.noticias;
    filteredNews = noticiasData;
    populateFilters();
    renderTable();
}

// Cria checkboxes para filtros
function populateFilters() {
    createCheckboxes('filter-date', [...new Set(noticiasData.map(n => n.data))]);
    createCheckboxes('filter-jornal', [...new Set(noticiasData.map(n => n.jornal))]);
    createCheckboxes('filter-temas', [...new Set(noticiasData.flatMap(n => n.temas_relacionados))]);
}

function createCheckboxes(containerId, values) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    values.forEach(v => {
        const label = document.createElement('label');
        label.style.display = 'block';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = v;
        checkbox.addEventListener('change', applyFilters);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + v));
        container.appendChild(label);
    });
}

function applyFilters() {
    const selectedDates = getCheckedValues('filter-date');
    const selectedJornais = getCheckedValues('filter-jornal');
    const selectedTemas = getCheckedValues('filter-temas');

    filteredNews = noticiasData.filter(n => {
        const matchDate = selectedDates.length === 0 || selectedDates.includes(n.data);
        const matchJornal = selectedJornais.length === 0 || selectedJornais.includes(n.jornal);
        const matchTemas = selectedTemas.length === 0 || selectedTemas.some(t => n.temas_relacionados.includes(t));
        return matchDate && matchJornal && matchTemas;
    });

    currentPage = 1;
    renderTable();
}

function getCheckedValues(containerId) {
    return Array.from(document.querySelectorAll(`#${containerId} input:checked`)).map(cb => cb.value);
}

function renderTable() {
    const tbody = document.getElementById('news-table-body');
    tbody.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filteredNews.slice(start, end);

    pageItems.forEach(n => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${n.data}</td>
            <td>${n.jornal}</a></td>
            <td>${n.titulo}</td>
            <td>${n.temas_relacionados.join(', ')}</td>
            <td>${n.resumo}</td>
            <td> <a href=${n.link}> ${n.jornal}</a></td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('page-info').textContent = `Página ${currentPage} de ${Math.ceil(filteredNews.length / itemsPerPage)}`;
    document.getElementById('prev').disabled = currentPage === 1;
    document.getElementById('next').disabled = currentPage === Math.ceil(filteredNews.length / itemsPerPage);
}

document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentPage < Math.ceil(filteredNews.length / itemsPerPage)) {
        currentPage++;
        renderTable();
    }
});

// Dropdown toggle para filtros
document.querySelectorAll('.filter-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.parentElement;
        parent.classList.toggle('open');
    });
});


loadNoticias();
document.getElementById('search-title').addEventListener('input', applyFilters);

function applyFilters() {
    const selectedDates = getCheckedValues('filter-date');
    const selectedJornais = getCheckedValues('filter-jornal');
    const selectedTemas = getCheckedValues('filter-temas');
    const searchText = document.getElementById('search-title').value.toLowerCase();

    filteredNews = noticiasData.filter(n => {
        const matchDate = selectedDates.length === 0 || selectedDates.includes(n.data);
        const matchJornal = selectedJornais.length === 0 || selectedJornais.includes(n.jornal);
        const matchTemas = selectedTemas.length === 0 || selectedTemas.some(t => n.temas_relacionados.includes(t));
        
 // Busca em qualquer campo
        const matchSearch = searchText === '' || Object.values(n).some(value => {
            if (Array.isArray(value)) {
                return value.some(v => v.toLowerCase().includes(searchText));
            }
            return String(value).toLowerCase().includes(searchText);
        });

        return matchDate && matchJornal && matchTemas && matchSearch;
    });

    currentPage = 1;
    renderTable();
}
