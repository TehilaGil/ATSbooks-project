const Title = require("../models/Title")
const File = require("../models/File")


const createNewTitle = async (req, res) => {
    const { name, book } = req.body;

    if (!book || !name) {
        return res.status(400).json({ message: 'Book and name are required' });
    }

    const existTitle = await Title.findOne({ name, book }).exec();
    if (existTitle) {
        return res.status(409).json({ message: 'Title already exists for this book' });
    }

    const title = await Title.create({ name, book });
    if (!title) {
        return res.status(500).json({ message: 'Failed to create title' });
    }

    res.status(201).json({ message: 'Title created successfully', title });
};

//הנוכחי book  להביא את כל הכותרות ל 
const getAllTitles = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Book ID is required' });
    }

    const titles = await Title.find({ book: id }).populate('book').exec();
    if (!titles.length) {
        return res.status(200).json({ message: 'No titles found' });
    }

    res.status(200).json(titles);
};
//titlebybook


const getTitleById = async (req, res) => {
    const { id } = req.params
    const title = await Title.findById(id).lean()
    if (!title) {
        return res.status(404).json({ message: 'No title found' })
    }
    res.status(200).json(title);
}

const deleteTitle = async (req, res) => {
    const { id } = req.params
    const title = await Title.findById(id).exec()
    if (!title) {
        return res.status(400).json({ message: 'title not found' })
    }
    const files = await File.find({ title: title._id }).exec();
    if (files?.length > 0) {
        for (let file of files) {
            await File.deleteOne({ _id: file._id });  // מחיקת קובץ אחד אחרי השני - ***
        }
    }
    const result = await Title.deleteOne({ _id: id });  // ***
    if (result.deletedCount === 0) {
        return res.status(400).json({ message: 'Failed to delete title' });
    }
    const titles = await Title.find().lean().populate("book")
    if (!titles?.length) {
        return res.status(400).json({ message: 'No titles found' })
    }
    res.json(titles)
}





module.exports = { createNewTitle, getAllTitles, getTitleById, deleteTitle }
