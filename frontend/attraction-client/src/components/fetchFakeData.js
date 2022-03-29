
 const fetchFakeData = async centerCoordinates => {
    
    const API_KEY = "5ae2e3f221c38a28845f05b690c520033dc6de71c6665213ffad8752";
 
    let points = []; 
    let results = await getDataFromURL(getURL("radius", 1000, centerCoordinates.latitude, centerCoordinates.longitude, 100));
    for(let result of results)
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
            title: "",
            description: "",
            img: ""     
          }
        });
        console.log(result.xid)
        
    }
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

  return Promise.resolve({
    type: "FeatureCollection",
    features: points,
  });

};
  export default fetchFakeData;