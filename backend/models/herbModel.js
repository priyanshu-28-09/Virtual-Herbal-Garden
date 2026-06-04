const mongoose = require("mongoose");

const herbSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    scientificName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
    botanicalInfo: {
      type: String,
      required: true,
    },
    physicalDescription: {
      type: String,
      required: true,
    },
    habitat: {
      type: String,
      required: true,
    },
    medicinalMethod: {
      type: String,
      required: true,
    },
    conventionalComposition: {
      type: String,
      required: true,
    },
    chemicalComposition: {
      type: String,
      required: true,
    },
    pharmacologicalEffect: {
      type: String,
      required: true,
    },
    clinicalStudies: {
      type: String,
      required: true,
    },
    safetyPrecautions: {
      type: String,
      required: true,
    },
    culturalSignificance: {
      type: String,
      required: true,
    },
    plantSuccess: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    uses: {
      type: String,
      required: false,
    },
    careInstructions: {
      type: String,
      required: false,
    },
    referenceLink: {
      type: String,
      required: false,
      default: "",
    },
    _3DId: {
      type: String,
      required: false,
      default: "",
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Herb = mongoose.model("Herb", herbSchema);

module.exports = Herb;
