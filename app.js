// const cors = "https://cors-anywhere.herokuapp.com/";

const temp = document.querySelector("#temp h3");
const icon = document.querySelector("#icon");
const search = document.querySelector("#search");
const search_icon = document.querySelector("#search-icon");
const location_icon = document.querySelector("#location-icon");
const desc = document.querySelector("#desc h4");
const city = document.querySelector("#city h2");

// Temp on window load
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    //console.log(position);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    const current_api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_KEY}`;

    fetch(current_api).then((res) => {
      res.json().then((data) => {
        current_location_temp(data);
      });
    });
  });
} else {
  alert("Error! Location not detected.");
}

// Choose icons according to time
const dayNight = (day_night) => {
  if (day_night == "n") return "NIGHT";
  else return "DAY";
};

// Return appropriate icons
const getIcon = (id, day_night) => {
  let type;

  if (id === 221) {
    type = `THUNDER_SHOWERS_${dayNight(day_night)}`;
  } else if (id === 511 || id === 611 || id === 612 || id === 613) {
    type = `SLEET`;
  } else if (
    id === 531 ||
    parseInt(id / 10) === 52 ||
    parseInt(id / 100) === 3
  ) {
    type = `SHOWERS_${dayNight(day_night)}`;
  } else if (id === 615 || id === 616) {
    type = `RAIN_SNOW_SHOWERS_${dayNight(day_night)}`;
  } else if (id === 771 || id === 781) {
    type = `WIND`;
  } else if (id === 800) {
    type = `CLEAR_${dayNight(day_night)}`;
  } else if (id === 801 || id === 802) {
    type = `PARTLY_CLOUDY_${dayNight(day_night)}`;
  } else if (id === 803 || id === 804) {
    type = `CLOUDY`;
  } else if (parseInt(id / 10) === 20) {
    type = `THUNDER_RAIN`;
  } else if (parseInt(id / 10) === 21) {
    type = `THUNDER`;
  } else if (parseInt(id / 10) === 50) {
    type = `RAIN`;
  } else if (parseInt(id / 100) === 7) {
    type = `FOG`;
  } else if (parseInt(id / 10) === 60) {
    type = `SNOW`;
  } else if (parseInt(id / 10) === 60) {
    type = `SNOW_SHOWERS_${dayNight(day_night)}`;
  }

  return type;
};

// Search on enter
search.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    let city_value = search.value;

    const city_api = `https://api.openweathermap.org/data/2.5/weather?q=${city_value}&units=metric&appid=${process.env.API_KEY}`;

    fetch(city_api).then((res) => {
      res.json().then((data) => {
        searched_location_temp(data);
      });
    });
  }
});

// Search on click
search_icon.addEventListener("click", () => {
  let city_value = search.value;

  const city_api = `https://api.openweathermap.org/data/2.5/weather?q=${city_value}&units=metric&appid=${process.env.API_KEY}`;

  fetch(city_api).then((res) => {
    res.json().then((data) => {
      searched_location_temp(data);
    });
  });
});

// Get temp for current location on click
location_icon.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    //console.log(position);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    const current_api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_KEY}`;

    fetch(current_api).then((res) => {
      res.json().then((data) => {
        current_location_temp(data);
      });
    });
  });
});

// Temp of current location
const current_location_temp = (data) => {
  // console.log(data);
  let country_abv = data["sys"]["country"];
  let country_name = country_code[country_abv];
  //console.log(country_name);
  temp.innerHTML =
    data["main"]["temp"] + '<span style="font-size: 4.15rem;">C</span>';
  desc.textContent = data["weather"][0]["description"];
  city.textContent = data["name"] + ", " + country_name;

  let id = parseInt(data["weather"][0]["id"]);
  let day_night = data["weather"][0]["icon"].slice(-1);

  var skycons = new Skycons({ color: "white" });
  skycons.add("icon", Skycons[getIcon(id, day_night)]);
  skycons.play();
};

// Temp of searched location
const searched_location_temp = (data) => {
  // console.log(data);
  let country_abv = data["sys"]["country"];
  let country_name = country_code[country_abv];
  //console.log(country_name);
  temp.innerHTML =
    data["main"]["temp"] + '<span style="font-size: 4.15rem;">C</span>';
  desc.textContent = data["weather"][0]["description"];
  city.textContent = data["name"] + ", " + country_name;

  let id = parseInt(data["weather"][0]["id"]);
  let day_night = data["weather"][0]["icon"].slice(-1);

  var skycons = new Skycons({ color: "white" });
  skycons.add("icon", Skycons[getIcon(id, day_night)]);
  skycons.play();
};

// Change temp unit
temp.addEventListener("click", () => {
  let t;
  const span = document.querySelector("#temp h3 span");
  // console.log(temp.textContent.slice(0, -1));
  if (span.textContent.slice(-1) == "C") {
    t = F(temp.textContent.slice(0, -1));
    temp.innerHTML = t.toFixed(2) + '<span style="font-size: 4.15rem;">F</span>';
  } else {
    t = C(temp.textContent.slice(0, -1));
    temp.innerHTML = t.toFixed(2) + '<span style="font-size: 4.15rem;">C</span>';
  }
});

// Change to Fahrenheit
const F = (temp) => {
  temp = parseFloat(temp);
  return (temp * 9) / 5 + 32;
};

// Change to Celsius
const C = (temp) => {
  temp = parseFloat(temp);
  return ((temp - 32) * 5) / 9;
};
