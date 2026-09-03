const Herb = require("../models/herbModel");
const path = require('path');
const fs = require('fs');
const { logActivity } = require("../utils/activityLogger");

// Create a new herb (Content Creators/Admins) with file upload support
exports.createHerb = async (req, res) => {
  try {
    const {
      name,
      herbName, // From AddHerb form
      scientificName,
      botanicalName, // From AddHerb form
      category,
      description,
      physicalDescription, // From AddHerb form
      benefits,
      careInstructions,
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
      category: category || '',
      description: description || physicalDescription || '',
      benefits: benefits || '',
      careInstructions: careInstructions || '',
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

    await logActivity('created_herb', req, {
      targetType: 'herb',
      targetId: newHerb._id.toString(),
      targetName: newHerb.name,
    });

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

// Get all herbs (with search, filter, pagination) or a specific herb
exports.getHerb = async (req, res) => {
  try {
    const { herbId } = req.params;

    if (herbId) {
      const herb = await Herb.findById(herbId);
      if (!herb) {
        return res.status(404).json({
          success: false,
          message: 'Herb not found',
          data: null,
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Herb fetched successfully',
        data: herb,
      });
    }

    // --- Search, filter, pagination ---
    const { q, category, page = 1, limit = 9 } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 9));
    const skip = (pageNum - 1) * limitNum;

    let filter = {};

    // Text search (MongoDB $text index)
    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }

    // Category filter (exact match, case-insensitive via regex)
    if (category && category.trim()) {
      filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    const [herbs, total] = await Promise.all([
      Herb.find(filter)
        .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Herb.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      message: 'Herbs fetched successfully',
      data: herbs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching herbs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch herbs',
      error: error.message,
      data: [],
    });
  }
};

// Get distinct categories from actual herbs in the database
exports.getHerbCategories = async (req, res) => {
  try {
    const categories = await Herb.distinct('category');
    const filtered = categories
      .filter((c) => c && c.trim())
      .map((c) => c.trim())
      .sort();
    res.status(200).json({
      success: true,
      categories: filtered,
    });
  } catch (error) {
    console.error('Error fetching herb categories:', error);
    res.status(200).json({ success: true, categories: [] });
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

    await logActivity('updated_herb', req, {
      targetType: 'herb',
      targetId: herb._id.toString(),
      targetName: herb.name,
    });

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

    await logActivity(isActive ? 'activated_herb' : 'deactivated_herb', req, {
      targetType: 'herb',
      targetId: herb._id.toString(),
      targetName: herb.name,
    });

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

// Delete herb (Admin or Creator)
exports.deleteHerb = async (req, res) => {
  try {
    const { herbId } = req.params;

    const herb = await Herb.findById(herbId);
    if (!herb) {
      return res.status(404).json({ 
        success: false, 
        message: "Herb not found" 
      });
    }

    // Check authorization (Admin or owner)
    if (req.user && req.user.role !== 'admin' && (!herb.createdBy || herb.createdBy.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this herb'
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

    await logActivity('deleted_herb', req, {
      targetType: 'herb',
      targetId: herb._id.toString(),
      targetName: herb.name,
    });

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