const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
    },
];

const products = [
    {
        name: 'Air Jordan 1 Retro High',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=2012&ixlib=rb-4.0.3',
        description:
            'The Air Jordan 1 Retro High Remastered Series organizes the 30th anniversary of the Air Jordan franchise.',
        brand: 'Nike',
        category: 'Men',
        price: 180.0,
        countInStock: 10,
        rating: 4.5,
        numReviews: 12,
    },
    {
        name: 'Ultraboost Light Running Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
        description:
            'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.',
        brand: 'Adidas',
        category: 'Sports',
        price: 190.0,
        countInStock: 7,
        rating: 4.0,
        numReviews: 8,
    },
    {
        name: 'Chuck Taylor All Star',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
        description:
            'The unmistakable Chuck Taylor All Star Classic celebrates the iconic high top silhouette.',
        brand: 'Converse',
        category: 'Casual',
        price: 60.0,
        countInStock: 0,
        rating: 4.8,
        numReviews: 15,
    },
    {
        name: 'Puma Suede Classic',
        image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3',
        description:
            'The Suede hit the scene in 1968 and has been changing the game ever since.',
        brand: 'Puma',
        category: 'Casual',
        price: 70.0,
        countInStock: 15,
        rating: 4.1,
        numReviews: 5,
    },
    {
        name: 'Nike Air Max 90',
        image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3',
        description:
            'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole.',
        brand: 'Nike',
        category: 'Women',
        price: 130.0,
        countInStock: 5,
        rating: 4.6,
        numReviews: 10,
    },
    {
        name: 'Vans Old Skool',
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=1998&ixlib=rb-4.0.3',
        description:
            'The Old Skool was our first footwear design to showcase the famous Vans Sidestripe.',
        brand: 'Vans',
        category: 'Kids',
        price: 65.0,
        countInStock: 12,
        rating: 4.7,
        numReviews: 20,
    },
];

module.exports = { users, products };
