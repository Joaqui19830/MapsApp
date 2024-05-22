/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import MapView, {PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import {Location} from '../../../infrastructure/interface/location';
import {useLocationStore} from '../../store/location/useLocationStore';
import {FABComponent} from '../ui/FAB';

interface Props {
  showsUserLocation?: boolean;
  initialLocation: Location;
}

export const MapComponents = ({
  showsUserLocation = true,
  initialLocation,
}: Props) => {
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);
  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [isShowingpolyline, setIsShowingpolyline] = useState(true);

  const {
    getLocation,
    lastKnowLocation,
    watchLocation,
    clearWatchLocation,
    userLocationsList,
  } = useLocationStore();

  const moveCamaraToLocation = (location: Location) => {
    if (!mapRef.current) {
      return;
    }

    mapRef.current.animateCamera({
      center: location,
    });
  };

  const moveToCurrentlocation = async () => {
    if (!lastKnowLocation) {
      moveCamaraToLocation(initialLocation);
    }
    const location = await getLocation();
    if (!location) {
      return;
    }
    moveCamaraToLocation(location);
  };

  useEffect(() => {
    watchLocation();

    return () => {
      clearWatchLocation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (lastKnowLocation && isFollowingUser) {
      moveCamaraToLocation(lastKnowLocation);
    }
  }, [lastKnowLocation, isFollowingUser]);

  return (
    <>
      <MapView
        mapType="terrain"
        // customMapStyle={mapStyle}
        ref={map => (mapRef.current = map!)} // Aca le aseguro que viene un map
        showsUserLocation={showsUserLocation} // Este es el puntito azul de mi ubicacion
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{flex: 1}} // Aca el mapa toma todo el espacio que le estamos dando
        onTouchStart={() => setIsFollowingUser(false)}
        region={{
          // Aca como si es una referencia no va a re reenderizar el componente
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {isShowingpolyline && (
          <Polyline
            coordinates={userLocationsList}
            strokeColor="black"
            strokeWidth={5}
          />
        )}

        {/* <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="Este es el titulo del marcador"
          description="Este es el cuerpo del marcador"
          image={{
            uri: 'https://import.cdn.thinkific.com/643563/efgOPaI7RFa42rFSjBYx_custom-marker.png',
          }}
        /> */}
      </MapView>

      <FABComponent
        iconName={isShowingpolyline ? 'eye-outline' : 'eye-off-outline'}
        onPress={() => setIsShowingpolyline(!isShowingpolyline)}
        style={{
          bottom: 140,
          right: 20,
        }}
      />

      <FABComponent
        iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
        onPress={() => setIsFollowingUser(!isFollowingUser)}
        style={{
          bottom: 80,
          right: 20,
        }}
      />

      <FABComponent
        iconName="compass-outline"
        onPress={moveToCurrentlocation}
        style={{
          bottom: 20,
          right: 20,
        }}
      />
    </>
  );
};
