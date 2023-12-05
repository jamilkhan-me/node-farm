const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = temp.replace(/{%IMAGE%}/g, product.image);
  output = temp.replace(/{%PRICE%}/g, product.price);
  output = temp.replace(/{%FROM%}/g, product.from);
  output = temp.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = temp.replace(/{%QUANTITY%}/g, product.quantity);
  output = temp.replace(/{%DESCRIPTION%}/g, product.description);
  output = temp.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = temp.replace(/{$NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

//Creating server
const server = http.createServer((req, res) => {
  const pathName = req.url;
  //Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    console.log(output);

    res.end(output);

    //product page
  } else if (pathName === "/products") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(tempProduct);
    //API
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end("This is the contact page");
    //Not found page
  } else {
    res.end("Page not found");
  }
});

//Listening to the server
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to the request on port 8000");
});