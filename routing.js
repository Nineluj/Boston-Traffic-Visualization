function getfromCSV(fileurl, storage) {
    $.get(fileurl, function (r) {
        var f9 = JSON.parse(CSV2JSON(r));
        for (var i in f9) {
            var req = {origin: {lat: +f9[i].PICKUPLAT, lng: +f9[i].PICKUPLONG}, destination: {lat: +f9[i].DROPLAT, lng: +f9[i].DROPLONG}, travelMode: "DRIVING"};
            directionsService.route(req, function (resp, status) {
                if (status == "OK") {
                    console.log("Sotring data");
                    storage.push(resp);
                } else {
                    console.log(status);
                }
            });
        }
    });
}
