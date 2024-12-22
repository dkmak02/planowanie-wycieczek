const fs = require("fs").promises;
const wkx = require("wkx");
const lz = require("lz-string");

const decodeAllData = async (data) => {
  for (const item of data) {
    for (const path of item.path) {
      if (path.geom_way) {
        const wkbBuffer = Buffer.from(path.geom_way, 'hex');
        const geometry = wkx.Geometry.parse(wkbBuffer);
        path.geoJSON = geometry.toGeoJSON(); 
        delete path.geom_way; 
      }
      for (const key of Object.keys(path)) {
        if (key !== "geoJSON" && typeof path[key] === "string") {
          path[key] = lz.compressToUTF16(path[key]);
        }
      }
    }
  }
  return data;
};

exports.decodeAllData = decodeAllData;
