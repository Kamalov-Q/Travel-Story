const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travelSchema = new Schema({
  title: { type: String, required: true },
  story: { type: String, required: true },
  visitedLocation: { type: [String], default: [] },
  isFavourites: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, red: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true },
  visitedDate: { type: Date, required: true },
});

module.exports = mongoose.model("TravelStory", travelSchema);
