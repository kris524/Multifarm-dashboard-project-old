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

const xAxis = getDates((new Date()).backMonth(1), new Date());  //32

let converted_xAxis = []

console.log(xAxis.length)
for (let i = 0; i < xAxis.length; i++) {
    let a = xAxis[i].toLocaleDateString()
    // console.log(a)
    converted_xAxis.push(a)
}
console.log(converted_xAxis)

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
    0.7024762837003484

]

let yValues_2 = [
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
    0.7024762837003484, 0.6934134352435421,
    0.4534524234235466

]

console.log(data)
const fs = require('fs');

var columns = converted_xAxis;
var rows = yValues_2;
var result = rows.reduce(function (result, field, index) {
    result[columns[index]] = field;
    return result;
}, {})

// console.log(result);

const filePath = 'data.js';
const fileObject = result

// Do something with file

try {
    fs.writeFileSync(filePath, JSON.stringify(fileObject, null, 2), 'utf8');
    console.log("The file was saved!");
}
catch (err) {
    console.err("An error has ocurred when saving the file.");
}