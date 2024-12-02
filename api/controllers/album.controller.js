import Album from "../models/album.model.js";

// Create a new album
export const createAlbum = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create albums"));
  }

  if (!req.body.title) {
    return next(errorHandler(400, "Please provide a title for the album"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newAlbum = new Album({
    ...req.body, slug, userId: req.user.id
  });
  try {
    const savedAlbum = await newAlbum.save();
    res.status(200).json(savedAlbum);
  } catch (error) {
    next(error);
  }
}
