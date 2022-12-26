const express = require("express");
const cors = require("cors");

const app = express();

const accountSid = "ACbab3ffea1dd7c59f02cba5540600ff84";
const authToken = "04e9f7fd10a8c9ade414911e239507ea";
const client = require("twilio")(accountSid, authToken);

app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  console.log(req.body.number);
  client.lookups.v1
    .phoneNumbers(req.body.number)
    .fetch({ type: ["carrier"] })
    .then((phone_number) => {
      app.get("/", (req, res) => {
        console.log("GET " + phone_number.phoneNumber);
        res.send(phone_number.phoneNumber);
      });
    });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});