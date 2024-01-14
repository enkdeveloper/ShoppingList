import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './MainScreen';
import SettingsScreen, { SettingsScreenProps } from './SettingsScreen'; 

const BottomTab = createBottomTabNavigator();

const BottomTabNavigator: React.FC = () => {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="Lists"
        options={{ tabBarLabel: 'Lists' }}
        component={MainScreen}
      />
      <BottomTab.Screen
        name="Settings"
        options={{ tabBarLabel: 'Settings' }}
        component={(props: SettingsScreenProps) => <SettingsScreen {...props} />}
      />
      {/* Add other screens as needed */}
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;



