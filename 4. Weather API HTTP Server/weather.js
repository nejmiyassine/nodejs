const http = require('http');
const url = require('url');
const { getCityTemperature } = require('../getCityTemperature');
const port = 3000;

const cities = [
    { name: 'New York', lat: 40.7128, lng: -74.006 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Tokyo', lat: 35.6895, lng: 139.6917 },
    { name: 'Sydney', lat: -33.8651, lng: 151.2099 },
    { name: 'Rome', lat: 41.9028, lng: 12.4964 },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
    { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
    { name: 'Rabat', lat: 34.0209, lng: -6.8416 },
];

const server = http.createServer((req, res) => {
    // Request handling logic goes here
    const parsedUrl = url.parse(req.url, true);
    const { query, path } = parsedUrl;

    if (path && req.method === 'GET') {
        const cityName = query.city;
        const isCityFound = cities.filter((city) => city.name === cityName);

        if (!cityName) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(
                JSON.stringify({ error: 'Parameter cityName is required' })
            );
        } else if (isCityFound) {
            getCityTemperature(cityName)
                .then((temp) => {
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                    });
                    res.end(
                        JSON.stringify({ city: cityName, temperature: temp })
                    );
                })
                .catch((error) => {
                    res.writeHead(400, {
                        'Content-Type': 'application/json',
                    });
                    res.end(JSON.stringify({ error }));
                });
        } else {
            res.writeHead(400, {
                'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ error: 'City not found' }));
        }
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log('Server is listening on port ' + port);
});
