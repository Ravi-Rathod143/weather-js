const apiKey = "b2fa3271ab55c9c76e1b2a2d1afd0478";  // My provided API key

    // Function to fetch and display weather data
    function getWeatherData(city) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          // Check if city is not found
          if (data.cod === "404") {
            alert("City not found. Please check the name and try again.");
            return;
          }
          // Display weather data and update recent cities
          displayWeatherData(data);
          updateRecentCities(city);
        })
        .catch(error => {
          alert("Error fetching weather data. Please try again.");
        });
    }

    // Function to display weather data on the page
    function displayWeatherData(data) {
      const weatherData = document.getElementById('weatherData');
      weatherData.innerHTML = `
      <div class="bg-amber-300">
        <p class="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-800 to-pink-500">Weather in ${data.name}, ${data.sys.country}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="weather icon">
        </div>
      `;
       // Fetch the extended 5-day forecast for the city
      getExtendedForecast(data.name);
    }

    // Function to fetch the 5-day extended forecast for a city
    function getExtendedForecast(city) {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

      // Fetch forecast data
      fetch(url)
        .then(response => response.json())
        .then(data => {
          // Get the forecast data for the next 5 days
          const forecastData = data.list.slice(0, 5); // Get 5 day forecast
          // Display the extended forecast
          displayExtendedForecast(forecastData);
        })
        .catch(error => {
          alert("Error fetching extended forecast. Please try again.");
        });
    }

    // Function to display the 5-day extended forecast on the page
    function displayExtendedForecast(forecastData) {
      const extendedForecast = document.getElementById('extendedForecast');
      extendedForecast.innerHTML = `
        <h2 class="mb-5 text-xl font-semibold">5-Day Forecast</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 ">
          ${forecastData.map(day => `
            <div class="p-4 rounded-lg   shadow-md hover:shadow-lg hover:bg-blue-100">
              <p class="font-semibold">${new Date(day.dt * 1000).toLocaleDateString()}</p>
              <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="weather icon">
              <p>Temp: ${day.main.temp}°C</p>
              <p>Wind: ${day.wind.speed} m/s</p>
              <p>Humidity: ${day.main.humidity}%</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Function to fetch and display weather data based on the current location of the user
    function getWeatherByLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

           // Fetch weather data using coordinates
          fetch(url)
            .then(response => response.json())
            .then(data => {
              displayWeatherData(data);
              updateRecentCities(data.name);
            })
            .catch(error => {
              alert("Error fetching weather data. Please try again.");
            });
        }, error => {
          alert("Error getting location. Please enable location access.");
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }

   // Function to validate the city input before making a request
    function validateCity(city) {
      if (!city) {
        alert("City name cannot be empty.");
        return false;
      }
      return true;
    }

    // Function to update the recent cities in the local storage
    function updateRecentCities(city) {
      let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
      if (!recentCities.includes(city)) {
        recentCities.push(city);
      }
      localStorage.setItem('recentCities', JSON.stringify(recentCities));
      displayRecentCities();
    }

   // Function to display the recent cities dropdown from local storage
    function displayRecentCities() {
      const recentCitiesDropdown = document.getElementById('recentCitiesDropdown');
      const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];

      if (recentCities.length > 0) {
        recentCitiesDropdown.innerHTML = `
          <select id="recentCitiesSelect" class="w-3/4 p-2 border rounded-lg">
            <option value="" class="text-red-300">Recently Searched Cities</option>
            ${recentCities.map(city => `
              <option value="${city}">${city.toUpperCase()}</option>
            `).join('')}
          </select>
        `;

        document.getElementById('recentCitiesSelect').addEventListener('change', (e) => {
          const city = e.target.value;
          if (city) {
            getWeatherData(city);
          }
        });
      }
    }

    // Event listener for search button
    document.getElementById('searchBtn').addEventListener('click', () => {
      const city = document.getElementById('cityInput').value;
      if (validateCity(city)) {
        getWeatherData(city);
      }
    });

    // Event listener for enter key in search input
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
      if (e.key === "Enter") {
        const city = e.target.value;
        if (validateCity(city)) {
          getWeatherData(city);
        }
      }
    });



    

    // Event listener for current location button
    document.getElementById('currentLocationBtn').addEventListener('click', getWeatherByLocation);

    // Initialize recent cities on page load
    document.addEventListener('DOMContentLoaded', () => {
      displayRecentCities();
    });