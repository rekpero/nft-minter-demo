const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { SpheronClient, ProtocolEnum } = require("@spheron/storage");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8111;
const SPHERON_TOKEN = process.env.SPHERON_TOKEN;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

app.get("/initiate-upload/:bucketName", async (req, res, next) => {
  try {
    console.log(req.params);
    const bucketName = req.params.bucketName;
    const protocol = ProtocolEnum.IPFS;

    const client = new SpheronClient({
      token: SPHERON_TOKEN,
    });

    const { uploadToken } = await client.createSingleUploadToken({
      name: bucketName,
      protocol,
    });

    res.status(200).json({
      uploadToken,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
