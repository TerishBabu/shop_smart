import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, Product } from '../services/api';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { toggleWishlist } from '../redux/slices/wishlistSlice';
import { RootState } from '../store';
import Icon from 'react-native-vector-icons/Ionicons';

const activeColor = '#007bff';
const disabledColor = '#d1d5db';
const wishlistActiveColor = '#e63946';
const wishlistInactiveColor = '#a0aec0';

const ProductListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart.items);

  const [searchQuery, setSearchQuery] = useState('');
  const [snackMessage, setSnackMessage] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(100))[0];

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

  const handleAddToCart = (item: Product, isInCart: boolean) => {
    if (isInCart) {
      dispatch(removeFromCart(item.id));
      showSnackbar(`${item.title} removed from cart`);
    } else {
      dispatch(addToCart(item));
      showSnackbar(`${item.title} added to cart`);
    }
  };

  const handleToggleWishlist = (item: Product) => {
    const isWishlisted = wishlist.some(w => w.id === item.id);
    dispatch(toggleWishlist(item));
    showSnackbar(
      `${item.title} ${isWishlisted ? 'removed from' : 'added to'} wishlist`,
    );
  };

  const loadProducts = async (retrying = false) => {
    if (!retrying) setLoading(true);
    try {
      const newProducts = await fetchProducts(page);
      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const filteredNew = newProducts.filter(p => !existingIds.has(p.id));
        return [...prev, ...filteredNew];
      });
      setError(null);
    } catch {
      setError('Failed to load products.');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  const renderItem = ({ item }: { item: Product }) => {
    const isWishlisted = wishlist.some(w => w.id === item.id);
    const isInCart = cart.some(c => c.id === item.id);

    return (
      <View style={styles.productCard}>
        <TouchableOpacity onPress={() => handleToggleWishlist(item)}>
          <Icon
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color={isWishlisted ? wishlistActiveColor : wishlistInactiveColor}
            style={styles.wishlistIcon}
          />
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
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[
              styles.cartButton,
              { backgroundColor: isInCart ? disabledColor : activeColor },
            ]}
            onPress={() => handleAddToCart(item, isInCart)}
          >
            <Text style={styles.buttonText}>
              {isInCart ? 'Added To Cart' : 'Add To Cart'}
            </Text>
          </TouchableOpacity>
          {isInCart && (
            <TouchableOpacity onPress={() => handleAddToCart(item, true)}>
              <Icon
                name="trash"
                size={20}
                color={activeColor}
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="large" color={activeColor} />
      </View>
    );
  };

  const renderContent = () => {
    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (loading && page === 1) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={activeColor} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity onPress={() => loadProducts(true)}>
            <Text style={styles.retry}>🔄 Tap to Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => setPage(prev => prev + 1)}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.flatListContainer}
        numColumns={2}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F7FAFC' }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F7FAFC' }}>
        <StatusBar backgroundColor="#F7FAFC" barStyle="dark-content" />

        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
          <Text style={styles.headerText}>Product List</Text>

          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#A0AEC0" />
            <TextInput
              placeholder="Search Product"
              placeholderTextColor="#A0AEC0"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {renderContent()}
      </SafeAreaView>

      {snackVisible && (
        <Animated.View
          style={[styles.snackbar, { transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.snackbarText}>{snackMessage}</Text>
        </Animated.View>
      )}
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
  searchBar: {
    backgroundColor: 'white',
    height: 40,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: 'black',
  },
  productCard: {
    backgroundColor: 'white',
    width: '48%',
    margin: 4,
    borderRadius: 10,
    alignItems: 'center',
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  wishlistIcon: {
    position: 'absolute',
    left: 50,
    top: 5,
    zIndex: 1,
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
    color: '#2f855a',
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 340,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  retry: {
    color: '#007bff',
    fontWeight: '500',
    fontSize: 15,
    textDecorationLine: 'underline',
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

export default ProductListScreen;
