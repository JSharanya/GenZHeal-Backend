import Virualclub from "../models/virualclub.model.js";

export const virualclub = async (req, res, next) => {
  const { content, title, image, category, type, link } = req.body;

  const newVirual = new Virualclub({
    content,
    title,
    image,
    category,
    type,
    link,
  });
  try {
    const saveVirual = await newVirual.save();
    res.status(200).json(saveVirual);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getvirualclub = async (req, res, next) => {
  try {
    const { title, category, type } = req.query;
    let filter = {};
    if (title) {
      filter.title = new RegExp(title, "i");
    }
    if (category && category!=='All') {
      filter.category = category;
    }
    if (type && type!=='All') {
      filter.type = type;
    }
  

    const virtualClubs = await Virualclub.find(filter);
    res.status(200).json(virtualClubs);

    // const getvirual = await Virualclub.find();
    // res.status(200).json(getvirual);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getvirualclubId = async (req, res) => {
  const { id } = req.params;

  try {
    const getvirual = await Virualclub.findById(id);
    if (!getvirual) {
      return res.status(404).json({ message: "virualclub not found" });
    }
    res.status(200).json(getvirual);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatevirualclubId = async (req, res) => {
  const { id } = req.params;
  const { title, content, image, category, type, link } = req.body;

  try {
    const updatevirualclub = await Virualclub.findByIdAndUpdate(
      id,
      { title, content, image, category, type, link },
      { new: true, runValidators: true }
    );
    if (!updatevirualclub) {
      return res.status(404).json({ message: "Virual not found" });
    }
    res.status(200).json(updatevirualclub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletevirualclubId = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedvirualclub = await Virualclub.findByIdAndDelete(id);
    if (!deletedvirualclub) {
      return res.status(404).json({ message: "Virual not found" });
    }
    res.status(200).json({ message: "Virual deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
