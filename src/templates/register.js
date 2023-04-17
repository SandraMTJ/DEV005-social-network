import { userRegister } from '../lib/auth.js';

const registerFirebase = (email, password, errorEmail, errorPassword) => {
  const registerPrevent = (e) => {
    e.preventDefault();
    userRegister(email.value, password.value, errorEmail, errorPassword);
  };
  return registerPrevent;
};

export function register(navigation) {
  const section = document.createElement('section');
  const htmlRegister = `
  <div class='contenedor'>
    <div class="contenedorLogo">
      <img class="imgLogo" src="img/logo.png" alt="logo">
    </div>
    <main>
    <div class="contenedorIngresoRegistro">
      <span class="registroTitulo">Registro</span>
      <form class="contenedorInput">
        <label>
        <span>Nombre completo</span>
        <input type="text" name="nombreUsuario" class="nombreUsuario" id="nombreUsuario">
        </label>
        <label>
            <span>Nombre de tu Mascota</span>
            <input type="text" name="nombreMascota" class="nombreMascota" id="nombreMascota">
          </label>
        <label>
          <span>Correo electrónico</span>
          <input type="email" autocomplete="off" name="email" class="email" id="emailReg">
        </label>
          <span id="errorEmail" class="errorEmail"></span>
        <label>
          <span>Contraseña</span>
          <input type="password" class="password" id="passwordReg">
        </label>  
          <span id="errorPassword" class="errorPassword"></span>
      </form>   
        <button class="btnCrearCuenta" id="btnCrearCuenta">Registrar</button>
        <div id="mensaje-bienvenida" name="mensaje-bienvenida" class="mensaje-bienvenida"> </div>
        <span class="textRegistro">Si ya tienes cuenta -> <button class="btnRegistro" id="btnIniciaSesion">Inicia sesión</button></span>   
    </div>
    </main>
  </div>`;

  section.innerHTML = htmlRegister;

  // Labels dinámicos

  const inputs = section.querySelectorAll('input');

  inputs.forEach((input) => {
    input.onfocus = () => {
      input.previousElementSibling.classList.add('top');
      input.previousElementSibling.classList.add('focus');
      input.parentNode.classList.add('focus');
    };
    input.onblur = () => {
      input.value = input.value.trim();

      if (input.value.trim().length === 0) {
        input.previousElementSibling.classList.remove('top');
      }

      input.previousElementSibling.classList.remove('focus');
      input.parentNode.classList.remove('focus');
    };
  });

  const email = section.querySelector('#emailReg');
  const password = section.querySelector('#passwordReg');
  const errorEmail = section.querySelector('#errorEmail');
  const errorPassword = section.querySelector('#errorPassword');
  const btnCrearCuenta = section.querySelector('#btnCrearCuenta');
  const btnVolverInicio = section.querySelector('#btnIniciaSesion');

  // Limpiar mensajes de error

  email.addEventListener('click', () => {
    email.value = '';
    errorEmail.innerHTML = '';
    email.innerHTML = '';
  });

  password.addEventListener('click', () => {
    password.value = '';
    errorPassword.innerHTML = '';
    password.innerHTML = '';
  });

  // Crear cuenta para usuarios no registrados
  btnCrearCuenta.addEventListener('click', registerFirebase(email, password, errorEmail, errorPassword));

  // Volver a inicio de sesión si ya estás registrado
  btnVolverInicio.addEventListener('click', () => {
    navigation('/');
  });

  return section;
}