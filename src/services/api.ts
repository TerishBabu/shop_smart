export interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
}

export const fetchProducts = async (page: number): Promise<Product[]> => {
    await new Promise(res => setTimeout(res, 1000));

    const startId = (page - 1) * 10 + 1;

    return Array.from({ length: 10 }, (_, i) => {
        const id = startId + i;
        return {
            id,
            title: `Product ${id}`,
            price: parseFloat((Math.random() * 100).toFixed(2)),
            image: `https://picsum.photos/seed/${id}/150/150`,
        };
    });
};
