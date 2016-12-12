var google_api_key = "AIzaSyA1sTSBZ4aPEDoxab_RYiEj1T1TxlVj384";
var gapi_add_ini = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var gapi_add_fin = "+boston+ma&key=" + google_api_key;

//http://mhd.ms2soft.com/tcds/tsearch.asp?loc=Mhd&mod=
//http://mhd.ms2soft.com/tcds/ajax/tcds_tdetail_vol.asp?offset=0&agency_id=96&local_id=R12115&sdate=&hide_detail=&curTime=11/29/2016%2012:21:29%20PM&ajax_time=1480440092705

var mdot_add_ini = "http://mhd.ms2soft.com/tcds/ajax/tcds_tdetail_vol.asp?offset=0&agency_id=96&local_id=";
var mdot_add_fin = "&sdate=&hide_detail=&curTime=11/29/2016%2012:21:29%20PM&ajax_time=1480440092705";

var station_counts = [];

//findlocation(stations[0], function(x, y){console.log(x); console.log(y);})
function parseStation(station){
  var place = station.On.trim().replace(" ", "+");
  $.get(gapi_add_ini + place + gapi_add_fin,
        function(data){
          addStation(station["Loc ID"],
                     data.results[0].geometry.location.lat,
                     data.results[0].geometry.location.lng);
          parseVCount(station);
        });
}

function parseVCount(station){
  $.get(mdot_add_ini + station["Loc ID"] + mdot_add_fin,
        function(data){
          var trs = $.parseHTML(data)[3].childNodes[1].childNodes;
          if(trs.length > 8){
            for(var i = 4; i < (trs.length - 4); i = i + 2){
              addVCount(station["Loc ID"],
                        trs[i].cells[1].innerHTML,
                        trs[i].cells[3].innerHTML);
            }
          }
        });
}

function addVCount(id, date, count){
  var data = {};
  data.date = date;
  data.count = count;
  for(var i = 0; i < station_counts.length; i++){
    if(station_counts[i].id == id){
      station_counts[i].data.push(data);
    }
  }
}

function containStation(id){
  for(var station in station_counts){
    if(station.id == id){
      return true;
    }
  }
  return false;
}

function addStation(id, lat, lng){
  var station = {};
  station.id = id;
  station.lat = lat;
  station.lng = lng;
  station.data = [];
  station_counts.push(station);
}

function parseAll(stations){
  for(var i = 0; i < stations.length; i++){
    parseStation(stations[i]);
  }
}

var parsedI = 0;
function delayParse(){
  if(parsedI < stations.length){
    parseStation(stations[parsedI]);
    parsedI++;
  } else {
    stopDelayedParse();
    console.log(station_counts);
  }
}

var parID = 0;
function startDelayedParse(){
  parID = setInterval(delayParse, 500);
}

function stopDelayedParse(){
  clearInterval(parID);
}

function filterEmpty(stations){
  return stations.filter(function(station){
                           return (station.data.length > 0);
                         });
}

function build1dlist(stations){
  var odlist = [];
  for(var i = 0; i < stations.length; i++){
    for(var j = 0; j < stations[i].data.length; j++){
      var odstation = {};
      odstation.id = stations[i].id;
      odstation.lat = stations[i].lat;
      odstation.lng = stations[i].lng;
      odstation.date = stations[i].data[j].date;
      odstation.count = stations[i].data[j].count;
      odlist.push(odstation);
    }
  }
  return odlist;
}

function filterYear(year, foldedstation){
  return foldedstation.filter(
           function(st){
             return (new Date(st.date).getFullYear()) == year;
           });
}

function getMostRecent(year, stations){
  return stations.reduce(
    function(los, sta){
      var fls = build1dlist([sta]);
      for(var i = year; i > 1990; i--){
        var fis = filterYear(i, fls);
        if(fis.length > 0){
          var s = {};
          s.id = fis[0].id;
          s.lat = fis[0].lat;
          s.lng = fis[0].lng;
          s.date = fis[0].date;
          s.count = fis.reduce(function(a, b){return a + parseInt(b.count);}, 0) / fis.length;
          los.push(s);
          return los;
        }
      }
      return los;
    },
    []);
}

function toCSV(stations){
  return "id,lat,lng,date,count\n" + ConvertToCSV(stations);
}

function ConvertToCSV(objArray) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';

            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','

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

function createDownloadCSV(yearbegin, yearend){
  for(var i = yearbegin; i < yearend; i++){
    download(i + "traffic.csv", toCSV(getMostRecent(i, station_filtered)));
  }
}
