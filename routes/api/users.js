const express = require("express");
const path = require("path");
const fs = require("fs/promises");

const { User } = require("../../model");
const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.get("/logout", authenticate, async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.get("/current", authenticate, async (req, res) => {
  const { name, email } = req.user;
  res.json({
    user: {
      name,
      email,
    },
  });
});

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res) => {
    const { path: tempUpload, filename } = req.file;
    const [extension] = filename.split(".").reverse();
    const newFileName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFileName);

    await fs.rename(tempUpload, fileUpload);
    const avatarURL = path.join("avatars", newFileName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL });
  }
);

module.exports = router;
