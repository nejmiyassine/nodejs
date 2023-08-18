const getCityByName = (name) =>
    cities.filter((city) => city.name.trim() === name.toString().trim())[0];

export const getCityTemperature = async (cityName) => {
    const cityByName = await getCityByName(cityName);

    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${cityByName.lat}&longitude=${cityByName.lng}&current_weather=true`;
        const response = await fetch(url);
        const jsonResponse = await response.json();
        const { current_weather } = jsonResponse;

        return current_weather.temperature;
    } catch (error) {
        console.log(error);
    }
};
