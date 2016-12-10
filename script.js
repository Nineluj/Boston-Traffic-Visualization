function csvtojson(csv){
    
};

function render(jsonData, filterYearF, createLocF){
    var locId = jsonData.filter(filterYearF).map(createLocF);
    new MapPlace({
        locations: locId,
        type: 'polyline'
    }).Load();
};
