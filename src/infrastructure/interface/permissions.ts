// Aca es como quiero manejar yo los permisos por mas que ocupe un paquete
// Pefiero usar types cuando son uniones o valors y prefiero usar interface cuando son objetos
//* Esto no tiene que ver on el paquete de permission handler estos son mis privilegios o mis permisos que yo estoy creando

export type PermissionStatus =
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'limited'
  | 'unavailable'
  | 'undetermined';
