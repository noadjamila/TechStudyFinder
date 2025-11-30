module.exports = {
  apps: [
    {
      name: "techstudyfinder",
      script: "server/dist/index.js",
      cwd: process.env.CWD_PATH,
      env: {
        DEPLOY_SCRIPT_PATH: process.env.DEPLOYMENT_SCRIPT_PATH,
      },
    },
  ],
};
