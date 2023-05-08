import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/index.js';
import { login } from './templates/login.js';
import { register } from './templates/register.js';
import error from './templates/error.js';
import { home } from './templates/home.js';

/* Se obtiene el elemento del DOM con el ID "root" y se almacena en la variable root. Este elemento
 es el contenedor principal donde se renderizan las vistas de la aplicación. */
const root = document.getElementById('root');

// Se crean rutas para diferentes vistas
/* Se define arreglo 'routes' que contiene diferentes objetos de ruta. Cada objeto de ruta tiene
 una propiedad path que representa la ruta y una propiedad component que representa el componente
 asociado a esa ruta. */
const routes = [
  { path: '/', component: login },
  { path: '/register', component: register },
  { path: '/error', component: error },
  { path: '/home', component: home },
];

// Ruta por defecto
const defaultRoute = '/';

// Función que permite navegar por la rutas
export function navigation(hash) {
  /* Se busca en el arreglo 'routes' el objeto de ruta cuya propiedad 'path' coincide con el
   'hash' pasado como parámetro. */
  // eslint-disable-next-line no-shadow
  const route = routes.find((route) => route.path === hash);
  /*  Si se encuentra una ruta y tiene un componente asociado, se ejecuta el código
   dentro de este bloque */
  if (route && route.component) {
  /* Se utiliza el método 'pushState' del objeto 'history' del navegador para cambiar la URL de la
   página sin recargarla. Esto actualiza la URL en la barra de direcciones del navegador. */
    window.history.pushState(
      {},
      route.path,
      window.location.origin + route.path,
    );
    /* Si el elemento 'root' tiene un hijo, se elimina ese hijo. Esto permite limpiar el contenido
     anterior antes de renderizar el nuevo componente. */
    if (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    /* Se agrega a 'root' un nuevo hijo que es el componente asociado a la ruta. El componente se
     obtiene llamando a la función route.component y pasando la función navigation como argumento */
    root.appendChild(route.component(navigation));
    /* Si no se encuentra una ruta válida, se llama a la función 'navigation' con la ruta '/error'.
     Esto significa que se navegará a una página de error. */
  } else {
    navigation('/error');
  }
}

/* Se asigna función al evento 'onpopstate' del objeto 'window'. Se activa cuando se navega hacia
atrás o hacia adelante en el historial del navegador. Dentro de la función, se llama a la función
'navigation' pasando la ruta actual (window.location.pathname). */
window.onpopstate = () => {
  navigation(window.location.pathname);
};

/* Se exporta variable 'authUser que valida si el usuario está logueado o no. Utiliza la función
'onAuthStateChanged' del objeto auth (definido en index.js) y recibe callback que se ejecuta cuando
el estado de autenticación cambia. Dependiendo del estado de usuario, se llama función 'navigation'
con diferentes rutas para redirigir al usuario a diferentes vistas. */
export const authUser = onAuthStateChanged(auth, (user) => {
  if (user) {
    navigation('/home');
  } else if (window.location.pathname !== '/home' && !user) {
    navigation(window.location.pathname || defaultRoute);
  } else {
    navigation(defaultRoute);
  }
});
