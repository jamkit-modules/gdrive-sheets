var module = (function() {

    function _feed_to_data(feed) {
        var headers = _get_headers(feed);
        var rows = feed["table"]["rows"] || [];
        var data = [], datum = {}, row = "2";
    
        for (var row = 1; row < rows.length; ++row) {
            var entry = rows[row]["c"], datum = {};

            for (var col = 0; col < entry.length; col++) {
                if (headers[col]) {
                    datum[headers[col]] = (entry[col] || {})["v"] || "";
                }
            }

            data.push(datum);
        }
    
        return data;
    }

    function _get_headers(feed) {
        var rows = feed["table"]["rows"] || [];
        var entry = rows.length > 0 ? rows[0]["c"] : [];
        var headers = [];
    
        for (var col = 0; col < entry.length; col++) {
            headers.push(((entry[col] || {})["v"] || "").trim());
        }
    
        return headers;
    }

    function _get_feed_url(spreadsheet_id, sheet_name) {
        var url = "https://docs.google.com/spreadsheets/d/" + spreadsheet_id + "/gviz/tq?tqx=out:json";

        if (sheet_name) {
            url += "&" + "sheet=" + encodeURIComponent(sheet_name);
        }
     
        return url;
    }

    return {
        fetch_data: function(spreadsheet_id, sheet_name) {
            var url = _get_feed_url(spreadsheet_id, sheet_name);
            
            return fetch(url)
                .then(function(response) {
                    if (response.ok) {
                        return response.text();
                    } else {
                        return Promise.reject({ "status": response.status });
                    }
                })
                .then(function(text) {
                    return JSON.parse(text.match(/\((\{.+\})\)/)[1]);
                })
                .then(function(feed) {
                    return _feed_to_data(feed);
                });
        }
    }
})();

__MODULE__ = module;
