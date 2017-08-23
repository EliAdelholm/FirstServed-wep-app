export const convertJson = (json) => JSON.parse(json, function (key, value) {
    if (typeof value === 'string') {
        const d = /\/Date\((\d*)\)\//.exec(value);
        return (d) ? new Date(+d[1]).getTime() : value;
    }
    return value;
});

export const convertToJson = async (response) => {
    const responseText = await response.text();

    return convertJson(responseText);
};

export const getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};