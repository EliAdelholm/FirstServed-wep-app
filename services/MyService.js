// import dependencies
import randomstring from 'randomstring';
import oauthSignature from 'oauth-signature';

// import schemas and helpers
import Schemas from './Schemas';
import {convertToJson, getUrlParameter} from '../helpers/ServiceHelper';

// Specific Authorization parameters - MUST be switched between dev and production
// localhost:3000 Auth
/*const consumerKey = "9ZecbYwXag6t";
const consumerSecret = "v8QaMT8IdEVuN2d51LVvhvgD9MnlUvPpcphRvZBhSp2Y2BZg";
const callback = "http://localhost:3000/access";*/

// test.firstServed Auth
const consumerKey = "8QYgqgLLMRNe";
const consumerSecret = "Ju1P3EqxmUzO9LWlGrxVKzDuQ6XPXds6hAuc0krPkL8YI1B3";
const callback = "https://test.firstserved.co/access";

// Standard Authorization parameters
let timestamp = Math.floor(Date.now() / 1000);
let nonce = randomstring.generate(9);
let token = null;
let tokenSecret = null;
let verifier = null;

let parameters = {
    oauth_callback: callback,
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: token,
};

let signature = oauthSignature.generate("POST", "https://api.firstserved.co/oauth1/request", parameters, consumerSecret);


// OAUTH 1A AUTHENTICATION FLOW

// Step 1: Request temporary token
export const authenticationRequest = async() => {
    const response = await fetch(`https://api.firstserved.co/oauth1/request`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey +'" oauth_token="" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_nonce="' + nonce + '" oauth_signature="' + signature + '" oauth_callback="' + callback + '"'
        },
    });

    const responseText = await response.text();
    const data = responseText.split('&').reduce((prev, cur) => {
        const parts = cur.split('=');
        prev[parts[0]] = parts[1];
        return prev;
    }, {});

    token = data.oauth_token;
    tokenSecret = data.oauth_token_secret;
    localStorage.setItem("secret", tokenSecret);

    // Step 2: Redirect to user sign in via WordPress
    location.href = `https://api.firstserved.co/oauth1/authorize?oauth_token=${token}&oauth_callback_accepted=1`;
};

// Step 3: Request permanent access token
export const authenticationAccess = async() => {
    verifier = getUrlParameter('oauth_verifier');
    token = getUrlParameter('oauth_token');
    tokenSecret = localStorage.getItem("secret");

    console.log("verifier: " + verifier + ". token: " + token + " secret: " + tokenSecret);

    let accessParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: token,
        oauth_verifier: verifier,
    };

    let accessSignature = oauthSignature.generate("POST", "https://api.firstserved.co/oauth1/access", accessParameters, consumerSecret, tokenSecret);

    const response = await fetch(`https://api.firstserved.co/oauth1/access`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + accessSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + token + '" oauth_verifier="' + verifier + '"',
        },
    });

    const responseText = await response.text();
    const data = responseText.split('&').reduce((prev, cur) => {
        const parts = cur.split('=');
        prev[parts[0]] = parts[1];
        return prev;
    }, {});

    const accessToken = data.oauth_token;
    const accessSecret = data.oauth_token_secret;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("accessSecret", accessSecret);

    console.log(accessToken, accessSecret);
};


// ONESIGNAL PUSH NOTIFICATION REQUESTS
// Notification about new reservations
export const createReservationNotification = async(id) => {
    const response = await fetch(`https://onesignal.com/api/v1/notifications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: "Basic NGEwMGZmMjItY2NkNy0xMWUzLTk5ZDUtMDAwYzI5NDBlNjJj",
        },
        body: JSON.stringify({
            app_id: "35c4f759-2174-4570-848a-9e0db7016a41",
            headings: {"en": "New Reservation"},
            contents: {"en": "Congratulations! You have a new reservation from FirstServed. Click here to see it."},
            include_player_ids: [id],
            url: "https://",
        })
    });
    const responseData = await convertToJson(response);
};


// UNAUTHENTICATED REQUESTS

// Get all restaurants
export const fetchRestaurantsAsync = async() => {
    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/restaurants`, {
        credentials: 'include',
    });
    const responseData = await convertToJson(response);

    return Schemas.normalize(responseData, [Schemas.restaurant]);
};

