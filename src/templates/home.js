import {
  savePost,
  createSnapshot,
  deletePost,
  getPost,
  updatePost,
  auth,
  like,
  dislike,
} from '../lib/index.js';
import { exit } from '../lib/auth.js';

let editStatus = false;
let id = '';
let postForm;

// Función que permite editar un post
export const editingPost = (event) => {
  getPost(event.target.dataset.id)
    .then((commentUser) => {
      const post = commentUser.data().txtMascotiemos;
      postForm.txtMascotiemos.value = post;
      editStatus = true;
      id = event.target.dataset.id;
    });
};
// Función que permite dar like a un post
export const likePost = (event) => {
  const postId = event.target.dataset.id;
  const currentUserEmail = auth.currentUser.email;
  getPost(postId).then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      const likes = data.likes || [];
      if (likes.includes(currentUserEmail)) {
        dislike(postId, currentUserEmail);
      } else {
        like(postId, currentUserEmail);
      }
    }
  });
};

// Función que carga home
export function home() {
  const section = document.createElement('section');
  const htmlWelcome = `
  <main>
    <header class="containerLogoHome">
      <img class="imgLogoHome" src="img/logo.png" alt="logo">
      <h1>Bienvenida a Mascoteando</h1>
      <button name="logOut" id="logOut" class="logOut">Cerrar sesión</button>
    </header>
    <section class="containerForm">
      <form id="post-form" class="post-form">
        <textarea type="text" name="txtMascotiemos" class="txtMascotiemos" id="txtMascotiemos" rows="2" cols="1" maxlength="500" placeholder="Mascotiemos..." required></textarea>
        <button id="btnPost" class="btnPost"><img class="btnPostImg" src="./img/btnPublicar.png" alt="post"></img></button>
      </form>
      <div id ="containerPost" class ="containerPost"></div>
    </section>
  </main>`;

  section.innerHTML = htmlWelcome;

  // Función de cerrar sesión
  const btnLogOut = section.querySelector('#logOut');
  btnLogOut.addEventListener('click', () => {
    exit();
  });

  // Creación de post
  postForm = section.querySelector('#post-form');
  const postContainer = section.querySelector('#containerPost');
  const readPost = (posts) => {
    let html = '';
    posts.forEach((docs) => {
      const publication = docs.data;
      const ownerId = publication.userId;
      const currentUser = auth.currentUser;
      if (ownerId === currentUser.uid) {
        html += `
        <section class="containerMain">
          <p id="textPost" class="textPost">${publication.txtMascotiemos}</p>
          <div class="containerButtons">
            <button id="btnDelete"  class="btnDelete" data-id="${docs.id}">🗑️</button>
            <button id="btnEdit" class="btnEdit" data-id="${docs.id}">✍️</button>
            <button id="btnLike" class="btnLike" data-id="${docs.id}">🐾</button>
            <span class="count">${publication.likes.length || ''}</span>
          </div>
        </section>
        `;
      } else {
        html += `
        <section class="containerMain">
          <p id="textPost" class="textPost">${publication.txtMascotiemos}</p>
          <div class="containerButtons">
            <button id="btnLike" class="btnLike" data-id="${docs.id}">🐾</button>
            <span class="count">${publication.likes.length || ''}</span>
          </div>
        </section>
        `;
      }
    });
    html += `
      <section class="modal">
        <div class="containerModal">
          <span class="modalTitle">¿Desea eliminar el post?</span>
          <div class="containerBtnsModal">
            <button id="btnCancel" class="btnCancel"> Cancelar </button>
            <button id="btnConfirm" class="btnConfirm"> Confirmar </button>
          </div>
        </div>
      </section>`;
    postContainer.innerHTML = html;

    // Creación de modal de Cancelar y eliminar
    const modal = postContainer.querySelector('.modal');
    const modalDelete = () => {
      const btnsDelete = postContainer.querySelectorAll('.btnDelete');
      const btnConfirm = postContainer.querySelector('.btnConfirm');
      const btnCancel = postContainer.querySelector('.btnCancel');
      btnsDelete.forEach((btnDelete) => {
        btnDelete.addEventListener('click', (event) => {
          const postId = event.target.dataset.id;
          modal.classList.add('modal--show');
          btnConfirm.addEventListener('click', () => {
            deletePost(postId);
            modal.classList.remove('modal--show');
          });
          btnCancel.addEventListener('click', () => {
            modal.classList.remove('modal--show');
          });
        });
      });
    };
    modalDelete(section);

    // Botón para editar post y llamar la función que edita el post
    const btnsEdit = postContainer.querySelectorAll('.btnEdit');
    btnsEdit.forEach((btn) => {
      btn.addEventListener('click', editingPost);
    });

    // Boton para dar like a post y llamar la función que permite dar like
    const btnsLike = postContainer.querySelectorAll('.btnLike');
    btnsLike.forEach((btn) => {
      btn.addEventListener('click', likePost);
    });
  };

  // Función de actualizar en tiempo real (onSnapShot) que se llama desde index.js
  createSnapshot(readPost);
  postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const txtMascotiemos = postForm.txtMascotiemos.value.trim();
    if (!editStatus) {
      savePost(txtMascotiemos);
    } else {
      updatePost(id, {
        txtMascotiemos,
      });
      editStatus = false;
      id = '';
    }
    postForm.reset(); // Limpia el textarea
  });
  return section;
}
