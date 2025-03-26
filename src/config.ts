export const config = {
	port: process.env.PORT || 3000,
	jwtSecretKey: process.env.JWT_SECRET_KEY || "plssetkey",
};
