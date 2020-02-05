GDriveSheets = (function() {
    return {};
})();

GDriveSheets.fetch_data = function(sheet_key, sheet_no) {
    return new Promise(function(resolve, reject) {
        var url = GDriveSheets.get_feed_url(sheet_key, sheet_no);
	
        fetch(url).then(function(response) {
            if(response.ok) {
                response.json().then(function(feed) {
                    resolve(GDriveSheets.feed_to_data(feed));
                }, function() {
                    reject();
                });
            } else {
                reject();
            }
        }, function() {
            reject();
        });
    });
}

GDriveSheets.feed_to_data = function(feed) {
    var headers = GDriveSheets.get_headers(feed);
    var entry = feed["feed"]["entry"].slice(headers.length);
    var data = [], datum = {}, row = "2";

    for (var i = 0; i < entry.length; ++i) {
        var cell = entry[i]["gs$cell"];

        if (cell["row"] !== row) {
            data.push(datum), datum = {}, row = cell["row"];
        }

        var col = parseInt(cell["col"]);

        if (col - 1< headers.length) {
            datum[headers[col - 1]] = entry[i]["content"]["$t"]
        }
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
    var url = "https://spreadsheets.google.com/feeds/cells/";

    url += sheet_key;
    url += "/";
    url += (sheet_no || 1).toString();
    url += "/public/full?alt=json";

    return url;
}

__MODULE__ = GDriveSheets;
