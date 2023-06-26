const result = document.querySelector('.result');
const form = document.querySelector('.preguntas');
const nameCiu = document.querySelector('#ciu');
const namePais = document.querySelector('#pais');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (nameCiu.value === '' || namePais.value === '') {
        ErrorFatal('Debe llenar todos los espacios');
        return;
    }

    callAPI(nameCiu.value, namePais.value);

})

function callAPI(ciu, pais){
    const apiId = '1b655dddc5c0162c1fd5d859b6b2292f';
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${ciu},${pais}&appid=${apiId}`;

    fetch(url)
        .then(data => {
            return data.json();
        })
        .then(dataJSON => {
            if (dataJSON.cod === '404') {
                ErrorFatal('Ciudad no encontrada');
            } else {
                clearHTML();
                showWeather(dataJSON);
            }

        })
        .catch(error => {
            console.log(error);
        })
}

function showWeather(data){
    const {name, main:{temp, temp_min, temp_max, humidity, feels_like, pressure}, weather:[arr]} = data;

    const degrees = DatosListos(temp);
    const min = DatosListos(temp_min);
    const max = DatosListos(temp_max);
    const humedad = DatosListos(humidity);
    const sensacion = DatosListos(feels_like);
    const presion = DatosListos(pressure);

    const content = document.createElement('div');
    content.innerHTML = `
        <h2>Clima en ${name}</h2>
        <img src="https://openweathermap.org/img/wn/${arr.icon}@2x.png" alt="icon">
        <h2>${degrees}°C</h2>
        <p>Max: ${max}°C</p>
        <p>Min: ${min}°C</p>
        <p>Humedad: ${humedad}</p>
        <p>Sensación Termica: ${sensacion}°C</p>
        <p>Presíon atmosférica: ${presion}</p>

    `;

    result.appendChild(content);

}

function ErrorFatal(message){
    const alert = document.createElement('p');
    alert.classList.add('alert-message');
    alert.innerHTML = message;

    form.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function DatosListos(temp){
    return parseInt(temp - 273.15);
}

function clearHTML(){
    result.innerHTML = '';
}
