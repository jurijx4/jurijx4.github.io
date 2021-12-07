const Relationships = artifacts.require("Relationships");

module.exports = function (deployer) {
  deployer.deploy(Relationships);
};
