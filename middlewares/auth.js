import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler("Unauthorized: No token provided!", 401));
  }

  try {
    // Verify the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    // Fetch user from DB
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found. Authentication failed!", 401));
    }

    next();
  } catch (error) {
    console.log("error in the authenticate");
    return next(new ErrorHandler("Invalid or Expired Token. Please login again!", 401));
  }
});


///as your previous project service > auth.js (setuser and get user using jsonwebtoken ) not using statefull authentication 
//memory extensive using map


// Middleware for role-based access control
export function restrictTo(roles = []) {
  return function (req, res, next) {
    const token_cookie = req.cookies?.token;
    const user = getUser(token_cookie); 
    req.user = user;
    console.log(req.user);
    if (!req.user) {
      return res.redirect('/sign_in'); // Redirect if user is not authenticated
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Unauthorized'); // Deny access if user role is not allowed
    }

    next(); // Proceed if the user's role is authorized
  };
}
