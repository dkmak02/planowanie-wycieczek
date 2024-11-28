const fs = require("fs").promises;
const wkx = require("wkx");

const decodeFilteredData = async (inputFilePath, outputFilePath) => {
  try {
    // Read the input JSON file
    const data = await fs.readFile(inputFilePath, "utf8");
    const jsonData = JSON.parse(data);

    // Extract and decode filteredData
    if (jsonData.data && jsonData.data.filteredData) {
      for (const item of jsonData.data.filteredData) {
        for (const path of item.path) {
          if (path.geom_way) {
            // Decode geom_way using WKB and convert to GeoJSON
            const wkbBuffer = Buffer.from(path.geom_way, "hex");
            const geometry = wkx.Geometry.parse(wkbBuffer);
            path.geoJSON = geometry.toGeoJSON();
          }
        }
      }
    }

    // Write the updated JSON back to a new file
    await fs.writeFile(
      outputFilePath,
      JSON.stringify(jsonData, null, 2),
      "utf8"
    );
    console.log(`Decoded file saved to ${outputFilePath}`);
  } catch (err) {
    console.error("Error processing the file:", err);
  }
};

// File paths
const inputFilePath = "./../filteredData.json"; // Change this to the path of your input file
const outputFilePath = "./output.json"; // Change this to the desired output file

// Execute the decoding function
decodeFilteredData(inputFilePath, outputFilePath);