export const fetchWaitingListAsync = async(selection) => {
    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/restaurants?include=${selection}`, {
        credentials: 'include',
    });
    const responseData = await convertToJson(response);

    return Schemas.normalize(responseData, [Schemas.waitingList]);
};

export const fetchFavouritesAsync = async(selection) => {
    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/restaurants?include=${selection}`, {
        credentials: 'include',
    });
    const responseData = await convertToJson(response);

    return Schemas.normalize(responseData, [Schemas.favourite]);
};

// Get data for specific restaurant
export const fetchRestaurantDataAsync = async(slug) => {
    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/restaurants?slug=${slug}`, {
        method: 'GET',
    });
    const responseData = await convertToJson(response);

    return Schemas.normalize(responseData, [Schemas.restaurantData]);
};

// Get all restaurant tables
export const fetchAllRestaurantTablesAsync = async() => {
    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/comments?per_page=100`, {
        credentials: 'include',
    });
    const responseData = await convertToJson(response);

    return Schemas.normalize(responseData, [Schemas.restaurantTable]);
};

// Get tables for specific restaurant
export const fetchRestaurantTablesAsync = async(id) => {
    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/comments?post=${id}&per_page=100`, {
        credentials: 'include',
    });
    const responseData = await convertToJson(response);

    return Schemas.normalize(responseData, [Schemas.restaurantTable]);
};

// Get specific table
export const fetchTableBookingAsync = async(id) => {
    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/comments?include=${id}`, {
        credentials: 'include',
    });
    const responseData = await convertToJson(response);

    return Schemas.normalize(responseData, [Schemas.bookingTable]);
};


// AUTHENTICATED REQUESTS

// Get the access token and secret saved in user's browser
const authToken = localStorage.getItem("accessToken");
const authSecret = localStorage.getItem("accessSecret");

// Post a new table
export const postAvailableTableAsync = async(post, content) => {
    let nonce = randomstring.generate(9);
    let authParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: authToken,
    };
    let authSignature = oauthSignature.generate("POST", "https://api.firstserved.co/wp-json/wp/v2/comments", authParameters, consumerSecret, authSecret);

    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + authSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + authToken + '"',
        },
        body: JSON.stringify({
            "post": post,
            "content": content,
            "status": "publish"
        })
    });

    const responseData = await convertToJson(response);
    return Schemas.normalize(responseData, [Schemas.restaurantTable]);
};

// Book a table
export const bookTableAsync = async(content, post, parent) => {
    let nonce = randomstring.generate(9);
    let authParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: authToken,
    };
    let authSignature = oauthSignature.generate("POST", "https://api.firstserved.co/wp-json/wp/v2/comments", authParameters, consumerSecret, authSecret);

    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + authSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + authToken + '"',
        },
        body: JSON.stringify({
            "post": post,
            "parent": parent,
            "content": content,
            "status": "publish"
        })
    });

    const responseData = await convertToJson(response);
    return Schemas.normalize(responseData, [Schemas.restaurantTable]);
};

// Set timeframe for new table (update Advanced Custom Fields)
export const setTableTimeframeAsync = async(id, fields) => {
    let nonce = randomstring.generate(9);
    let authParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: authToken,
    };
    let authSignature = oauthSignature.generate("POST", `https://api.firstserved.co/wp-json/acf/v2/comment/${id}`, authParameters, consumerSecret, authSecret);

    const response = await fetch(`https://api.firstserved.co/wp-json/acf/v2/comment/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + authSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + authToken + '"',
        },
        body: JSON.stringify(fields)
    });

    const responseData = await convertToJson(response);
    return Schemas.normalize(responseData, [Schemas.restaurantTable]);
};

// Delete a table
export const deleteAvailableTableAsync = async(id) => {
    let nonce = randomstring.generate(9);
    let authParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: authToken,
    };
    let authSignature = oauthSignature.generate("DELETE", `https://api.firstserved.co/wp-json/wp/v2/comments/${id}`, authParameters, consumerSecret, authSecret);

    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/comments/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + authSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + authToken + '"',
        },
        body: JSON.stringify({
            "force": "true"
        })
    });

    const responseData = await convertToJson(response);
    return Schemas.normalize(responseData, [Schemas.restaurantTable]);
};

