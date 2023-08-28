const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const productRouter = express.Router();
const app = express();

let products = [
    {
        id: 1,
        name: 'iPhone 12 Pro',
        price: 1099.99,
        imgUrl: 'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
        description:
            'The iPhone 12 Pro display has rounded corners that follow a beautiful curved design, and these corners are within a standard rectangle. When measured as a standard rectangular shape, the screen is 6.06 inches diagonally (actual viewable area is less).',
    },
    {
        id: 2,
        name: 'Samsung Galaxy S21',
        price: 999.99,
        imgUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
        description:
            'The Samsung Galaxy S21 specs are top-notch including a Snapdragon 888 chipset, 5G capability, 8GB RAM coupled with 128/256GB storage, and a 4000mAh battery. The phone sports a 6.2-inch Dynamic AMOLED display with an adaptive 120Hz refresh rate. In the camera department, a triple-sensor setup is presented.',
    },
    {
        id: 3,
        imgUrl: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1527&q=80',
        name: 'Sony PlayStation 5',
        price: 499.99,
        description:
            "The PlayStation 5 (PS5) is a home video game console developed by Sony Interactive Entertainment. It was announced as the successor to the PlayStation 4 in April 2019, was launched on November 12, 2020, in Australia, Japan, New Zealand, North America, and South Korea, and was released worldwide one week later. The PS5 is part of the ninth generation of video game consoles, along with Microsoft's Xbox Series X/S consoles, which were released in the same month.",
    },
    {
        id: 4,
        name: 'MacBook Pro 16',
        price: 2399.99,
        imgUrl: 'https://images.unsplash.com/photo-1580719993950-0d35ce87c26f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        description:
            'Apple MacBook Pro is a macOS laptop with a 13.30-inch display that has a resolution of 2560x1600 pixels. It is powered by a Core i5 processor and it comes with 12GB of RAM. The Apple MacBook Pro packs 512GB of SSD storage.',
    },
    {
        id: 5,
        name: 'DJI Mavic Air 2',
        price: 799.99,
        imgUrl: 'https://images.unsplash.com/photo-1613682988402-9e2ec510b4cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1450&q=80',
        description:
            'Mavic Air 2 takes power and portability to the next level, offering advanced features in a compact form factor. Intelligent shooting functions and excellent image quality put aerial masterpieces within reach. Safer, smarter flight enables you to up your game while fully enjoying the creative process.',
    },
];

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use('/products', productRouter);

app.use(':/id', (req, res, next) => {
    const productId = Number(req.params.id);
    const productIndex = products.findIndex(
        (product) => product.id === productId
    );

    if (productIndex === -1) {
        const err = new Error('Product not found.');
        err.status = 404;
        res.status(err.status).json({ message: err.message });
    }

    req.productIndex = productIndex;
    next();
});

productRouter.get('/', (req, res) => {
    res.render('home', { products });
});

productRouter.get('/search', (req, res) => {
    const { q, minPrice, maxPrice } = req.query;
    const strWithoutSpace = (str) => str.toLowerCase().replace(/\s/g, '');
    const searchQuery = strWithoutSpace(q);

    const productIndex = products.findIndex((product) => {
        const productName = strWithoutSpace(product.name);
        return productName === searchQuery;
    });

    const product = products[productIndex];

    // /products?q=keyword&price=10
    // /products/search?q=iphone12pro&minPrice=10&maxPrice=50
    if (
        (strWithoutSpace(product.name) === searchQuery) &
        (product.price >= minPrice) &
        (product.price <= maxPrice)
    ) {
        res.json(product);
    }
});

productRouter.get('/:id', (req, res) => {
    const productID = Number(req.params.id);
    const product = products.filter((product) => product.id === productID)[0];
    res.render('productDetails', { product });
});

-productRouter.post('/', (req, res) => {
    const { id, name, price } = req.body;
    const productId = Number(id);
    const productPrice = Number(price);

    if (id & name & price) {
        res.status(200).send({
            id: productId,
            name: name,
            price: productPrice,
        });
    }
});

productRouter.put('/:id', (req, res) => {
    products[req.productIndex] = {
        name: req.body.name,
        price: parseFloat(req.body.price),
    };
    res.status(200).json(products);
});

productRouter.delete('/:id', (req, res) => {
    const productDeleted = products.splice(req.productIndex, 1);
    res.status(200).json(productDeleted);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({ error: message });
});

app.use((req, res, next) => {
    res.status(404).send('Page not found');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
