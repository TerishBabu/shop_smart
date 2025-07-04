import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './src/redux/store';

import ProductListScreen from './src/screens/ProductListScreen';
import CartScreen from './src/screens/CartScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import SplashScreen from './src/screens/SplashScreen';

import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const CartIconWithBadge = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => {
  const cartCount = useSelector((state: RootState) => state.cart.items.length);
  return (
    <View>
      <Ionicons name="cart" size={size} color={color} />
      {cartCount > 0 && (
        <View style={badgeStyle}>
          <Text style={badgeText}>{cartCount}</Text>
        </View>
      )}
    </View>
  );
};

const WishlistIconWithBadge = ({
  color,
  size,
}: {
  color: string;
  size: number;
}) => {
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist.items.length,
  );
  return (
    <View>
      <Ionicons name="heart" size={size} color={color} />
      {wishlistCount > 0 && (
        <View style={badgeStyle}>
          <Text style={badgeText}>{wishlistCount}</Text>
        </View>
      )}
    </View>
  );
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="ProductList"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'ProductList') {
            return (
              <Ionicons
                name={focused ? 'list' : 'list-outline'}
                size={size}
                color={color}
              />
            );
          } else if (route.name === 'Cart') {
            return <CartIconWithBadge color={color} size={size} />;
          } else if (route.name === 'Wishlist') {
            return <WishlistIconWithBadge color={color} size={size} />;
          } else if (route.name === 'Profile') {
            return (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={size}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#d1d5db',
      })}
    >
      <Tab.Screen name="ProductList" component={ProductListScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {showSplash ? <SplashScreen /> : <AppNavigator />}
      </NavigationContainer>
    </Provider>
  );
};

const badgeStyle = {
  position: 'absolute',
  right: -6,
  top: -3,
  backgroundColor: 'red',
  borderRadius: 8,
  width: 16,
  height: 16,
  justifyContent: 'center',
  alignItems: 'center',
};
const badgeText = {
  color: 'white',
  fontSize: 10,
};

export default App;
