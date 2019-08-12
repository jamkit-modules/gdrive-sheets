GDriveSheets = (function() {
    return {};
})();

GDriveSheets.feed_to_data = function(feed) {
    var entry = feed["feed"]["entry"];
    var headers = GDriveSheets.get_headers(feed);
    var data = [];

    for (var i = headers.length; i < entry.length; i = i + headers.length) {
        var datum = {};

        for (var h = 0; h < headers.length; ++h) {
            datum[headers[h]] = entry[i + h]["content"]["$t"]
        }

        data.push(datum);
    }

    return data;
}

GDriveSheets.get_headers = function(feed) {
    var entry = feed["feed"]["entry"];
    var headers = [];

    for (var i = 0; i < entry.length; i++) {
        if (entry[i]["gs$cell"]["row"] !== "1") {
            break;
        }

        headers.push(entry[i]["content"]["$t"]);
    }

    return headers;
}

GDriveSheets.get_feed_url = function(sheet_key, sheet_no) {
    var path = sheet_key + "/" + (sheet_no || 1).toString();

    return "https://spreadsheets.google.com/feeds/cells/" + path + "/public/full?alt=json";
}

__MODULE__ = GDriveSheets;
