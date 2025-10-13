const clothingItem = require("../models/clothingitems");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Server error" });
    });
};

const postNewItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      res.status(400).send({ message: "Invalid data" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send({ message: "Item deleted " });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal server error" });
    });
};

module.exports = { getItems, postNewItem, deleteItem };
