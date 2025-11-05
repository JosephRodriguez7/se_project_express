const clothingItem = require("../models/clothingitems");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../middlewares/error-handler");

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const postNewItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!name || !weather || !imageUrl) {
    throw new BadRequestError("Name, weather, and imageUrl are required");
  }

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!itemId) {
    throw new BadRequestError("Item ID is required");
  }

  clothingItem
    .findById(itemId)
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item not found");
      }
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError(
          "You don't have permission to delete this item"
        );
      }

      return clothingItem
        .findByIdAndDelete(itemId)
        .then(() =>
          res.status(200).send({ message: "Item deleted successfully" })
        );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID format"));
      } else if (err.statusCode) {
        next(err);
      } else {
        next(err);
      }
    });
};

module.exports = { getItems, postNewItem, deleteItem };
