const https = require("https");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const getPackageLatestVersion = async () => {
  return new Promise((resolve, reject) => {
    https
      .get(`https://registry.npmjs.org/@market-compass/common-factory-next`, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          try {
            resolve(JSON.parse(data)["dist-tags"]["latest"]);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

const updatePackageJson = () => {
  //read package.json

  getPackageLatestVersion().then((v) => {
    try {
      const packageJson = JSON.parse(
        fs.readFileSync("./package.json", { encoding: "utf8" })
      );
      const currentVer = v;
      const currentVerNum = Number(currentVer.split(".").join(""));
      const newVerNum = currentVerNum + 1;
      const newVer = String(newVerNum).split("").join(".");
      //write package.json if needed
      fs.writeFileSync(
        "./package.json",
        JSON.stringify({ ...packageJson, version: newVer })
      );
    } catch (err) {
      console.log(err);
    }
  });
};

updatePackageJson();
