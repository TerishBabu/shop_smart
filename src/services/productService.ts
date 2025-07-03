import axios from 'axios';

export const fetchProducts = async (page: number) => {
    const res = await axios.get(`https://fakestoreapi.com/products?limit=10&page=${page}`);
    return res.data;
};
