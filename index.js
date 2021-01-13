var module = (function() {
    return {
        fetch_data: function(sheet_key, worksheet_id) {
            const self = this;

            return new Promise(function(resolve, reject) {
                var url = self.get_feed_url(sheet_key, worksheet_id);
            
                fetch(url)
                    .then(function(response) {
                        if(response.ok) {
                            return response.json();
                        } else {
                            return Promise.reject({ "status": response.status });
                        }
                    })
                    .then(function(feed) {
                        resolve(self.feed_to_data(feed));
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        feed_to_data: function(feed) {
            var headers = this.get_headers(feed);
            var entry = feed["feed"]["entry"].slice(headers.length);
            var data = [], datum = {}, row = "2";
        
            for (var i = 0; i < entry.length; ++i) {
                var cell = entry[i]["gs$cell"];
        
                if (cell["row"] !== row) {
                    data.push(datum), datum = {}, row = cell["row"];
                }
        
                var col = parseInt(cell["col"]);
        
                if (col - 1 < headers.length) {
                    datum[headers[col - 1]] = entry[i]["content"]["$t"]
                }
            }
        
            if (datum) {
                data.push(datum);
            }
        
            return data;
        },

        get_headers: function(feed) {
            var entry = feed["feed"]["entry"];
            var headers = [];
        
            for (var i = 0; i < entry.length; i++) {
                if (entry[i]["gs$cell"]["row"] !== "1") {
                    break;
                }
        
                headers.push(entry[i]["content"]["$t"]);
            }
        
            return headers;
        },

        get_feed_url: function(sheet_key, worksheet_id) {
            var url = "https://spreadsheets.google.com/feeds/cells/";
        
            url += sheet_key;
            url += "/";
            url += (worksheet_id || 1).toString();
            url += "/public/full?alt=json";
        
            return url;
        },
    }
})();

__MODULE__ = module;
