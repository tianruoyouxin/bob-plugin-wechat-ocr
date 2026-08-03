var items = [
    ["auto", "Auto"]
];

function supportLanguages() {
    return items.map(item => item[0]);
}

function supportBoundingBox() {
    return true;
}

function ocr(query, completion) {
    var apiUrl = $option.apiUrl;
    if (!apiUrl) {
         apiUrl = "https://ocr-api.missuo.me";
    }
    
    if (!apiUrl.endsWith('/ocr')) {
        apiUrl = apiUrl.replace(/\/$/, '') + '/ocr';
    }

    var base64 = query.image.toBase64();
    
    $http.post({
        url: apiUrl,
        header: {
            "Content-Type": "application/json"
        },
        body: {
            image: base64
        },
        handler: function(resp) {
            var data = resp.data;
            var error = resp.error;

            if (error) {
                completion({
                    error: {
                        type: "network",
                        message: error.localizedDescription || "Network Error"
                    }
                });
                return;
            }

            var statusCode = resp.response.statusCode;
            if (statusCode !== 200) {
                 completion({
                    error: {
                        type: "network",
                        message: "HTTP Error: " + statusCode
                    }
                });
                return;
            }

            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                     completion({
                        error: {
                            type: "api",
                            message: "Invalid JSON response"
                        }
                    });
                     return;
                }
            }

            if (data && data.result) {
                if (data.result.errcode === 0 && data.result.ocr_response) {
                    var texts = data.result.ocr_response.map(function(item) {
                        var result = {
                            text: item.text,
                        };
                        if (query.pixelWidth && query.pixelHeight && typeof item.left === "number") {
                            result.boundingBox = {
                                points: [
                                    { x: item.left / query.pixelWidth, y: item.top / query.pixelHeight },
                                    { x: item.right / query.pixelWidth, y: item.top / query.pixelHeight },
                                    { x: item.right / query.pixelWidth, y: item.bottom / query.pixelHeight },
                                    { x: item.left / query.pixelWidth, y: item.bottom / query.pixelHeight }
                                ]
                            };
                        }
                        return result;
                    });
                    
                    completion({
                        result: {
                            from: "auto",
                            texts: texts
                        }
                    });
                } else {
                     completion({
                        error: {
                            type: "api",
                            message: "API Error" + (data.result && data.result.errcode ? (": " + data.result.errcode) : "")
                        }
                    });
                }
            } else {
                completion({
                    error: {
                        type: "api",
                        message: "Invalid API Response Structure"
                    }
                });
            }
        }
    });
}
