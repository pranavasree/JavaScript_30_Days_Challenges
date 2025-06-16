/*API Key that we have in openweathermap websie*/
const API_KEY = "78f0d3dd4d12f916e87e3dfa032a4519";

const searchInput = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

const notFound = document.querySelector(".not-found");
const searchCity = document.querySelector(".search-city");
const weatherInfo = document.querySelector(".weather-info");

const countryTxt = document.querySelector(".country-text");
const tempTxt = document.querySelector(".temp-text");
const conditionTxt = document.querySelector(".condition-text");
const humdityTxt = document.querySelector(".humidity-value-text");
const windTxt = document.querySelector(".wind-value-text");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const cuurentDateTxt = document.querySelector(".current-date-text");

const foreCastItems = document.querySelector(".forecast-items");

const card = document.querySelector(".card");

/*Function to get the weather details based on city name*/
async function updateWeather(city) {
  const response = await getData("weather", city);

  if (response.cod !== 200) {
    //If the city is not valid
    showDisplaySection(notFound);
    return;
  }
  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = response;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + " °C";
  conditionTxt.textContent = main;
  humdityTxt.textContent = humidity + "%";
  windTxt.textContent = speed + " M/s";

  cuurentDateTxt.textContent = getCurrentDate();
  weatherSummaryImg.src = `images/weather/${getWeatherIcon(id)}`;

  await updateForeCastInfo(city);
  showDisplaySection(weatherInfo);
}

async function getData(endPoint, city) {
  const appUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?units=metric&q=`;
  const response = await fetch(appUrl + city + `&appid=${API_KEY}`);
  const jsonData = await response.json();
  console.log(jsonData);
  return jsonData;
}

async function updateForeCastInfo(city) {
  const foreCastData = await getData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  foreCastItems.innerHTML = "";
  foreCastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForeCastItems(forecastWeather);
    }
  });
}

function updateForeCastItems(weatherData) {
  const {
    dt_txt: data,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date();
  const dateOPtion = { day: "2-digit", month: "short" };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOPtion);
  const forecastItem = `<div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${dateResult}</h5>
            <img src="images/weather/${getWeatherIcon(
              id
            )}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
          </div>`;
  foreCastItems.insertAdjacentHTML("beforeend", forecastItem);
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };

  return currentDate.toLocaleDateString("en-US", options);
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstrom.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city != "") {
    updateWeather(city);
    searchInput.value = "";
    searchInput.blur();
  }
});

searchInput.addEventListener("keydown", (event) => {
  const city = searchInput.value.trim();
  if (event.key == "Enter" && city != "") {
    updateWeather(city);
    searchInput.value = "";
    searchInput.blur();
  }
});

function showDisplaySection(section) {
  [weatherInfo, searchCity, notFound].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
