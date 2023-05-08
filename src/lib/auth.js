import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

import { auth } from './index.js';

/*
la función loginEmail se utiliza para manejar el inicio de sesión de un usuario utilizando
 correo electrónico y contraseña. Captura posibles errores durante el proceso de inicio de sesión y
 muestra mensajes de error específicos en elementos del DOM proporcionados.
*/
export const loginEmail = (email, password, errorEmail, errorPassword) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {

    })
    .catch((error) => {
      if (error.code === 'auth/wrong-password') {
        errorPassword.innerHTML = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        errorEmail.innerHTML = 'Correo inválido';
      } else if (error.code === 'auth/user-not-found') {
        errorEmail.innerHTML = 'Usuario no encontrado';
      } else if (error.code) {
        errorPassword.innerHTML = 'Algo salió mal';
      }
    });
};

/* La función userRegister se utiliza para manejar el registro de un nuevo usuario en un sistema
utilizando correo electrónico y contraseña. Captura posibles errores durante el proceso de registro
y muestra mensajes de error específicos en elementos del DOM proporcionados. */
export const userRegister = (email, password, errorEmail, errorPassword) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {

    })
    .catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        errorEmail.innerHTML = 'Usuario ya registrado';
      } else if (error.code === 'auth/invalid-email') {
        errorEmail.innerHTML = 'Correo inválido';
      } else if (error.code === 'auth/weak-password') {
        errorPassword.innerHTML = 'Contraseña demasiado débil';
      } else if (error.code === 'auth/missing-password') {
        errorPassword.innerHTML = 'Contraseña requerida';
      } else if (error.code) {
        errorPassword.innerHTML = 'Algo salió mal';
      }
    });
};

// Función cerrar sesión de usuario actual con auth desde index.js
export const exit = () => {
  signOut(auth).then(() => {

  }).catch(() => {

  });
};

/* Se define la instancia GoogleAuthProvider como proveedor de autenticación y proporciona la
función 'loginGoogle' para iniciar sesión con cuenta Google */

export const provider = new GoogleAuthProvider();
export const loginGoogle = () => {
  signInWithPopup(auth, provider)
    .then(() => {

    })
    .catch(() => {

    });
};
