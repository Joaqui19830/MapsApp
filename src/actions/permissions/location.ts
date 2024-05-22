import {Platform} from 'react-native';
import {
  PERMISSIONS,
  PermissionStatus as RNPermissionStatus,
  check,
  openSettings,
  request,
} from 'react-native-permissions';
import {PermissionStatus} from '../../infrastructure/interface/permissions';

// Esto es asincrono porque lo que es la solicitud del servicio no es instantanea
export const requestLocationPermission =
  async (): Promise<PermissionStatus> => {
    let status: RNPermissionStatus = 'unavailable';

    if (Platform.OS === 'ios') {
      status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (Platform.OS === 'android') {
      status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    } else {
      throw new Error('Unsopported platform');
    }

    if (status === 'blocked') {
      // Esto va a abrir las settings del  dispositivo para que el usuario manualmente abra la aplicacion y habilite el locaions
      await openSettings();
      return await checkLocationPermission();
    }

    // Esto es para ahorrarme un switch
    const permissionsMapper: Record<RNPermissionStatus, PermissionStatus> = {
      granted: 'granted',
      denied: 'denied',
      blocked: 'blocked',
      unavailable: 'unavailable',
      limited: 'limited',
    };

    return permissionsMapper[status] ?? 'unavailable';
  };

//* Nota: la diferencia entre un request y un check es que el request va a abrir un popop que va a decir
//* ey esta aplicacion quiere tener accesoa tu ubicacion etc. El check solamente cerifica si ya se a otorgado o no
//* el permiso y no pregunta
// El checkLocationPermission me va servir a mi para cuando estoy en un loading, para poder determinar 'ey la persona
// ya tiene acceso o no' entonces si es asi lo mando a otra pantalla y sino me lo a dado lo mando a otra pantalla
// para que intensionalmente ahi llame a la funcion de arriba
export const checkLocationPermission = async (): Promise<PermissionStatus> => {
  let status: RNPermissionStatus = 'unavailable';

  if (Platform.OS === 'ios') {
    status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  } else if (Platform.OS === 'android') {
    status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  } else {
    throw new Error('Unsopported platform');
  }

  const permissionsMapper: Record<RNPermissionStatus, PermissionStatus> = {
    granted: 'granted',
    denied: 'denied',
    blocked: 'blocked',
    unavailable: 'unavailable',
    limited: 'limited',
  };

  return permissionsMapper[status] ?? 'unavailable';
};
