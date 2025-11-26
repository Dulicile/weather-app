function createWidget(id) {
  const widget = document.createElement('div');
  widget.className = 'weather-widget';
  widget.innerHTML = `
    <label>Широта <input type="number" step="any" class="lat"></label>
    <label>Долгота <input type="number" step="any" class="lon"></label>
    <button class="showWeather">Показать погоду</button>
    <div class="result"></div>
    <div class="map"></div>
  `;

  widget.querySelector('.showWeather').onclick = async function() {
    const lat = parseFloat(widget.querySelector('.lat').value);
    const lon = parseFloat(widget.querySelector('.lon').value);
    const result = widget.querySelector('.result');
    const mapDiv = widget.querySelector('.map');
    result.innerHTML = '';
    mapDiv.innerHTML = '';
    if (
      isNaN(lat) || isNaN(lon) ||
      lat < -90 || lat > 90 ||
      lon < -180 || lon > 180
    ) {
      result.innerHTML = `<span class="error">Некорректные координаты!</span>`;
      return;
    }
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await response.json();
      const w = data.current_weather;
      let iconSrc = 'assets/sun.png';
      if (w.weathercode >=2 && w.weathercode<=3) iconSrc = 'assets/cloud.png';
      if (w.weathercode >= 51) iconSrc = 'assets/rain.png';
      result.innerHTML = `
        <img src="${iconSrc}" alt="Погода"> ${w.temperature}&deg;C<br>
        Ветер: ${w.windspeed} м/с<br>
        Время: ${w.time}<br>
      `;
      showMap(lat, lon, mapDiv);
    } catch {
      result.innerHTML = `<span class="error">Ошибка получения погоды</span>`;
    }
  };
  return widget;
}

function showMap(lat, lon, mapDiv) {
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.05},${lat-0.03},${lon+0.05},${lat+0.03}&layer=mapnik&marker=${lat},${lon}`;
  mapDiv.innerHTML = `
    <iframe
      width="320"
      height="220"
      frameborder="0"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
      src="${url}">
    </iframe>
  `;
}

document.getElementById('addWidget').onclick = () => {
  document.getElementById('widgets').appendChild(createWidget(Date.now()));
};
document.getElementById('widgets').appendChild(createWidget(1));
