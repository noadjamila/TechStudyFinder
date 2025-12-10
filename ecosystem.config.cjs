module.exports = {
  apps: [
    {
      name: "techstudyfinder",
      script: "server/dist/index.js",
      cwd: "/home/deployuser/projects/TechStudyFinder",
      env: {
        DEPLOY_SCRIPT_PATH: "/home/deployuser/projects/TechStudyFinder/scripts/deploy.sh",
      },
    },
  ],
};
