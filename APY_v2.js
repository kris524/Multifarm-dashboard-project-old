// import Compound from '@compound-finance/compound-js';// const Compound = new Compound(window.ethereum)
// const Compound = require('@compound-finance/compound-js');
// import { writeFileSync } from 'fs';
const fs = require('fs');

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

Date.prototype.backMonth = function (months) {
  var date = new Date(this.valueOf());
  date.setMonth(date.getMonth() - months);
  return date;
}

function getDates(startDate, stopDate) {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
}

////////////////////////////////////////////////////////////
const xAxis = getDates((new Date()).backMonth(1), new Date());  //32

let converted_xAxis = []

console.log(xAxis.length)
for (let i = 0; i < xAxis.length; i++) {
  let a = xAxis[i].toLocaleDateString()
  // console.log(a)
  converted_xAxis.push(a)
}
console.log()
///////////////////////////////////////////////////////////

const provider = 'https://mainnet.infura.io/v3/114f1662f8744eb7ab048928673b60fb' //'https://mainnet.infura.io/v3/' + process.env.infuraApiKey;

const cTokenToGetCompApy = Compound.cUSDC; // Pick an asset

const underlying = cTokenToGetCompApy.slice(1, 10);
const underlyingDecimals = Compound.decimals[underlying];
const cTokenDecimals = 8; // always 8
const comptroller = Compound.util.getAddress(Compound.Comptroller);
const opf = Compound.util.getAddress(Compound.PriceFeed);
const cTokenAddr = Compound.util.getAddress(cTokenToGetCompApy);
const apxBlockSpeedInSeconds = 13.15;


// this is my array
//

let yValues = [
  0.7024917496939231, 0.7024917496939231,
  0.7024917455479285, 0.7024917455479285,
  0.7024917372640882, 0.7024917372640882,
  0.7024917248261042, 0.7024917123881202,
  0.7024916958123129, 0.7024916875203235,
  0.7024916833743289, 0.7024916792283342,
  0.7024916792283342, 0.7024916750823396,
  0.7024916709363449, 0.7024916667903502,
  0.7024916667903502, 0.7024916585065322,
  0.7024763500280917, 0.7024763375901077,
  0.7024763334441131, 0.7024763292981184,
  0.7024763168601345, 0.702476312722311,
  0.702476312722311, 0.7024763002843271,
  0.7024763002843271, 0.7024762961383324,
  0.7024762837003484, 0.7024762837003484,
  0.7024762837052673, 0.7024762837045753
]
// module.exports = {Student};
async function Calculate_APY() {



  let compSpeedSupply = await Compound.eth.read(
    comptroller,
    'function compSupplySpeeds(address cToken) public returns (uint)',
    [cTokenAddr],
    { provider }
  );

  let compSpeedBorrow = await Compound.eth.read(
    comptroller,
    'function compBorrowSpeeds(address cToken) public returns (uint)',
    [cTokenAddr],
    { provider }
  );

  let compPrice = await Compound.eth.read(
    opf,
    'function price(string memory symbol) external view returns (uint)',
    [Compound.COMP],
    { provider }
  );

  let assetPrice = await Compound.eth.read(
    opf,
    'function price(string memory symbol) external view returns (uint)',
    [underlying],
    { provider }
  );

  let totalBorrows = await Compound.eth.read(
    cTokenAddr,
    'function totalBorrowsCurrent() returns (uint)',
    [],
    { provider }
  );

  let totalSupply = await Compound.eth.read(
    cTokenAddr,
    'function totalSupply() returns (uint)',
    [],
    { provider }
  );

  let exchangeRate = await Compound.eth.read(
    cTokenAddr,
    'function exchangeRateCurrent() returns (uint)',
    [],
    { provider }
  );

  // Total supply needs to be converted from cTokens
  const mantissa = 18 + parseInt(underlyingDecimals) - cTokenDecimals;
  exchangeRate = +exchangeRate.toString() / Math.pow(10, 18);

  compSpeedSupply = compSpeedSupply / 1e18; // COMP has 18 decimal places
  compSpeedBorrow = compSpeedBorrow / 1e18; // COMP has 18 decimal places
  compPrice = compPrice / 1e6;  // price feed is USD price with 6 decimal places
  assetPrice = assetPrice / 1e6;
  totalBorrows = +totalBorrows.toString() / (Math.pow(10, underlyingDecimals));
  totalSupply = (+totalSupply.toString() * exchangeRate) / (Math.pow(10, underlyingDecimals));

  // console.log('compSpeedSupply:', compSpeedSupply);
  // console.log('compSpeedBorrow:', compSpeedBorrow);
  // console.log('compPrice:', compPrice);
  // console.log('assetPrice:', assetPrice);
  // console.log('totalBorrows:', totalBorrows);
  // console.log('totalSupply:', totalSupply);
  // console.log('exchangeRate:', exchangeRate);

  const compPerDaySupply = compSpeedSupply * parseInt((60 * 60 * 24) / apxBlockSpeedInSeconds);
  const compPerDayBorrow = compSpeedBorrow * parseInt((60 * 60 * 24) / apxBlockSpeedInSeconds);

  const compSupplyApy = 100 * (Math.pow((1 + (compPrice * compPerDaySupply / (totalSupply * assetPrice))), 365) - 1);
  const compBorrowApy = 100 * (Math.pow((1 + (compPrice * compPerDayBorrow / (totalBorrows * assetPrice))), 365) - 1);

  // console.log('COMP Supply APY %:', compSupplyApy);
  // console.log('COMP Borrow APY %:', compBorrowApy);
  return compSupplyApy


}

var canvas = document.getElementById('updating-chart');

var ctx = canvas.getContext('2d');
var dat = {
  labels: converted_xAxis,
  datasets: [
    {
      label: "My First dataset",
      fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)",
      data: yValues
    },

  ]
};
var myLiveChart = new Chart(ctx, {

  type: 'line',
  data: dat
});

function addData(chart, data) {
  // chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(data);
    dataset.data.shift()
  });
  chart.update();
}
const new_datapoint = await Calculate_APY();
console.log(new_datapoint)
console.log(yValues)

addData(myLiveChart, await Calculate_APY())
console.log(yValues)


var columns = converted_xAxis;
var rows = yValues;
var result = rows.reduce(function (result, field, index) {
  result[columns[index]] = field;
  return result;
}, {})

console.log(result);

const filePath = 'data.json';
try {
  fs.writeFileSync(filePath, JSON.stringify(result, null, 2), 'utf8');
  console.log("The file was saved!");
}
catch (err) {
  console.err("An error has ocurred when saving the file.");
}