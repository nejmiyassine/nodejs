const fs = require('fs');

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

const cityName = fs
    .readFileSync('input.txt', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        return data;
    })
    .toString();

console.log('cityName: ' + cityName);

const getCityByName = (name) => {
    const cityFilter = cities.filter((city) => city.name === name.toString());
    return cityFilter;
};

const cityByName = getCityByName(cityName);

const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityByName[0].lat}&longitude=${cityByName[0].lng}&current_weather=true`;

const fetchCityTemperature = async () => {
    try {
        const response = await fetch(url);
        const jsonResponse = await response.json();
        const { current_weather } = jsonResponse;

        fs.writeFileSync(
            `${cityByName[0].name}.txt`,
            `${current_weather.temperature}`,
            'utf-8',
            (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log('File successfully written.');
            }
        );

        console.log(current_weather.temperature);
        return current_weather.temperature;
    } catch (error) {
        console.log(error);
    }
};

fetchCityTemperature();
