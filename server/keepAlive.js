const axios = require("axios");

setInterval(() => {
  axios.get("https://smart-parts-manager-backend.onrender.com/health")
    .then(() => console.log("Keep-alive ping successful"))
    .catch(() => console.log("Keep-alive ping failed"));
}, 2 * 60 * 1000); // every 2 minutes
