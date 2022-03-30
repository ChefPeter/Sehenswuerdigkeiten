const fetchFakeData = async centerCoordinates => {
  async function getDataFromURL(url) {
      let result = await fetch(url);
      let answer = null;
      if (result.ok)
          answer = await result.json();
      return answer;
  }

  function getURL(radius, lat, lon, limit, fame = "3h") {
      return `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&rate=${fame}&format=json&limit=${limit}&apikey=${API_KEY}`;
      //Old URL
      //return `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${API_KEY}&radius=${radius}&limit=${limit}&offset=0&lon=${lon}&lat=${lat}&rate=2&format=json`;
  }

  const API_KEY = "5ae2e3f221c38a28845f05b690c520033dc6de71c6665213ffad8752";

  let points = [];
  let results = await getDataFromURL(getURL(centerCoordinates.radius2*1000, centerCoordinates.latitude, centerCoordinates.longitude, 500));
  results = results.filter((item, index, self) =>
  index === self.findIndex((x) => (x.wikidata === item.wikidata)));

  for (let result of results)
  {
      const lon = result.point.lon;
      const lat = result.point.lat;
      points.push({
          type: "Feature",
          geometry: {
              type: "Point",
              coordinates: [lon, lat],
          },
          properties: {
              id: result.xid,
              name: result.name,
              wikidata: result.wikidata,
          }
      });
  }

  return Promise.resolve({
      type: "FeatureCollection",
      features: points,
  });

};
export default fetchFakeData;