// Update restaurant information
export const updateRestaurantDataAsync = async(id, data) => {
    let nonce = randomstring.generate(9);
    let authParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: authToken,
    };
    let authSignature = oauthSignature.generate("PUT", `https://api.firstserved.co/wp-json/wp/v2/restaurants/${id}`, authParameters, consumerSecret, authSecret);

    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/restaurants/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + authSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + authToken + '"',
        },
        body: JSON.stringify(data),
    });
    const responseData = await convertToJson(response);
    return Schemas.normalize(responseData, Schemas.restaurantData);
};

// Update restaurant's Advanced Custom Fields
export const updateRestaurantAcfDataAsync = async(id, fields) => {
    let nonce = randomstring.generate(9);
    let authParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: authToken,
    };
    let authSignature = oauthSignature.generate("PUT", `https://api.firstserved.co/wp-json/acf/v2/restaurants/${id}`, authParameters, consumerSecret, authSecret);

    const response = await fetch(`https://api.firstserved.co/wp-json/acf/v2/restaurants/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + authSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + authToken + '"',
        },
        body: JSON.stringify(fields),
    });
    const responseData = await convertToJson(response);
    return Schemas.normalize(responseData, Schemas.restaurantData);
};

// Get all users
export const requestAllUsersAsync = async() => {
    let nonce = randomstring.generate(9);
    let authParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: authToken,
    };
    let authSignature = oauthSignature.generate("GET", `https://api.firstserved.co/wp-json/wp/v2/users`, authParameters, consumerSecret, authSecret);

    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + authSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + authToken + '"',
        },
    });

    const responseData = await convertToJson(response);
    return Schemas.normalize(responseData, [Schemas.waitingUser]);
};

// Get data for logged in user
export const requestUserDataAsync = async() => {
    let nonce = randomstring.generate(9);
    let authParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: authToken,
    };
    let authSignature = oauthSignature.generate("GET", `https://api.firstserved.co/wp-json/wp/v2/users/me`, authParameters, consumerSecret, authSecret);

    const response = await fetch(`https://api.firstserved.co/wp-json/wp/v2/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + authSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + authToken + '"',
        },
    });

    const responseData = await convertToJson(response);
    return Schemas.normalize(responseData, Schemas.user);
};


// Update User's Advanced Custom Fields
export const updateUserAcfDataAsync = async(id, fields) => {
    let nonce = randomstring.generate(9);
    let authParameters = {
        oauth_consumer_key: consumerKey,
        oauth_nonce: nonce,
        oauth_signature_method: "HMAC-SHA1",
        oauth_timestamp: timestamp,
        oauth_token: authToken,
    };
    let authSignature = oauthSignature.generate("PUT", `https://api.firstserved.co/wp-json/acf/v2/user/${id}`, authParameters, consumerSecret, authSecret);

    const response = await fetch(`https://api.firstserved.co/wp-json/acf/v2/user/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: 'OAuth oauth_consumer_key="' + consumerKey + '" oauth_nonce="' + nonce + '" oauth_signature="' + authSignature + '" oauth_signature_method="HMAC-SHA1" oauth_timestamp="' + timestamp + '" oauth_token="' + authToken + '"',
        },
        body: JSON.stringify(fields),
    });
    const responseData = await convertToJson(response);
    return Schemas.normalize(responseData, Schemas.user);
};