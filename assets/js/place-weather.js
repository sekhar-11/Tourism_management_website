(() => {
  const destinations = {
    andhra: {
      tirupati: [13.6288, 79.4192],
      tirupathi: [13.6288, 79.4192],
      vijayawada: [16.5062, 80.648],
      vizag: [17.6868, 83.2185],
      srisailam: [16.074, 78.868],
      lepakshi: [13.801, 77.605],
      araku: [18.3273, 82.88],
      amaravati: [16.5745, 80.3575],
      amaravathi: [16.5745, 80.3575],
      horsley: [13.65, 78.4],
      horesyhils: [13.65, 78.4],
    },
    goa: {
      beaches: [15.555, 73.751],
      historical: [15.5009, 73.911],
      natural: [15.314, 74.314],
      flea: [15.573, 73.741],
      nightlife: [15.555, 73.751],
      wildlife: [15.345, 74.26],
      old: [15.5009, 73.911],
    },
    karnataka: {
      bangalore: [12.9716, 77.5946],
      bengalore: [12.9716, 77.5946],
      mysore: [12.2958, 76.6394],
      coorg: [12.4244, 75.7382],
      hampi: [15.335, 76.46],
      chikmagalur: [13.3161, 75.772],
      gokarna: [14.5479, 74.3188],
      udupi: [13.3409, 74.7421],
      jog: [14.229, 74.81],
      bijapur: [16.8302, 75.71],
    },
    kerala: {
      thiruvananthapuram: [8.5241, 76.9366],
      kollam: [8.8932, 76.6141],
      pathanamthitta: [9.2648, 76.787],
      alappuzha: [9.4981, 76.3388],
      kottayam: [9.5916, 76.5222],
      idukki: [9.8494, 76.972],
      ernakulam: [9.9816, 76.2999],
      thrissur: [10.5276, 76.2144],
      palakkad: [10.7867, 76.6548],
      malappuram: [11.051, 76.0711],
      kannur: [11.8745, 75.3704],
    },
    tamil: {
      chennai: [13.0827, 80.2707],
      mahabalipuram: [12.6269, 80.1927],
      kanchipuram: [12.8342, 79.7036],
      pondicherry: [11.9416, 79.8083],
      madura: [9.9252, 78.1198],
      rameswaram: [9.2876, 79.3129],
      kanyakumari: [8.0883, 77.5385],
      thanjavur: [10.787, 79.1378],
      ooty: [11.4102, 76.695],
      kodaikanal: [10.2381, 77.4892],
    },
    telangana: {
      charminar: [17.3616, 78.4747],
      warangal: [17.9689, 79.5941],
      medak: [18.0453, 78.2608],
      pakhal: [17.968, 79.998],
      kuntala: [19.123, 78.49],
      nagarjuna: [16.574, 79.312],
    },
  };

  const stateNames = {
    "andhra-pradesh": "andhra",
    goa: "goa",
    karnataka: "karnataka",
    kerala: "kerala",
    "tamil-nadu": "tamil",
    telangana: "telangana",
  };
  const weatherCache = new Map();
  const weatherDescriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  function normalize(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function getPageState() {
    const stateFolder = window.location.pathname.split("/").filter(Boolean).slice(-2, -1)[0];
    return stateNames[stateFolder] || "";
  }

  function getCoordinates(state, title) {
    const places = destinations[state];
    const key = normalize(title);
    if (!places) return undefined;
    if (places[key]) return places[key];
    return Object.entries(places).find(([name]) => key.includes(name) || name.includes(key))?.[1];
  }

  function describeWeather(code) {
    return weatherDescriptions[code] || "Conditions unavailable";
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function addForecastDay(container, date, code, high, low, rain) {
    const row = createElement("div", "place-weather-day");
    const label = createElement("strong", "", date);
    const description = createElement("span", "", describeWeather(code));
    const temperatures = createElement(
      "span",
      "",
      `${Math.round(low)}–${Math.round(high)} °C`
    );
    const rainChance = rain == null ? "" : `Rain ${Math.round(rain)}%`;
    row.append(label, description, temperatures);
    if (rainChance) row.append(createElement("span", "", rainChance));
    container.append(row);
  }

  async function fetchForecast(latitude, longitude) {
    const cacheKey = `${latitude},${longitude}`;
    if (!weatherCache.has(cacheKey)) {
      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.search = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: "temperature_2m,apparent_temperature,weather_code",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        forecast_days: "5",
        timezone: "auto",
      }).toString();
      const request = fetch(url).then(async (response) => {
        if (!response.ok) {
          throw new Error(`Weather service returned ${response.status}.`);
        }
        return response.json();
      });
      weatherCache.set(cacheKey, request);
    }

    try {
      return await weatherCache.get(cacheKey);
    } catch (error) {
      weatherCache.delete(cacheKey);
      throw error;
    }
  }

  async function showForecast(card, placeName, coordinates, status, forecast) {
    status.textContent = "Loading local forecast…";
    status.classList.remove("place-weather-error");
    forecast.hidden = false;
    forecast.replaceChildren();

    try {
      const data = await fetchForecast(coordinates[0], coordinates[1]);
      if (!data.current || !data.daily || !Array.isArray(data.daily.time)) {
        throw new Error("Weather data is incomplete.");
      }

      const current = createElement(
        "p",
        "place-weather-current",
        `${placeName}: ${Math.round(data.current.temperature_2m)} °C, ${describeWeather(
          data.current.weather_code
        )} (feels like ${Math.round(data.current.apparent_temperature)} °C)`
      );
      forecast.append(current);
      data.daily.time.forEach((date, index) => {
        addForecastDay(
          forecast,
          date,
          data.daily.weather_code[index],
          data.daily.temperature_2m_max[index],
          data.daily.temperature_2m_min[index],
          data.daily.precipitation_probability_max?.[index]
        );
      });
      const attribution = document.createElement("a");
      attribution.className = "place-weather-attribution";
      attribution.href = "https://open-meteo.com/";
      attribution.target = "_blank";
      attribution.rel = "noreferrer";
      attribution.textContent = "Weather data by Open-Meteo";
      forecast.append(attribution);
      status.textContent = `Five-day forecast for ${placeName}`;
      card.dataset.weatherLoaded = "true";
    } catch (error) {
      forecast.hidden = true;
      status.textContent =
        error instanceof Error ? error.message : "Could not load the weather forecast.";
      status.classList.add("place-weather-error");
    }
  }

  function makeWeatherWidget(card, placeName, coordinates) {
    const wrapper = createElement("div", "place-weather");
    const button = createElement("button", "place-weather-toggle");
    button.type = "button";
    button.setAttribute("aria-expanded", "false");
    const icon = createElement("span", "", "☀");
    icon.setAttribute("aria-hidden", "true");
    button.append(icon, document.createTextNode(" 5-day weather"));

    const status = createElement("p", "place-weather-status");
    status.setAttribute("aria-live", "polite");
    const forecast = createElement("div", "place-weather-forecast");
    forecast.hidden = true;

    button.addEventListener("click", async () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        button.setAttribute("aria-expanded", "false");
        forecast.hidden = true;
        return;
      }

      button.setAttribute("aria-expanded", "true");
      await showForecast(card, placeName, coordinates, status, forecast);
      if (forecast.hidden) button.setAttribute("aria-expanded", "false");
    });

    wrapper.append(button, status, forecast);
    return wrapper;
  }

  function prepareCard(card, state) {
    const heading = card.querySelector("h2");
    const image = card.querySelector("img");
    const description = card.querySelector(".des0") || card.querySelector("p");
    if (!heading || !image || !description) return;

    const placeName = heading.textContent.trim();
    const coordinates = getCoordinates(state, placeName);
    if (!coordinates) {
      console.warn(`No weather coordinates configured for ${state}: ${placeName}`);
      return;
    }

    card.classList.add("place");
    description.classList.add("des0");

    let actions = card.querySelector(":scope > .place-actions");
    if (!actions) {
      actions = createElement("div", "place-actions");
      const details = card.querySelector(":scope > .details");
      if (details) {
        details.before(actions);
      } else {
        card.append(actions);
      }
    }

    const bookLink = card.querySelector(":scope > a.book-btn");
    if (bookLink) {
      actions.append(bookLink);
    } else {
      const link = createElement("a", "book-btn", "Book Now");
      link.href = `travel.html?place=${encodeURIComponent(placeName)}`;
      actions.append(link);
    }

    const moreButton = card.querySelector(":scope > button.more-btn");
    if (moreButton) {
      actions.append(moreButton);
    } else if (card.matches("article")) {
      const extraDetails = createElement(
        "div",
        "place-extra-details",
        card.dataset.details || description.textContent.trim()
      );
      extraDetails.hidden = true;
      const button = createElement("button", "more-btn", "More Info");
      button.type = "button";
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        extraDetails.hidden = !extraDetails.hidden;
        button.setAttribute("aria-expanded", String(!extraDetails.hidden));
      });
      actions.append(button);
      actions.after(extraDetails);
    }

    if (!card.querySelector(":scope > .place-weather")) {
      card.append(makeWeatherWidget(card, placeName, coordinates));
    }
  }

  const state = getPageState();
  const cards = document.querySelectorAll(
    "#places .place, #places .places article, main .places article"
  );
  cards.forEach((card) => prepareCard(card, state));

  document.querySelectorAll("#places .w-loc, #places .weatherIcon").forEach((element) => {
    element.remove();
  });
})();
