import Geolocation from '@react-native-community/geolocation';
import {Location} from '../../infrastructure/interface/location';

//* Esto es todo para obtener la posicion actual
export const getCurrentLocation = async (): Promise<Location> => {
  // Aca el geolocation devuelve un callback pero haciendo esto lo tranformamos en una promesa
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      info => {
        resolve({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      error => {
        console.log("Can't get location");

        reject(error);
      },
      {
        enableHighAccuracy: true, // esto nos hacia falta sino no nos tiraba la ubicacion
      },
    );
  });
};

export const watchCurrentLocation = (
  locationCallback: (location: Location) => void,
): number => {
  return Geolocation.watchPosition(
    info =>
      locationCallback({
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
      }),
    error => {
      console.log(error);

      throw new Error("can't get watchPosition");
    },
    {
      enableHighAccuracy: true,
    },
  );
};

export const clearWatchLocation = (watchId: number) => {
  Geolocation.clearWatch(watchId);
};
