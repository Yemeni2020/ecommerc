const appClient = {
  auth: {
    async me() {
      return null;
    },
    logout(redirectUrl) {
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin(returnUrl) {
      if (returnUrl) window.location.href = returnUrl;
    },
  },
};

export { appClient };
