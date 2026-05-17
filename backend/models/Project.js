const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    deadline: { type: Date },
    status: {
      type: String,
      enum: ["actif", "en pause", "archivé"],
      default: "actif",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
projectSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  const Task = require("./Task");
  const Activity = require("./Activity");
  await Task.deleteMany({ project: this._id });
  await Activity.deleteMany({ project: this._id });
  next();
});
module.exports = mongoose.model("Project", projectSchema);
