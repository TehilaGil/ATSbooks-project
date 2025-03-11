const Grade = require("../models/Grade");
// create
const creatNewGrade = async (req, res) => {
    const { name, image } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }
    const duplicate = await Grade.findOne({ name }).lean();
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate grade name" });
    }
    const grade = await Grade.create({ name, image });
    if (!grade) {
        return res.status(500).json({ message: "Failed to create grade" });
    }
    res.status(201).json(grade);
};

// read
const getAllGrade = async (req, res) => {
    const grades = await Grade.find().lean().sort({ name: 1 });
    if (!grades?.length) {
        return res.status(204).json({ message: 'No grades found' });
    }
    res.json(grades);
};

// read by id
// const getGradeById = async (req, res) => {
//     const { id } = req.params;
//     const grade = await Grade.findById(id).lean();
//     if (!grade) {
//         return res.status(400).json({ message: `Grade with ID ${id} not found` });
//     }
//     res.json(grade);
// };

// update
const updateGrade = async (req, res) => {
    const { _id, name, image } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }
    console.log( _id, name, image );
    const grade = await Grade.findById(_id);
    console.log(grade);
    if (!grade) {
        return res.status(400).json({ message: `Grade with ID ${_id} not found` });
    }

    const duplicate = await Grade.findOne({ name }).lean();
    if (duplicate && duplicate._id.toString() !== _id) {
        return res.status(409).json({ message: "Duplicate grade name" });
    }

    grade.name = name;
    grade.image = image;

    const updatedGrade = await grade.save();
    if (!updatedGrade) {
        return res.status(500).json({ message: "Failed to update grade" });
    }

    const grades = await Grade.find().lean();
    res.json(grades);
};


// delete
const deleteGrade = async (req, res) => {
    const { id } = req.params;
    const grade = await Grade.findById(id);
    if (!grade) {
        return res.status(400).json({ message: `Grade with ID ${id} not found` });
    }

    const result = await Grade.deleteOne({ _id: id });
    if (!result.deletedCount) {
        return res.status(500).json({ message: "Failed to delete grade" });
    }

    const grades = await Grade.find().lean();
    if (!grades?.length) {
        return res.status(204).json({ message: 'No grades found' });
    }
    res.json(grades);
};

module.exports = { creatNewGrade, getAllGrade, updateGrade, deleteGrade };//,getGradeById
