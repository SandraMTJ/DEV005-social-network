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

let editStatus = false; // Almacena el estado de edición del post
let id = ''; // Almacena el ID del post a editar
let postForm; // Hace referencia al form txtMascotiemos' edita el contenido del post

// Función que permite editar un post
/* se llama cuando se realice un evento determinado, y se pasa un evento como argumento */
export const editingPost = (event) => {
  getPost(event.target.dataset.id) // Obtiene el post del ID pasado como argumento
  /* Se encadena el método .then() a la promesa devuelta por la función getPost().
    El argumento de función de retorno (commentUser) representa el resultado de la
    promesa, que se asume que es un objeto que contiene información sobre el post y
    el usuario relacionado. */
    .then((commentUser) => {
      /* Se declara variable 'post' y se le asigna el valor de 'txtMascotiemos'
       del objeto commentUser.data(). 'txtMascotiemos' contiene el contenido del post */
      const post = commentUser.data().txtMascotiemos;
      /* Se asigna el valor de post al campo de texto txtMascotiemos del formulario postForm.
       Esto se hace para llenar el campo de texto con el contenido del post que se está editando */
      postForm.txtMascotiemos.value = post;
      /* Se establece la variable editStatus en true, indicando que se está en modo de edición. */
      editStatus = true;
      /* Asigna valor de 'data-id' desde el HTML que desencadena variable ID esto es para almacenar
       el identificador del post que se está editando */
      id = event.target.dataset.id;
    });
};
// Función que permite dar like a un post
/* La función se espera que se llame cuando se produzca un evento determinado, y se pasa un objeto
de evento como argumento. */
export const likePost = (event) => {
  /*  Se declara variable postId y se le asigna el valor del atributo data-id del elemento HTML que
  desencadenó el evento. Esto asume que el elemento HTML tiene un atributo de datos llamado data-id
  que contiene el identificador único del post al que se le dará "me gusta" o "no me gusta" */
  const postId = event.target.dataset.id;
  /* Se declara variable 'currentUserEmail' y se le asigna el email del usuario actualmente
  autenticado. Se establece objeto auth que tiene propiedad 'currentUser' que contiene información
  del usuario actual, incluido su email. */
  const currentUserEmail = auth.currentUser.email;
  /* Se invoca función 'getPost' pasando el ID del post y se encadena el método .then() para manejar
  la promesa devuelta. La función getPost obtiene el documento correspondiente al ID del post. */
  getPost(postId).then((doc) => {
    /* Se verifica si el documento existe utilizando la propiedad exists del objeto doc.
    Esto asegura que se haya encontrado un documento válido correspondiente al ID del post. */
    if (doc.exists) {
      /* Se declara variable data, se le asigna el contenido del documento utilizando el método
      data() del objeto doc. Esto asume que el documento contiene información del post,
       incluyendo los "me gusta" que ha recibido. */
      const data = doc.data();
      /* Se declara variable likes y se le asigna el valor del campo likes del objeto data, o un
      array vacío [] si el campo likes no existe en el objeto data. Esto se hace para asegurarse de
      que likes sea un array en caso de que no haya "me gusta" registrados previamente. */
      const likes = data.likes || [];
      /* Se verifica si el 'currentUserEmail' está incluido en el array likes utilizando el método
      includes(). Esto se hace para determinar si el usuario actual ha dado "like" al post o no. */
      if (likes.includes(currentUserEmail)) {
        /* Si el usuario actual da "like" al post, se llama función 'dislike' pasando el postId y
        el currentUserEmail. Esto se hace para eliminar el "like" del post. */
        dislike(postId, currentUserEmail);
      } else {
        /* Si el usuario actual no ha dado "me gusta" al post, se llama a la función like pasando
        el postId y el currentUserEmail. Esto se hace para agregar el "like" al post. */
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
        <textarea type="text" name="txtMascotiemos" class="txtMascotiemos" id="txtMascotiemos" rows="3" placeholder="Mascotiemos..." required></textarea>
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
  /* Se asigna a la variable postForm una referencia al elemento HTML con el id post-form.
  Esto asume que en el HTML hay un elemento con dicho id y se utiliza para agregar nuevos posts. */
  postForm = section.querySelector('#post-form');
  /* Llama elemento 'containerPost'  del HTML por medio del id */
  const postContainer = section.querySelector('#containerPost');
  /* Se declara función 'readPost' que toma parámetro posts. Esta función se utiliza para generar
   el HTML que mostrará los posts en la página. */
  const readPost = (posts) => {
    /* Se declara variable html e inicializa con una cadena vacía. Esta variable se utilizará para
     almacenar el HTML generado */
    let html = '';
    /* Se itera sobre los elementos del array posts utilizando el método forEach(). Dentro de cada
     iteración, se hace referencia a cada elemento como docs. */
    posts.forEach((docs) => {
      /* Se declara variable 'publication' y se le asigna valor de propiedad data del objeto docs.
      Esto asume que docs es un objeto que contiene información sobre el post. */
      const publication = docs.data;
      /* Se declara variable 'ownerId' y se le asigna el valor de la propiedad userId del objeto
      publication. Esto asume que publication contiene información sobre el propietario del post. */
      const ownerId = publication.userId;
      /* Se declara variable 'currentUser' y se le asigna valor del usuario actualmente autenticado.
      Esto asume que se ha establecido un objeto auth que tiene una propiedad currentUser que
      contiene la información del usuario actual. */
      const currentUser = auth.currentUser;
      /* Se verifica si el ownerId es igual al uid del usuario actual. Esto se hace para determinar
      si el post pertenece al usuario actualmente autenticado. */
      if (ownerId === currentUser.uid) {
        // Se agrega template string si es el usuario logueado
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
        // Sino es el usuario logueado se activa el siguiente
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
    // .trim() -> limpia espacios adicionales en blanco el valor
    const txtMascotiemos = postForm.txtMascotiemos.value.trim();
    /* Se verifica si variable editStatus es falsa; Si es así, significa que no hay
    un estado de edición activo y se ejecuta el código dentro de este bloque. */
    if (!editStatus) {
      /* Se llama a la función 'savePost' y se pasa 'txtMascotiemos' como argumento */
      savePost(txtMascotiemos);
      /* Si la condición anterior no se cumple (es decir, hay un estado de edición activo),
       se ejecuta el código dentro de este bloque. */
    } else {
      updatePost(id, {
        txtMascotiemos,
      });
      /* Se asigna el valor false a la variable 'editStatus', lo que indica que el estado
       de edición ha terminado. */
      editStatus = false;
      /* Se asigna una cadena vacía a la variable 'id', lo que indica que no hay ninguna
       ID de publicación asociada al estado de edición actual. */
      id = '';
    }
    /* Se restablece todos los campos del formulario a sus valores predeterminados, lo que
     limpia el textarea. */
    postForm.reset(); // Limpia el textarea
  });
  return section;
}
