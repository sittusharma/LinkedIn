import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const id = req.userId;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: "Failed to get current user" });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, userName, headline, location, gender } = req.body;

    const skills = req.body.skills ? JSON.parse(req.body.skills) : [];
    const education = req.body.education ? JSON.parse(req.body.education) : [];
    const experience = req.body.experience ? JSON.parse(req.body.experience) : [];

    let profileImage;
    let coverImage;

    if (req.files?.profileImage?.[0]) {
      const upload = await uploadOnCloudinary(req.files.profileImage[0].path);
      profileImage = upload.url || upload; // make sure url is returned
    }

    if (req.files?.coverImage?.[0]) {
      const upload = await uploadOnCloudinary(req.files.coverImage[0].path);
      coverImage = upload.url || upload;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        userName,
        headline,
        location,
        gender,
        skills,
        education,
        experience,
        ...(profileImage && { profileImage }),
        ...(coverImage && { coverImage }),
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ message: `Failed to update profile: ${error.message}` });
  }
};

// GET PROFILE BY USERNAME
export const getProfile = async (req, res) => {
  try {
    const { userName } = req.params;
    const user = await User.findOne({ userName }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: `Failed to get profile: ${error.message}` });
  }
};

// SEARCH USERS
export const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query is required" });

    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
        { skills: { $in: [query] } },
      ],
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.error("search error:", error);
    return res.status(500).json({ message: `Search failed: ${error.message}` });
  }
};

// GET SUGGESTED USERS
export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId).select("connection");
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const suggestedUsers = await User.find({
      _id: {
        $ne: req.userId, // FIXED
        $nin: currentUser.connection || [],
      },
    }).select("-password");

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.error("getSuggestedUsers error:", error);
    return res.status(500).json({ message: `Failed to get suggested users: ${error.message}` });
  }
};
