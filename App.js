import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './components/HomeScreen';
import RegistrationScreen from './components/RegistrationScreen';
import LoginScreen from './components/LoginScreen';
import UserProfileScreen from './components/UserProfileScreen';
import EditProfileScreen from './components/EditProfileScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginScreen' 
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f0f0f0',
           // Change the background color
        },
        headerTintColor: 'darkblue', // Change the text color
        headerTitleStyle: {
          fontWeight: 'bold', // Change the title text style
        },
      }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen}  options={{headerShown: false}}/>
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'User Profile' }}/>
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="RegistrationScreen" component={RegistrationScreen}  options={{headerShown: false}}/>
        <Stack.Screen name="LoginScreen" component={LoginScreen}  options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;