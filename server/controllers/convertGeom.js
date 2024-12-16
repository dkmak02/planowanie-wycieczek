const fs = require("fs").promises;
const wkx = require("wkx");

const decodeAllData = async (data) => {
  for (const item of data) {
    for (const path of item.path) {
      if (path.geom_way) {
        const wkbBuffer = Buffer.from(path.geom_way, 'hex');
        const geometry = wkx.Geometry.parse(wkbBuffer);
        path.geoJSON = geometry.toGeoJSON();
      }
    }
  }
  return data; 
};

exports.decodeAllData = decodeAllData;
