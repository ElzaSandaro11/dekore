import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BookingScreen from '../screens/BookingScreen';
import TabsNavigator from './TabsNavigator';
import ShoppingScreen from '../screens/ShoppingScreen';
import DashboardScreen from '../screens/DashboardScreen';

export type ShellStackParamList = {
  Tabs: undefined;
  Booking: undefined;
  Shopping: undefined;
  Dashboard: undefined;
};

const Shell = createNativeStackNavigator<ShellStackParamList>();

const ShellNavigator = () => {
return (
    <>
      <Shell.Navigator screenOptions={{headerShown: false}}>
        <Shell.Screen name="Tabs" component={TabsNavigator} />
        <Shell.Screen name="Booking" component={BookingScreen} />
        <Shell.Screen name="Shopping" component={ShoppingScreen} />
        <Shell.Screen name="Dashboard" component={DashboardScreen} />
      </Shell.Navigator>
    </>
  );
};

export default ShellNavigator;
