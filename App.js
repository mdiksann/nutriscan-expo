import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NutritionProvider } from './src/context/NutritionContext';
import { useFonts, Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './src/screens/DashboardScreen';
import LogMealScreen from './src/screens/LogMealScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import { PWAInstallBanner } from './src/components/PWAInstallBanner';

const Tab = createBottomTabNavigator();

const NeumorphicTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#E0E5EC',
    card: '#E0E5EC',
    text: '#4A4A4A',
    primary: '#2ecc71',
  },
};

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NutritionProvider>
        <NavigationContainer theme={NeumorphicTheme}>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'Dashboard') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'LogMeal') {
                  iconName = focused ? 'camera' : 'camera-outline';
                } else if (route.name === 'Analytics') {
                  iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#2ecc71',
              tabBarInactiveTintColor: '#A3B1C6',
              tabBarStyle: {
                backgroundColor: '#E0E5EC',
                borderTopWidth: 0,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerStyle: {
                backgroundColor: '#E0E5EC',
                shadowOpacity: 0,
                elevation: 0,
                borderBottomWidth: 0,
              },
              headerTitleStyle: {
                color: '#4A4A4A',
                fontFamily: 'Poppins_700Bold',
              },
              tabBarLabelStyle: {
                fontFamily: 'Poppins_600SemiBold',
              }
            })}
          >
            <Tab.Screen 
              name="Dashboard" 
              component={DashboardScreen} 
              options={{ title: 'NutriScan' }}
            />
            <Tab.Screen 
              name="LogMeal" 
              component={LogMealScreen} 
              options={{ title: 'Log Meal' }}
            />
            <Tab.Screen 
              name="Analytics" 
              component={AnalyticsScreen} 
              options={{ title: 'Analytics' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
        <PWAInstallBanner />
      </NutritionProvider>
    </SafeAreaProvider>
  );
}
