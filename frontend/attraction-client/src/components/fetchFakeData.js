/**
 * A complete Coordinate Pair consisting of a latitude and longitude
 * @typedef {Object} CoordinatePair
 * @property {number} longitude - longitude coordinate
 * @property {number} latitude - latitude coordinate
 */

/**
 * Generates a GeoJSON FeatureCollection of random points based on
 * the center coordinates passed in.
 * @param {CoordinatePair} centerCoordinates - the {@link CoordinatePair} for the map center
 * @return {results} GeoJSON FeatureCollection
 */
 const fetchFakeData = centerCoordinates => {
    
    const API_KEY = "5ae2e3f221c38a28845f05b690c520033dc6de71c6665213ffad8752";

    getDataFromAPI();
    
  function getURL(method, radius, lat, lon, limit)
  {
    return `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${API_KEY}&radius=${radius}&limit=${limit}&offset=0&lon=${lon}&lat=${lat}&rate=2&format=json`;
  }

  async function getDataFromURL(url)
  {
    let result = await fetch(url);
    let answer = null;
    if(result.ok)
      answer = await result.json();
    return answer;
  }

  async function getDataFromAPI()
  {
      let result = await getDataFromURL(getURL("radius", 10000, "46.7217851", "11.6615276", 100));
      console.log(result);
  }



    /*const newFeaturesList = [];
    for (let i = 0; i < 20; i++) {
      const id = i;
      const { longitude, latitude } = getRandomCoordinate(centerCoordinates);
      newFeaturesList.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        properties: {
          id,
          name: `Random Point #${id}`,
          description: `description for Random Point #${id}`
        }
      });
    }
  
    return Promise.resolve({
      type: "FeatureCollection",
      features: newFeaturesList
    });
  };
  
  /**
   * Generates a random point within 0.025 radius of map center coordinates.
   * @param {CoordinatePair} centerCoordinates - the {@link CoordinatePair} for the map center
   * @return {CoordinatePair} randomly generated coordinate pair
   */
};
  export default fetchFakeData;