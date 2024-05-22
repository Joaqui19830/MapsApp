import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {LoadingScreen} from '../screens/loading/LoadingScreen';
import {MapScreen} from '../screens/maps/MapScreen';
import {PermissionsScreen} from '../screens/permissions/PermissionsScreen';

// Aca definimos la interface con la que vamos a manejar estos parametros
// Esto es sumamente util cuando tenemos paginas que requieren argumentos
export type RootStackParams = {
  LoadingScreen: undefined;
  PermissionsScreen: undefined;
  MapScreen: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoadingScreen"
      // initialRouteName="PermissionsScreen"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
    </Stack.Navigator>
  );
};
