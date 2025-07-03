import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart } from '../redux/slices/cartSlice';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CartScreen = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const showSnackbar = (message: string) => {
    setSnackMessage(message);
    setSnackVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setSnackVisible(false));
    }, 2000);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (itemId: number, title: string) => {
    dispatch(removeFromCart(itemId));
    showSnackbar(`${title} removed from cart`);
  };

  const renderItem = ({
    item,
  }: {
    item: { id: number; title: string; price: number; image: string };
  }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={[styles.cartButton, { backgroundColor: '#ef4444' }]}
        onPress={() => handleRemove(item.id, item.title)}
      >
        <Text style={styles.buttonText}>Remove from Cart</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#E0E0E0' }}>
      <StatusBar backgroundColor="#E0E0E0" barStyle="dark-content" />

      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <Text style={styles.headerText}>My Cart</Text>
      </View>

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.empty}>🛒 Your cart is empty</Text>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.flatListContainer}
            numColumns={2}
          />
        )}

        {cartItems.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
          </View>
        )}

        {snackVisible && (
          <Animated.View
            style={[
              styles.snackbar,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.snackbarText}>{snackMessage}</Text>
          </Animated.View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  headerText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 50,
    marginBottom: 10,
  },
  productCard: {
    backgroundColor: 'white',
    width: '48%',
    margin: 4,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,

    // Android elevation
    elevation: 4,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productImage: {
    height: 70,
    width: 80,
    marginTop: 25,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginVertical: 6,
    textAlign: 'center',
  },
  price: {
    fontSize: 13,
    color: 'green',
    marginBottom: 6,
  },
  cartButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  totalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3b82f6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 40,
    color: '#6b7280',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  snackbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 1000,
  },
  snackbarText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CartScreen;
