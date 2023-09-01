const module = (() => {
    function _feed_to_data(feed) {
        const headers = _get_headers(feed);
        const rows = feed["table"]["rows"] || [];
        const data = [], datum = {}, row = "2";
    
        for (let row = 1; row < rows.length; ++row) {
            const entry = rows[row]["c"], datum = {};

            for (let col = 0; col < entry.length; col++) {
                if (headers[col]) {
                    datum[headers[col]] = (entry[col] || {})["v"] || "";
                }
            }

            data.push(datum);
        }
    
        return data;
    }

    function _get_headers(feed) {
        const rows = feed["table"]["rows"] || [];
        const entry = rows.length > 0 ? rows[0]["c"] : [];
        const headers = [];
    
        for (let col = 0; col < entry.length; col++) {
            headers.push(((entry[col] || {})["v"] || "").trim());
        }
    
        return headers;
    }

    function _get_feed_url(spreadsheet_id, sheet_name) {
        let url = "https://docs.google.com/spreadsheets/d/" + spreadsheet_id + "/gviz/tq?tqx=out:json";

        if (sheet_name) {
            url += "&" + "sheet=" + encodeURIComponent(sheet_name);
        }
     
        return url;
    }

    return {
        fetch_data: (spreadsheet_id, sheet_name) => {
            const url = _get_feed_url(spreadsheet_id, sheet_name);
            
            return fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        return Promise.reject({ "status": response.status });
                    }
                })
                .then((text) => {
                    return JSON.parse(text.match(/\((\{.+\})\)/)[1]);
                })
                .then((feed) => {
                    return _feed_to_data(feed);
                });
        }
    }
})();

__MODULE__ = module;
