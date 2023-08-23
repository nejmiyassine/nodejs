const express = require('express');
const bodyParser = require('body-parser');
const productRouter = express.Router();
const app = express();

let products = [
    { id: 1, name: 'iPhone 12 Pro', price: 1099.99 },
    { id: 2, name: 'Samsung Galaxy S21', price: 999.99 },
    { id: 3, name: 'Sony PlayStation 5', price: 499.99 },
    { id: 4, name: 'MacBook Pro 16', price: 2399.99 },
    { id: 5, name: 'DJI Mavic Air 2', price: 799.99 },
];

app.use(express.static('public'));
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
    const { q, minPrice, maxPrice } = req.query;

    // /products?q=keyword&minPrice=10&maxPrice=50
    res.send(
        `Search Query: ${q}, Min Price: ${minPrice}, Max Price: ${maxPrice}`
    );
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
    } else {
        const err = new Error('Product not found. Enter a valid product name.');
        err.status = 404;
        res.status(err.status).json({ message: err.message });
    }
});

productRouter.get('/:id', (req, res) => {
    res.send(
        `Product ID: ${products[req.productIndex].id}, Product Name: ${
            products[req.productIndex].name
        }, Product Price: $${products[productIndex].price}.`
    );
});

productRouter.post('/', (req, res) => {
    const { id, name, price } = req.body;
    const productId = Number(id);
    const productPrice = Number(price);

    if (id & name & price) {
        res.status(200).send({
            id: productId,
            name: name,
            price: productPrice,
        });
    } else {
        const err = new Error('Invalid product format.');
        err.status = 404;
        res.status(err.status).json({ message: err.message });
    }
});

productRouter.put('/:id', (req, res) => {
    products[req.productIndex] = { name: req.body.name, price: parseFloat(req.body.price) };
    res.status(200).json(products);
});

productRouter.delete('/:id', (req, res) => {
    const productDeleted = products.splice(req.productIndex, 1);
    res.status(200).json(productDeleted);
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
