export const config = {
	port: process.env.PORT || 3000,
	JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "plssetkey",
	JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY || "plssetkey",
};
