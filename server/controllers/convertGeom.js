const fs = require("fs").promises;
const wkx = require("wkx");
const decodeWKBData = async (filePath, outputFilePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const jsonData = JSON.parse(data);

    for (let item of jsonData) {
      for (let path of item.path) {
        if (path.geom_way) {
          const wkbBuffer = Buffer.from(path.geom_way, "hex");

          const geometry = wkx.Geometry.parse(wkbBuffer);

          const geoJSON = geometry.toGeoJSON();

          path.geoJSON = geoJSON;
        }
      }
    }

    await fs.writeFile(
      outputFilePath,
      JSON.stringify(jsonData, null, 2),
      "utf8"
    );
    console.log(`File saved to ${outputFilePath}`);
  } catch (err) {
    console.error("Error processing the file:", err);
  }
};

const inputFilePath = "./../filteredData.json";
const outputFilePath = "output.json";
decodeWKBData(inputFilePath, outputFilePath);
