const mongoose = require('mongoose');

const herbSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    scientificName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    benefits: {
      type: String,
      required: true,
      trim: true,
    },
    careInstructions: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      default: '',
    },
    modelUrl: {
      type: String,
      required: false,
      default: '',
    },
    _3DId: {
      type: String,
      required: false,
      default: '',
    },
    botanicalInfo: {
      type: String,
      required: false,
      default: '',
    },
    physicalDescription: {
      type: String,
      required: false,
      default: '',
    },
    habitat: {
      type: String,
      required: false,
      default: '',
    },
    medicinalMethod: {
      type: String,
      required: false,
      default: '',
    },
    conventionalComposition: {
      type: String,
      required: false,
      default: '',
    },
    chemicalComposition: {
      type: String,
      required: false,
      default: '',
    },
    pharmacologicalEffect: {
      type: String,
      required: false,
      default: '',
    },
    clinicalStudies: {
      type: String,
      required: false,
      default: '',
    },
    safetyPrecautions: {
      type: String,
      required: false,
      default: '',
    },
    culturalSignificance: {
      type: String,
      required: false,
      default: '',
    },
    plantSuccess: {
      type: String,
      required: false,
      default: '',
    },
    uses: {
      type: String,
      required: false,
      default: '',
    },
    referenceLink: {
      type: String,
      required: false,
      default: '',
    },
    video: {
      type: String,
      required: false,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'inactive'],
      default: 'pending',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Herb = mongoose.model('Herb', herbSchema);

module.exports = Herb;
