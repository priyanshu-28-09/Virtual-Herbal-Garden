const Herb = require("../models/herbModel");
const path = require('path');
const fs = require('fs');

// Create a new herb (Content Creators/Admins) with file upload support
exports.createHerb = async (req, res) => {
  try {
    console.log('📝 Request Body:', req.body);
    console.log('📁 Files:', req.files);

    const {
      name,
      herbName, // From AddHerb form
      scientificName,
      botanicalName, // From AddHerb form
      description,
      physicalDescription, // From AddHerb form
      image,
      botanicalInfo,
      habitat,
      habitatDistribution, // From AddHerb form
      medicinalMethod,
      conventionalComposition,
      chemicalComposition,
      pharmacologicalEffect,
      clinicalStudies,
      safetyPrecautions,
      safetyPrecaution, // From AddHerb form
      culturalSignificance,
      plantSuccess,
      successFind, // From AddHerb form
      referenceLink,
      _3DId,
    } = req.body;

    // Map form fields to database fields
    const herbData = {
      name: name || herbName,
      scientificName: scientificName || botanicalName,
      description: description || physicalDescription || '',
      botanicalInfo: botanicalInfo || '',
      physicalDescription: physicalDescription || description || '',
      habitat: habitat || habitatDistribution || '',
      medicinalMethod: medicinalMethod || '',
      conventionalComposition: conventionalComposition || '',
      chemicalComposition: chemicalComposition || '',
      pharmacologicalEffect: pharmacologicalEffect || '',
      clinicalStudies: clinicalStudies || '',
      safetyPrecautions: safetyPrecautions || safetyPrecaution || '',
      culturalSignificance: culturalSignificance || '',
      plantSuccess: plantSuccess || successFind || '',
      referenceLink: referenceLink || '',
      _3DId: _3DId || '',
      createdBy: req.user._id || req.user.id, // From authentication middleware
      status: 'pending',
      isActive: false
    };

    // Handle image upload (from multer)
    if (req.files && req.files.image) {
      herbData.image = `/uploads/images/${req.files.image[0].filename}`;
    } else if (image) {
      // If image URL provided directly (for backward compatibility)
      herbData.image = image;
    }

    // Handle video upload (from multer)
    if (req.files && req.files.video) {
      herbData.video = `/uploads/videos/${req.files.video[0].filename}`;
    }

    const newHerb = new Herb(herbData);
    await newHerb.save();

    console.log('✅ Herb created successfully:', newHerb._id);

    res.status(201).json({ 
      success: true,
      message: "Herb created successfully! Waiting for admin approval.", 
      herb: newHerb,
      newHerb // Keep for backward compatibility
    });
  } catch (error) {
    console.error('❌ Error creating herb:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// Get all herbs or a specific herb
exports.getHerb = async (req, res) => {
  try {
    const { herbId } = req.params;

    if (herbId) {
      const herb = await Herb.findById(herbId);
      if (!herb) {
        return res.status(404).json({ 
          success: false,
          message: "Herb not found" 
        });
      }
      return res.status(200).json({ 
        success: true,
        herb 
      });
    } else {
      const herbs = await Herb.find().sort({ createdAt: -1 });
      return res.status(200).json(herbs);
    }
  } catch (error) {
    console.error('Error fetching herbs:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// Get all herbs (explicit function for /api/herbs route)
exports.getAllHerbs = async (req, res) => {
  try {
    const herbs = await Herb.find().sort({ createdAt: -1 });
    res.status(200).json(herbs);
  } catch (error) {
    console.error('Error fetching all herbs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch herbs',
      error: error.message
    });
  }
};

// Get herbs created by specific user (Content Creator)
exports.getMyHerbs = async (req, res) => {
  try {
    const { userId } = req.params;
    const herbs = await Herb.find({ createdBy: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: herbs.length,
      herbs
    });
  } catch (error) {
    console.error('Error fetching user herbs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch herbs',
      error: error.message
    });
  }
};

// Update herb details (Content Creators/Admins) with file upload support
exports.updateHerb = async (req, res) => {
  try {
    const { herbId } = req.params;
    const herb = await Herb.findById(herbId);

    if (!herb) {
      return res.status(404).json({ 
        success: false,
        message: "Herb not found" 
      });
    }

    // Check authorization (if middleware provides user)
    if (req.user && herb.createdBy && herb.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this herb'
      });
    }

    // Map form field names to database field names
    const fieldMapping = {
      herbName: 'name',
      botanicalName: 'scientificName',
      physicalDescription: ['physicalDescription', 'description'],
      habitatDistribution: 'habitat',
      medicinalMethod: 'medicinalMethod',
      conventionalComposition: 'conventionalComposition',
      chemicalComposition: 'chemicalComposition',
      pharmacologicalEffect: 'pharmacologicalEffect',
      clinicalStudies: 'clinicalStudies',
      safetyPrecaution: 'safetyPrecautions',
      culturalSignificance: 'culturalSignificance',
      successFind: 'plantSuccess',
      botanicalInfo: 'botanicalInfo',
      referenceLink: 'referenceLink',
      _3DId: '_3DId'
    };

    // Update fields from request body
    Object.keys(req.body).forEach(key => {
      if (fieldMapping[key]) {
        const dbField = fieldMapping[key];
        if (Array.isArray(dbField)) {
          // Update multiple fields
          dbField.forEach(field => {
            herb[field] = req.body[key];
          });
        } else {
          herb[dbField] = req.body[key];
        }
      } else if (herb.schema.paths[key]) {
        // Direct field mapping
        herb[key] = req.body[key];
      }
    });

    // Handle image upload
    if (req.files && req.files.image) {
      // Delete old image if exists
      if (herb.image && herb.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', herb.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      herb.image = `/uploads/images/${req.files.image[0].filename}`;
    }

    // Handle video upload
    if (req.files && req.files.video) {
      // Delete old video if exists
      if (herb.video && herb.video.startsWith('/uploads/')) {
        const oldVideoPath = path.join(__dirname, '..', herb.video);
        if (fs.existsSync(oldVideoPath)) {
          fs.unlinkSync(oldVideoPath);
        }
      }
      herb.video = `/uploads/videos/${req.files.video[0].filename}`;
    }

    await herb.save();

    res.status(200).json({ 
      success: true,
      message: "Herb updated successfully", 
      updatedHerb: herb,
      herb // For consistency
    });
  } catch (error) {
    console.error('Error updating herb:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// Update herb status (Admin only)
exports.updateHerbStatus = async (req, res) => {
  try {
    const { herbId } = req.params;
    const { isActive } = req.body;

    const herb = await Herb.findByIdAndUpdate(
      herbId,
      { 
        isActive,
        status: isActive ? 'approved' : 'inactive'
      },
      { new: true }
    );

    if (!herb) {
      return res.status(404).json({
        success: false,
        message: 'Herb not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Herb ${isActive ? 'activated' : 'deactivated'} successfully`,
      herb
    });
  } catch (error) {
    console.error('Error updating herb status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update herb status',
      error: error.message
    });
  }
};

// Delete herb (Admin only)
exports.deleteHerb = async (req, res) => {
  try {
    const { herbId } = req.params;

    const herb = await Herb.findById(herbId);
    console.log('Found herb:', herb);
    if (!herb) {
      return res.status(404).json({ 
        success: false,
        message: "Herb not found" 
      });
    }

    // Delete associated files
    if (herb.image && herb.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', herb.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    if (herb.video && herb.video.startsWith('/uploads/')) {
      const videoPath = path.join(__dirname, '..', herb.video);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    await Herb.findByIdAndDelete(herbId);

    res.status(200).json({ 
      success: true,
      message: "Herb deleted successfully" 
    });
  } catch (error) {
    console.error('Error deleting herb:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// Get herbs by IDs (legacy function)
exports.herbb = async (req, res) => {
  const { ids } = req.query;
  try {
    if (ids && Array.isArray(ids)) {
      const plants = await Herb.find({
        '_id': { $in: ids },
      });

      if (plants.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'No plants found for the provided IDs.' 
        });
      }
      return res.json({
        success: true,
        plants
      });
    } else {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or missing plant IDs.' 
      });
    }
  } catch (error) {
    console.error('Error fetching plants:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error.',
      error: error.message 
    });
  }
};