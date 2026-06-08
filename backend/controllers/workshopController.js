const Workshop = require('../models/Workshop');
const ProductionLine = require('../models/ProductionLine');

// ======= Workshop Controllers =======

// Get all workshops
const getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ status: 'active' }).sort('workshopName');
    res.json(workshops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get workshop by ID
const getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Xưởng không tồn tại' });
    }
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create workshop
const createWorkshop = async (req, res) => {
  const { workshopName, description } = req.body;

  if (!workshopName) {
    return res.status(400).json({ message: 'Tên xưởng không được để trống' });
  }

  try {
    const existingWorkshop = await Workshop.findOne({
      workshopName: workshopName.toUpperCase(),
    });
    if (existingWorkshop) {
      return res.status(400).json({ message: 'Xưởng này đã tồn tại' });
    }

    const workshop = new Workshop({
      workshopName: workshopName.toUpperCase(),
      description: description || '',
    });

    const savedWorkshop = await workshop.save();
    res.status(201).json(savedWorkshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update workshop
const updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Xưởng không tồn tại' });
    }

    if (req.body.workshopName) workshop.workshopName = req.body.workshopName.toUpperCase();
    if (req.body.description) workshop.description = req.body.description;
    if (req.body.status) workshop.status = req.body.status;

    const updatedWorkshop = await workshop.save();
    res.json(updatedWorkshop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete workshop
const deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Xưởng không tồn tại' });
    }

    // Delete all production lines for this workshop
    await ProductionLine.deleteMany({ workshop: req.params.id });

    res.json({ message: 'Xưởng đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======= Production Line Controllers =======

// Get all production lines for a workshop
const getProductionLinesForWorkshop = async (req, res) => {
  try {
    const lines = await ProductionLine.find({
      workshop: req.params.workshopId,
      status: 'active',
    }).sort('lineNumber');
    res.json(lines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all production lines
const getAllProductionLines = async (req, res) => {
  try {
    const lines = await ProductionLine.find({ status: 'active' })
      .populate('workshop', 'workshopName')
      .sort([['workshop', 1], ['lineNumber', 1]]);
    res.json(lines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create production line
const createProductionLine = async (req, res) => {
  const { workshop, lineNumber, description } = req.body;

  if (!workshop || !lineNumber) {
    return res.status(400).json({ message: 'Xưởng và số chuyền không được để trống' });
  }

  if (lineNumber < 1 || lineNumber > 16) {
    return res.status(400).json({ message: 'Số chuyền phải từ 1 đến 16' });
  }

  try {
    // Verify workshop exists
    const workshopExists = await Workshop.findById(workshop);
    if (!workshopExists) {
      return res.status(404).json({ message: 'Xưởng không tồn tại' });
    }

    // Check if line already exists
    const existingLine = await ProductionLine.findOne({ workshop, lineNumber });
    if (existingLine) {
      return res.status(400).json({ message: 'Chuyền này đã tồn tại' });
    }

    const lineName = `${workshopExists.workshopName}${lineNumber}`;
    const line = new ProductionLine({
      workshop,
      lineNumber,
      lineName,
      description: description || '',
    });

    const savedLine = await line.save();
    await savedLine.populate('workshop', 'workshopName');
    res.status(201).json(savedLine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update production line
const updateProductionLine = async (req, res) => {
  try {
    const line = await ProductionLine.findById(req.params.id).populate('workshop', 'workshopName');
    if (!line) {
      return res.status(404).json({ message: 'Chuyền không tồn tại' });
    }

    if (req.body.description) line.description = req.body.description;
    if (req.body.status) line.status = req.body.status;

    const updatedLine = await line.save();
    res.json(updatedLine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete production line
const deleteProductionLine = async (req, res) => {
  try {
    const line = await ProductionLine.findByIdAndDelete(req.params.id);
    if (!line) {
      return res.status(404).json({ message: 'Chuyền không tồn tại' });
    }
    res.json({ message: 'Chuyền đã xóa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // Workshop
  getAllWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
  // Production Line
  getProductionLinesForWorkshop,
  getAllProductionLines,
  createProductionLine,
  updateProductionLine,
  deleteProductionLine,
};
