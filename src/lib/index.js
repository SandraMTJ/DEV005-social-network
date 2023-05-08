import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  getDoc,
  query,
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

// Conexión con Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDtRQY-ggHLO4343_IXaN6dDpsYA9nQhhA',
  authDomain: 'mascoteando-fcfad.firebaseapp.com',
  databaseURL: 'https://mascoteando-fcfad-default-rtdb.firebaseio.com',
  projectId: 'mascoteando-fcfad',
  storageBucket: 'mascoteando-fcfad.appspot.com',
  messagingSenderId: '1072708099174',
  appId: '1:1072708099174:web:efebbf77616881bbb861a7',
  measurementId: 'G-JM74KS7VQM',
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);

// Configurando auth para autenticación función 'getAuth' y se pasa argumento 'app'
export const auth = getAuth(app);

// Configurando Base de datos firestore
export const db = getFirestore();

/* Función 'savePost' para guardar publicación en Base de datos toma cómo parametro txtMascotiemos
que representa contenido de la publicación, Utiliza función 'addDoc' para agregar un documento a
colección 'post' en BD con campos 'txtMascotiemos', 'auth'(email de usuario actualmente autenticado)
y 'userId' (ID del usuario actualmente autenticado),Se inicia el arreglo de 'likes' vacío */
export const savePost = (txtMascotiemos) => addDoc(collection(db, 'posts'), {
  txtMascotiemos,
  auth: auth.currentUser.email,
  userId: auth.currentUser.uid,
  likes: [],
});

/* Se obtienen publicaciones de BD con función 'getPost'y con 'getDocs' obtiene documentos de la
colección 'post' de la BD */
export const getPosts = () => getDocs(collection(db, 'posts'));

/* Se define función 'createSnapshot' que recibe función callback (result) y crea un snapshot
en tiempo real utilizando la función onSnapshot. El snapshot se obtiene ejecutando una consulta
(query) en la colección "posts". Cuando se recibe un cambio en los documentos de la colección,
se construye una lista (dataList) que contiene los datos y el ID de cada documento. Luego, se
llama a la función callback result con la lista de datos. */

const evec = collection(db, 'posts');
const q = query(evec);

export const createSnapshot = (result) => {
  const onGetPost = onSnapshot(q, (s) => {
    const dataList = [];
    s.forEach((docs) => {
      dataList.push({
        data: docs.data(),
        id: docs.id,
      });
    });
    result(dataList);
  });
  return onGetPost;
};

/* Función 'deletePost' recibe ID y elimina publicación de la BD, 'deleteDoc' elimina el documento
 que corresponde al ID de la colección 'post' */
export const deletePost = (id) => deleteDoc(doc(db, 'posts', id));

/* Función 'getPost' que recibe un ID y se utiliza para obtener una publicación específica de la BD.
Usa la función getDoc para obtener el documento correspondiente al ID de la colección "posts" */
export const getPost = (id) => getDoc(doc(db, 'posts', id));

/* Función 'updatePost' que recibe un ID y un objeto 'newFields' que contiene los nuevos campos y
valores que se deben actualizar en la publicación. Usa la función 'updateDoc' para actualizar el
documento del ID proporcionado en la colección "posts" con los nuevos campos y valores */
export const updatePost = (id, newFields) => updateDoc(doc(db, 'posts', id), newFields);

/* Funciones 'like' para agregar y 'dislike' eliminar ID de usuario en BD, utiliza funciones
 arrayUnion y arrayRemove de Firebase Firestore */
export const like = (id, userId) => updateDoc(doc(db, 'posts', id), {
  likes: arrayUnion(userId),
});

export const dislike = (id, userId) => updateDoc(doc(db, 'posts', id), {
  likes: arrayRemove(userId),
});
