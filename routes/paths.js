module.exports = {
  AUTH_LOGIN: {
    fullPath: "/auth/login",
    path: "/login",
    ensureLoggedIn: false,
  },
  AUTH_ME: {
    fullPath: "/auth/me",
    path: "/me",
    ensureLoggedIn: true,
  },
  AUTH_REGISTER: {
    fullPath: "/auth/register",
    path: "/register",
    ensureLoggedIn: false,
  },
};
