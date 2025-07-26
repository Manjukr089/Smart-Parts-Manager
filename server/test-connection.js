const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://manjukr:manju1108@myparts-assistant.plg3hni.mongodb.net/myparts-assistant?retryWrites=true&w=majority&ssl=true")
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas via SSL");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  });
