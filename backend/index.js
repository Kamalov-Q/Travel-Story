require("dotenv").config({ path: "./.env" });

const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const config = process.env.MONGODB_URL;
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const swaggerDocs = require("./utils/swagger");

const jwt = require("jsonwebtoken");

const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");

const { authentificateToken } = require("./utilities");
const upload = require("./multer");

mongoose.connect(config).then(() => {
  console.log("Connected to MongoDB");
});

const app = express();
app.use(express.json());
app.use(cors());

app.listen(8000, () => {
  console.log("App is running on port 8000");

  swaggerDocs(app, 8000);
});

//Swagger Docs for creating an account
/**
 * @openapi
 * /create-account:
 *   post:
 *     tags:
 *       - User
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the user.
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the user account.
 *                 example: password123
 *             required:
 *               - fullName
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: New user has been created successfully.
 *         content:
 *           application/json:
 *             example:
 *               error: false
 *               user:
 *                 fullName: johndoe
 *                 email: johndoe@example.com
 *                 createdAt: "2025-01-12T10:00:00.000Z"
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               message: "User created successfully"
 *       400:
 *         description: Invalid input or missing fields.
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Please fill in all fields"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "An unexpected error occurred"
 */
//Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please fill in all fields" });
  }

  const isUser = await User.findOne({ email });

  if (isUser) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await user.save();

  const accessToken = jwt.sign(
    { userId: user?._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return res.status(200).json({
    error: false,
    user: {
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
    message: "User created successfully",
  });
});

//Login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ error: true, message: "Send an email and a password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(String(password), user.password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    {
      userId: user?._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return res.status(200).json({
    error: false,
    user: {
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
    message: "Login successful",
  });
});

//Swagger docs for getting an user authentificated
/**
 * @openapi
 * /get-user:
 *   get:
 *     tags:
 *       - User
 *     description: Retrieve all users from the system. Requires authentication.
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 *           example: Bearer <your_token_here>
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             example:
 *               message: "Users retrieved successfully"
 *               data:
 *                 - id: 1
 *                   name: John Doe
 *                   email: john.doe@example.com
 *                 - id: 2
 *                   name: Jane Smith
 *                   email: jane.smith@example.com
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Unauthorized. Please provide a valid token."
 *       404:
 *         description: No users found in the system.
 *         content:
 *           application/json:
 *             example:
 *               message: "No users found"
 *       500:
 *         description: Internal server error occurred while retrieving users.
 *         content:
 *           application/json:
 *             example:
 *               error: "Internal Server Error"
 *               message: "An unexpected error occurred"
 */

//Get User
app.get("/get-user", authentificateToken, async (req, res) => {
  const { userId } = req.user;

  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  return res.status(200).json({
    error: false,
    user: isUser,
    message: "User found",
  });
});

//Route to handle image upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "No images uploaded" });
    }

    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

    res
      .status(200)
      .json({ error: false, imageUrl, message: "Image Uploaded Successfully" });
  } catch (err) {
    res.status(400).json({ error: true, message: err.message });
  }
});

//Delete an image from uploads folder
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "imageUrl parameter is required" });
  }

  try {
    //Extract the filename from the imageUrl
    const filename = path.basename(imageUrl);

    //Define the file path
    const filePath = path.join(__dirname, "uploads", filename);

    //Check if the file exists
    if (fs.existsSync(filePath)) {
      //Delete the file from the uploads folder
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(500).json({ error: true, message: "Image not found" });
    }
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

//Serve static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

//Add Travel Story
app.post("/add-travel-story", authentificateToken, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  //Validate required fields
  if (!title || !story || !visitedDate || !visitedLocation || !imageUrl) {
    res
      .status(400)
      .json({ error: true, message: "Fill in all required fields" });
  }

  //Convert visitedDate from milliseconds to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedDate: parsedVisitedDate,
      visitedLocation,
      userId,
      imageUrl,
    });

    await travelStory.save();

    res.status(201).json({
      error: false,
      message: "Added Successfully",
      count: travelStory.count,
      data: travelStory,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: true, message: err.message });
  }
});

