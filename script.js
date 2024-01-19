//featch tab
const user_tab = document.querySelector("[data-user-Wearher]");
const search_tab = document.querySelector("[data-search-weather]");
//featch grant access container
const grant_access = document.querySelector(".grant-location");
const form_container = document.querySelector("[data-search-form]");
const user_info = document.querySelector(".user-info-container");
const looding_info = document.querySelector(".loading");



//current tab by defult user_tab
let curr_tab = user_tab;
const API_KEY = "168771779c71f3d64106d8a88376808a";
 curr_tab.classList.add("curr-tab");
 get_from_sessionstorge();
 //switch_tab function
 function switch_tab(click_tab) {
    if (click_tab != curr_tab) {
        curr_tab.classList.remove("curr-tab");
        curr_tab = click_tab;
        curr_tab.classList.add("curr-tab");
        if (!form_container.classList.contains("active")) {
            user_info.classList.remove("active");
            grant_access.classList.remove("active");
            form_container.classList.add("active");
            console.log("yes");
        } else {
            form_container.classList.remove("active");
            user_info.classList.remove("active");
            get_from_sessionstorge();
        }
    }
}


//call switch tab
 user_tab.addEventListener("click", () => {
    switch_tab(user_tab)
});
 search_tab.addEventListener("click", () => {
    switch_tab(search_tab);
});


 function get_from_sessionstorge() {
    const localcord = sessionStorage.getItem("user-cordinates");
    if (!localcord) {
        grant_access.classList.add("active");
    } else {
        const cord = JSON.parse(localcord);
        featch_weather_info(cord);
    }
}

 async function featch_weather_info(cord) {
    const { lat, lon } = cord;
    grant_access.classList.remove("active");
    looding_info.classList.add("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        const data = await response.json();
        //console.log(data);
        grant_access.classList.remove("active");
        looding_info.classList.remove("active");
        user_info.classList.add("active");
        render_weather_info(data);
    } catch (error) {
        looding_info.classList.remove("active");
    }

}

 function render_weather_info(data) {
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    //set data from api 

    cityName.innerText = data ?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data ?.weather ?.[0] ?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudiness.innerText = `${data?.clouds?.all}%`;
}

 function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

 function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-cordinates", JSON.stringify(userCoordinates));
    featch_weather_info(userCoordinates);

}
const grantAccessButton = document.querySelector("[grant-location-access]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

form_container.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    looding_info.classList.add("active");
    user_info.classList.remove("active");
    grant_access.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        looding_info.classList.remove("active");
        user_info.classList.add("active");
        render_weather_info(data);
    } catch (err) {
        console.log(err);
    }
}