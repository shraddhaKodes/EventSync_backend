export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE) || 1;
  const expireDate = new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000);

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: expireDate,
      httpOnly: true, // ✅ Prevents XSS attacks
      sameSite: "None", // ✅ Prevents CSRF attacks
      secure: true,
    })
    .json({
      success: true,
      message,
      token,  // ✅ Include token in response
      user,
    });
};
