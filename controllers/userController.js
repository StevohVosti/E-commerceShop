const User = require("../models/userModel");

// register user

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "myCloud.public_id", url: "myCloud.secure_url" },
    });

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// login user

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// logout
exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "Logged out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user Details

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.find();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// UpdatePassword
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Please add old ans new Password",
      });
    }

    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Incorrect Old Password",
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Updated",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// update user Profile

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const { name, email, avatar } = req.body;

    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
      });
      user.avatar.public_id = myCloud.public_id;
      user.avatar.url = myCloud.secure_url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile is Updated",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All users

exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single Users (admin)

exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).json({
        success: false,
        message: `User does not exist with Id: ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update User Role

exports.updateUserRole = async (req, res) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete user

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(400).json({
        success: false,
        message: `User does not exist with Id: ${req.params.id}`,
      });
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: "User Deleted",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
