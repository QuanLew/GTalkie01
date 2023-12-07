const express = require("express");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
// Imports the Google Cloud client library
const speech = require("@google-cloud/speech");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
// Imports the ChatAI library
const { Configuration, OpenAI } = require("openai");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(cors());

console.log("Config started");

// Creates the config for OpenAI
// const newConfig = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Creates a client by Google Cloud
const client = new speech.SpeechClient();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

console.log("Configuration is ready!");

const getResponseAI = async (text) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      { role: "user", content: text },
    ],
  });
  return response.choices[0].message.content;
};

app.get("/api/", (req, res) => {
  res.json("Hello World");
});

app.post("/api/transcribe", async (req, res) => {
  try {
    //const pathDesktop = "/Users/saran/Desktop/test1mp3.mp3";
    const pathDesktop = "/Users/quanle/Desktop/test1mp4.mp3";
    const receivedData = req.body;

    const splitString = JSON.stringify(receivedData).split(":");
    const slicename = splitString[1].slice(2, -1).trim();
    const nameFile = slicename.split(".")[0].split("/").pop();

    //console.log(`Link URI: ${JSON.stringify(receivedData)}`);
    //console.log("splice filename string: " + slicename);
    //console.log("filename string: " + nameFile);

    // const audiosDir = "./audios";
    // const outputPath = path.join(
    //   audiosDir,
    //   `${path.basename(`${nameFile}`, path.extname(`${nameFile}`))}.mp3`
    // );

    // if (!fs.existsSync(slicename)) {
    //   console.log("BAD");
    // } else {
    //   console.log("GOOD");
    // }

    // ffmpeg(slicename)
    //   .outputOptions("-vn", "-ab", "128k", "-ar", "44100")
    //   .toFormat("mp3")
    //   .save(outputPath)
    //   .on("error", (err) => console.error(`Error converting file: ${err}`))
    //   .on("end", () => console.log(`Converted ${nameFile}`));

    // config audio
    const filename = pathDesktop; //test data
    //   const filename = slicename;
    const encoding = "MP3";
    const sampleRateHertz = 16000;
    const languageCode = "en-US";

    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };

    const audio = {
      content: fs.readFileSync(filename).toString("base64"),
    };

    const request = {
      config: config,
      audio: audio,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");
    console.log("Transcription: ", transcription);

    res.status(200).send({ transcription: transcription });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/ask", async (req, res) => {
  const receivedData = req.body;
  const splitString = JSON.stringify(receivedData).split(":");
  const userPrompt = splitString[0].trim();
  //console.log("messge from ask: " + splitString)

  try {
    if (userPrompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    const response = await getResponseAI(userPrompt);
    console.log("AI rep: " + response);
    res.status(200).send({
      success: true,
      message: response,
    });
  } catch (error) {
    console.log("ChatGPT error: " + error.message);
  }
});

app.post("/api/email", (request, response) => {
  const { sender, recipients, subject, content } = request.body;

  mg.messages
    .create(process.env.MAILGUN_DOMAIN, {
      from: `"GTalkie" ${sender}`,
      to: `${recipients}`,
      subject: `${subject}`,
      html: `${content}`,
    })
    .then((msg) => {
      console.log(msg); // logs response data
      response.write("<h1>You have successfully subscribed!</h1>");
      response.end();
    })
    .catch((err) => {
      console.log(err); // logs any error
      response.status(500).send("Error sending email.");
    });
});

const port = 4000;

app.listen(port, function (request, response) {
  console.log(`server is running on port ${port}`);
});
