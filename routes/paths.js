module.exports = {
  // Auth Paths
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
  // Dict Paths
  DICT_DEFINITION: {
    fullPath: "/dict/definition",
    path: "/definition",
    ensureLoggedIn: true,
  },
  DICT_SEARCH: {
    fullPath: "/dict/search",
    path: "/search",
    ensureLoggedIn: true,
  },
};
