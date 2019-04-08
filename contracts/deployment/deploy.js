const etherlime = require("etherlime");
const ethers = require("ethers");
const LinkdropERC20 = require("../build/LinkdropERC20.json");
const LinkdropERC721 = require("../build/LinkdropERC721.json");
const ERC20Mock = require("../build/TokenMock.json");
const ERC721Mock = require("../build/NFTMock.json");

const linkdropper = new etherlime.EtherlimeGanacheDeployer();
const linkdropVerifier = ethers.Wallet.createRandom();

const CLAIM_AMOUNT = 10;
const REFERRAL_AMOUNT = 1;
const CLAIM_AMOUNT_ETH = ethers.utils.parseEther("0");
const LINKDROP_VERIFICATION_ADDRESS = linkdropVerifier.address;

const deploy = async (network, secret) => {
  const ERC20Instance = await linkdropper.deploy(
    ERC20Mock,
    {},
    linkdropper.signer.address,
    1000
  );

  const ERC721Instance = await linkdropper.deploy(
    ERC721Mock,
    {},
    linkdropper.signer.address,
    10
  );

  const linkdropERC20Instance = await linkdropper.deploy(
    LinkdropERC20,
    {},
    ERC20Instance.contractAddress,
    CLAIM_AMOUNT,
    REFERRAL_AMOUNT,
    CLAIM_AMOUNT_ETH,
    LINKDROP_VERIFICATION_ADDRESS
  );

  const linkdropERC721Instance = await linkdropper.deploy(
    LinkdropERC721,
    {},
    ERC721Instance.contractAddress,
    LINKDROP_VERIFICATION_ADDRESS
  );
};

module.exports = {
  deploy
};
