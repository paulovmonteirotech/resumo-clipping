// Lista de posts (adicione manualmente)
const posts = [
      {
    title: "Resumo Clipping 10/11/2025",
    date: "09/11/2025",
    file: "10_11_2025.md",
    summary: "Mais um exemplo, para testar a navegação e layout."
  },
  {
    title: "Resumo Clipping 06/11/2025",
    date: "10/11/2025",
    file: "06_11_2025.md",
    summary: "Um post de exemplo mostrando como funciona o blog."
  },

];

const container = document.getElementById("posts-container");

if (container) {
  posts.forEach(post => {
    const card = document.createElement("div");
    card.classList.add("post-card");
    card.innerHTML = `
      <h2><a href="post.html?file=${post.file}">${post.title}</a></h2>
     
      <!-- <p><small>${post.date}</small></p>
      <p>${post.summary}</p> -->
    
      `;
    container.appendChild(card);
  });
}
