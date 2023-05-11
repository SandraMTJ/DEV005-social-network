const visitar = (lugar) => `Hoy visite ${lugar}`;

const comer = (lugar) => `Hoy comi en ${lugar}`;

const actividadesColombia = (Lugar, unCallback) => {
  const hacerActividad = unCallback(Lugar);
  return `${hacerActividad} en Colombia`;
};

console.log(actividadesColombia('Bogota', visitar));
console.log(actividadesColombia('Medellin', comer));
console.log(actividadesColombia('Popayan', (place) => `Hoy hice GYM en ${place}`));
