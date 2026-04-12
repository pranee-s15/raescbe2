import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

const sanitizeAddress = (address = {}) => ({
  fullName: address.fullName?.trim() || '',
  addressLine1: address.addressLine1?.trim() || '',
  addressLine2: address.addressLine2?.trim() || '',
  city: address.city?.trim() || '',
  state: address.state?.trim() || '',
  postalCode: address.postalCode?.trim() || '',
  country: address.country?.trim() || 'India'
});

const serializeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  address: sanitizeAddress(user.address),
  wishlist: user.wishlist
});

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name || !normalizedEmail || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required.');
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(400);
    throw new Error('An account already exists with this email.');
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    password,
    phone: phone?.trim() || '',
    address: sanitizeAddress(address)
  });

  res.status(201).json({
    message: 'Account created successfully.',
    user: serializeUser(user),
    token: generateToken(user._id, user.role)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  res.json({
    message: 'Login successful.',
    user: serializeUser(user),
    token: generateToken(user._id, user.role)
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('wishlist');
  res.json(user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.name = req.body.name?.trim() || user.name;
  user.phone = req.body.phone?.trim() || '';
  user.address = sanitizeAddress(req.body.address);

  await user.save();

  await user.populate('wishlist');

  res.json({
    message: 'Profile updated successfully.',
    user: serializeUser(user)
  });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  const isWishlisted = user.wishlist.some((id) => id.toString() === productId);

  if (isWishlisted) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  await user.populate('wishlist');

  res.json({
    message: isWishlisted ? 'Removed from wishlist.' : 'Added to wishlist.',
    wishlist: user.wishlist
  });
});
