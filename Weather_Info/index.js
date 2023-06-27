let userTab = document.querySelector("[data-userWeather]");
let searchTab = document.querySelector("[data-searchWeather]");
let grantAccessBtn = document.querySelector(".grantAccess");
let grantAccessContainer = document.querySelector(".grant-location-container");
let searchFormTab = document.querySelector(".search-container");
let yourWeather = document.querySelector(".your-weather-container");
let loadingScreen = document.querySelector(".loading-container");
let searchData = document.querySelector(".searchBtn");
let inputValue = document.querySelector("[data-searchInput]");
let showError = document.querySelector(".showError");
let oldTab = userTab;
// const API_KEY = "77f03d528f9ec5fce9df80c08fa581e1";
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("currentTab");
getfromSessionStorage();
userTab.addEventListener('click',()=>{
    switchTab(userTab);
})
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})
function switchTab(crTab){
    if(oldTab != crTab){
        oldTab.classList.remove("currentTab");
        oldTab = crTab;
        oldTab.classList.add("currentTab");

        if(searchFormTab.classList.contains("active")){
            searchFormTab.classList.remove("active");
            yourWeather.classList.remove("active");
            getfromSessionStorage();
        }
        else{
            grantAccessContainer.classList.remove("active");
            searchFormTab.classList.add("active");
            yourWeather.classList.remove("active");
        }
    }
}
function getfromSessionStorage(){
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if(localCoordinates){
        const coordinates = JSON.parse(localCoordinates);
        fetchSearchWeatherInfo(coordinates);
    }
    else{
        grantAccessContainer.classList.add("active");
        showError.classList.remove("active");
    }
}

async function fetchSearchWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    showError.classList.remove("active");
    loadingScreen.classList.add("active");
    // API Call
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();
        loadingScreen.classList.remove("active");
        yourWeather.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        console.log(err);
        console.log("Dikkat h bhai kuch");
        loadingScreen.classList.remove("active");
        //HW
    }
}

grantAccessBtn.addEventListener('click',showTempDetails);

function showTempDetails(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Look's Like geoLocation Support is Not Available");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchSearchWeatherInfo(userCoordinates);
}

function renderWeatherInfo(weatherData){
    let cityName = document.querySelector("[data-city-name]");
    let countryIcon = document.querySelector("[data-img-icon]");
    let weatherDesc = document.querySelector("[data-weatherDesc]");
    let weatherIcon = document.querySelector("[data-weatherIcon]");   
    let temp = document.querySelector("[data-temp]");
    let windSpeed = document.querySelector("[wind-speed]");
    let humidity = document.querySelector("[humidity]");
    let clouds = document.querySelector("[clouds]");

    console.log(weatherData);

    cityName.innerText = weatherData?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherData?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherData?.weather[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherData?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherData?.main?.temp}°C`;
    windSpeed.innerText = `${weatherData?.wind?.speed}m/sec`;
    humidity.innerText = `${weatherData?.main?.humidity}%`;
    clouds.innerText = `${weatherData?.clouds?.all}%`;
}
searchFormTab.addEventListener("submit",(e)=>{ 
    e.preventDefault();
    const cityNamee = inputValue.value;
    console.log(cityNamee);
    if(cityNamee === ""){
        return;
    }
    else{
        fetchSearchedWeatherInfo(cityNamee); 
    }
});
async function fetchSearchedWeatherInfo(city){
    loadingScreen.classList.add("active");
    yourWeather.classList.remove("active");
    showError.classList.remove("active");
    try{
        console.log("Aur Bhai");
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
        const data = await response.json();
        console.log(data);
        if(data?.cod === "404"){
            console.log("Hello Bro");
            loadingScreen.classList.remove("active");
            yourWeather.classList.remove("active");
            showError.classList.add("active");
        }
        else{
            showError.classList.remove("active");
            loadingScreen.classList.remove("active");
            renderWeatherInfo(data);
            yourWeather.classList.add("active");
        }
    }
    catch(err){
        console.log("Bhai kuch issue aa Rahe h");
        console.log(err);
    }
}
console.log(sessionStorage);