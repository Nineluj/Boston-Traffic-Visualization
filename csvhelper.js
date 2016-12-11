function toCSV(stations){
  return "id,lat,lng,date,count\n" + ConvertToCSV(stations);
}

function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '')
                line += ','
            line += array[i][index];
        }
        str += line + '\n';
    }

    return str;
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function createDownloadCSV(yearbegin, yearend) {
    for (var i = yearbegin; i < yearend; i++) {
        download(i + "traffic.csv", toCSV(getMostRecent(i, station_filtered)));
    }
}