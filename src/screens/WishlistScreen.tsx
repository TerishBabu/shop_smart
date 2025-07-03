import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromWishlist, Product } from '../redux/slices/wishlistSlice';
import Icon from 'react-native-vector-icons/Ionicons';

const WishlistScreen = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const [loading, setLoading] = useState(true);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(100))[0];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
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

  const handleRemove = (id: number, title: string) => {
    dispatch(removeFromWishlist(id));
    showSnackbar(`${title} removed from wishlist`);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => handleRemove(item.id, item.title)}>
        <Icon name="trash" size={22} color="red" style={styles.removeIcon} />
      </TouchableOpacity>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/150' }}
        style={styles.productImage}
        resizeMode="contain"
      />
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#E0E0E0' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="#E0E0E0" barStyle="dark-content" />
        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <Text style={styles.headerText}>My Wishlist</Text>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#28a745" />
          </View>
        ) : (
          <FlatList
            data={wishlist}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.flatListContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.empty}>💖 Your wishlist is empty</Text>
              </View>
            }
          />
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productCard: {
    backgroundColor: 'white',
    width: '48%',
    margin: 4,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    position: 'relative',
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
  removeIcon: {
    position: 'absolute',
    left: 50,
    top: 5,
    zIndex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 380,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
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

export default WishlistScreen;
