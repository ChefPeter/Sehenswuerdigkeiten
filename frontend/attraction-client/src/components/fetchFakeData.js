const fetchFakeData = async centerCoordinates => {
  async function getDataFromURL(url) {
      let result = await fetch(url);
      let answer = null;
      if (result.ok)
          answer = await result.json();
      return answer;
  }

  function getURL(radius, lat, lon, filterLink, limit, fame = "3") {
    let filterAttributeLink = `kinds=${Object.keys(filterLink).filter(function(x) { return filterLink[x]; }).join(',')}`;
    /*let filterAttributeLink = "kinds=";
    Object.keys(filterLink).forEach(function(k){
        if(filterLink[k] == true){
            if(filterAttributeLink.charAt(filterAttributeLink.length - 1) != "=")
                filterAttributeLink+=","+k;
            else
                filterAttributeLink+=k;
        }
    });
    console.log(filterAttributeLink);*/
    //docs https://opentripmap.io/docs#/Objects%20list/getListOfPlacesByRadius
    if(filterAttributeLink.length>8)
        return `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&rate=${fame}&${filterAttributeLink}&format=json&limit=${limit}&apikey=${API_KEY}`
    
    return "";
      //Old URL
      //return `https://api.opentripmap.com/0.1/en/places/${method}?apikey=${API_KEY}&radius=${radius}&limit=${limit}&offset=0&lon=${lon}&lat=${lat}&rate=2&format=json`;
  }

  const API_KEY = process.env.TRIPMAP_API_KEY;

  let points = [];

  let url = getURL(centerCoordinates.radius2*1000, centerCoordinates.latitude, centerCoordinates.longitude, centerCoordinates.filterToUse, 500);
  if(url === "")
    return {type: "FeatureCollection",features: [],};
  //FETCHING DATA HERE
  let results = await getDataFromURL(url);
  
  results = results.filter((item, index, self) => index === self.findIndex((x) => (x.wikidata === item.wikidata)));
 
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
              kinds: result.kinds,
          }
      });
  }

  return Promise.resolve({
      type: "FeatureCollection",
      features: points,
  });

};
export default fetchFakeData;