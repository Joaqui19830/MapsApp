import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {MapComponents} from '../../components/maps/Map';
import {useLocationStore} from '../../store/location/useLocationStore';
import {LoadingScreen} from '../loading/LoadingScreen';

export const MapScreen = () => {
  const {lastKnowLocation, getLocation} = useLocationStore();

  useEffect(() => {
    if (lastKnowLocation === null) {
      getLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (lastKnowLocation === null) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <MapComponents initialLocation={lastKnowLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
});
