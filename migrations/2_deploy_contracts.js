const Migrations = artifacts.require("SocialNetwork");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};