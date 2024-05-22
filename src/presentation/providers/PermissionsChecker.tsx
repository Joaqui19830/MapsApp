import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {PropsWithChildren, useEffect} from 'react';
import {AppState} from 'react-native';
import {RootStackParams} from '../navigation/StackNavigator';
import {usePermissionStore} from '../store/permissions/usePermissionStore';

// Este componente está envolviendo toda nuestra aplicacion en todo momento
export const PermissionsChecker = ({children}: PropsWithChildren) => {
  const {locationStatus, checkLocationPermission} = usePermissionStore();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  //* Importante: se recomienda hacer efectos por accion que nosotros necesitemos
  useEffect(() => {
    // Lo que realizamos en el navigation es para que no quede el efeco de poder hacer hacia atras y quede mostrandose
    // el loading pero con el reset ya no se puede devolver a la ruta anterior ya que no existe
    if (locationStatus === 'granted') {
      // navigation.navigate('MapScreen');
      navigation.reset({
        routes: [{name: 'MapScreen'}],
      });
    } else if (locationStatus !== 'undetermined') {
      // navigation.navigate('PermissionsScreen');
      navigation.reset({
        routes: [{name: 'PermissionsScreen'}],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationStatus]);

  // Esto se va a mandar solo una vez cuando el componente se monta
  useEffect(() => {
    checkLocationPermission();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aca si la aplicacion se sale o esta en el background es donde llama a este useEffect
  // Esto es importante porque aca nosotros vemos como verificar el estado de nuestra aplicacion
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      //   console.log('AppState', nextAppState);
      if (nextAppState === 'active') {
        checkLocationPermission();
      }
    });

    // Cada vez que hacemos ese tipo de suscripciones es importante limpiarlas en esa func de limpieza cuando no sean necesarias

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
};
