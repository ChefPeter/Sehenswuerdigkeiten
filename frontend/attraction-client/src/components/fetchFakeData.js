
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
      console.log(result)
      return result;
  }

};
  export default fetchFakeData;