//Get All Travel Stories
app.get("/get-all-stories", authentificateToken, async (req, res) => {
  const { userId } = req.user;
  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({
      isFavourites: -1,
    });
    res
      .status(200)
      .json({ stories: travelStories, error: false, message: "Success" });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

//Edit Travel Story
app.put("/edit-story/:id", authentificateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, visitedDate, imageUrl } = req.body;
  const { userId } = req.user;

  //Validate required fields
  if (!title || !story || !visitedDate || !visitedLocation || !imageUrl) {
    res
      .status(400)
      .json({ error: true, message: "Fill in all required fields" });
  }

  //Convert visitedDate from milliseconds to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    //Find the travel story by ID and ensure it belongs to the authentificated user
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel Story not found" });
    }

    const placeholderImgUrl = `http://localhost:8000/assets/TravelAgency.png`;

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedDate = parsedVisitedDate;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImgUrl;

    await travelStory.save();

    res.status(200).json({ error: false, message: "Updated Successfully" });
  } catch (err) {
    return res.status(500).json({ error: true, message: err?.message });
  }
});

//Delete Travel Story
app.delete("/delete-story/:id", authentificateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    //Find the travel story by ID and ensure it belongs to the authentificated user
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel Story not found" });
    }

    await TravelStory.deleteOne({ _id: id, userId });

    //Extract the filename from the imageUrl
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    //Define the file path
    const filePath = path.join(__dirname, "uploads", filename);

    //Delete the file path
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete image file: ", err);
      }
    });
    return res
      .status(200)
      .json({ error: false, message: "Travel Story deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: true, message: err.message });
  }
});

//Swagger API docs for updating favourite list
/**
 * @openapi
 * /update-is-favourite/{id}:
 *   put:
 *     tags:
 *       - Update Favourites
 *     description: Update the "isFavourites" status of a travel story for an authenticated user.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the travel story to update.
 *         schema:
 *           type: string
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for authentication.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isFavourites:
 *                 type: boolean
 *                 description: The new "isFavourites" status.
 *             required:
 *               - isFavourites
 *     responses:
 *       200:
 *         description: Successfully updated the "isFavourites" status.
 *         content:
 *           application/json:
 *             example:
 *               error: false
 *               isFavourites: true
 *               message: "Favourites list updated"
 *       400:
 *         description: Missing or invalid input.
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "isFavourites is missing"
 *       404:
 *         description: Travel story not found.
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "Travel Story not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               error: true
 *               message: "An unexpected error occurred"
 */

//Update Favourited List
app.put("/update-is-favourite/:id", authentificateToken, async (req, res) => {
  const { id } = req.params;
  let { isFavourites } = req.body;
  const { userId } = req.user;

  if (typeof isFavourites !== "boolean") {
    return res
      .status(400)
      .json({ error: true, message: "isFavourites is missing" });
  }
  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel Story not found" });
    }

    travelStory.isFavourites = isFavourites;

    await travelStory.save();

    return res
      .status(200)
      .json({ error: false, isFavourites, message: "Favourites list updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: true, message: err.message });
  }
});

//Search travel stories
app.post("/search", authentificateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    return res.status(404).json({ error: true, message: "Query required" });
  }

  try {
    const searchResults = await TravelStory.find({
      userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourites: -1 });

    return res.status(200).json({
      error: false,
      stories: searchResults,
      message: "Travel Stories",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: false, message: err.message });
  }
});

//Filter travel stories by date range
app.get("/travel-stories/filter", authentificateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    //Convert startDate and endDate to Date Objects
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    //Find travel stories that belong to the authentificated user and fall within the date range

    const filteredStories = await TravelStory.find({
      userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourites: -1 });

    return res.status(200).json({
      error: false,
      stories: filteredStories,
      message: "Filtered Stories",
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: true, message: err.message });
  }
});

module.exports = app;
