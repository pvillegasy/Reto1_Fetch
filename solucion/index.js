// List all user posts with ID = 1
// https://jsonplaceholder.typicode.com/posts?userId=1
const getAllPosts = () => {
  fetch("https://jsonplaceholder.typicode.com/posts?userId=1")
    .then(r => r.json())
    .then(response => renderUserPosts(response))
    .catch(console.error);
};

const getPost = id => {
  fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then(r => r.json())
    .then(response => renderPost(response))
    .catch(console.error);
};

function renderPost(post) {
  const html = `
    <a href="">< Volver al listado</a>
    <h1>${post.title}</h1>
    <h5>ID del usuario: ${post.userId}</h5>
    <h5>ID del post: ${post.id}</h5>
    <br/>
    <p>${post.body}</p>
  `;

  document.getElementById("app").innerHTML = html;
}

const renderUserPosts = posts => {
  let list = "";
  posts.map((item, index) => {
    return (list += `<li>
      <a id="${item.id}" class="item" href="">
      ${item.title}</a>
    </li>`);
  });

  document.getElementById("app").innerHTML = `
    <h1>List all posts from userId 1</h1>
    <ul>${list}</ul>
  `;

  document.querySelectorAll(".item").forEach(function(el) {
    el.addEventListener("click", function(e) {
      e.preventDefault();
      getPost(e.target.id);
    });
  });
};

getAllPosts();
