import chai from "chai";
const ethers = require("ethers");
import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from "ethereum-waffle";
import TokenMock from "../build/TokenMock";
import LinkdropERC20Referral from "../build/LinkdropERC20Referral";

chai.use(solidity);
const { expect } = chai;

const ADDRESS_ZERO = ethers.utils.getAddress(
  "0x0000000000000000000000000000000000000000"
);

let provider = createMockProvider();
let [linkdropper, linkdropVerifier, receiver] = getWallets(provider);

const CLAIM_AMOUNT = 20;
const REFERRAL_AMOUNT = 5;
const LINKDROP_VERIFICATION_ADDRESS = linkdropVerifier.address;

let tokenInstance;
let linkdropInstance;
let link;
let referralAddress;
let receiverAddress;
let receiverSignature;

const signLinkAddress = async function(linkAddress, referralAddress) {
  let messageHash = ethers.utils.solidityKeccak256(
    ["address", "address"],
    [linkAddress, referralAddress]
  );
  let messageHashToSign = ethers.utils.arrayify(messageHash);
  let signature = await linkdropVerifier.signMessage(messageHashToSign);
  return signature;
};

const createLink = async function(referralAddress) {
  let wallet = ethers.Wallet.createRandom();
  let key = wallet.privateKey;
  let address = wallet.address;
  let verificationSignature = await signLinkAddress(address, referralAddress);
  return {
    key, //link's ephemeral private key
    address, //address corresponding to link key
    verificationSignature, //signed by linkdrop verifier
    referralAddress //referral address
  };
};

const signReceiverAddress = async function(linkKey, receiverAddress) {
  let wallet = new ethers.Wallet(linkKey);
  let messageHash = ethers.utils.solidityKeccak256(
    ["address"],
    [receiverAddress]
  );
  let messageHashToSign = ethers.utils.arrayify(messageHash);
  let signature = await wallet.signMessage(messageHashToSign);
  return signature;
};

describe("Linkdrop ERC20Referral tests", () => {
  before(async () => {
    tokenInstance = await deployContract(linkdropper, TokenMock, [
      linkdropper.address,
      1000
    ]);

    linkdropInstance = await deployContract(
      linkdropper,
      LinkdropERC20Referral,
      [
        tokenInstance.address,
        CLAIM_AMOUNT,
        REFERRAL_AMOUNT,
        LINKDROP_VERIFICATION_ADDRESS
      ]
    );
  });

  it("assigns correct token address", async () => {
    expect(await linkdropInstance.TOKEN_ADDRESS()).to.eq(tokenInstance.address);
  });

  it("assigns correct claim amount", async () => {
    expect(await linkdropInstance.CLAIM_AMOUNT()).to.eq(CLAIM_AMOUNT);
  });

  it("assigns correct referral reward", async () => {
    expect(await linkdropInstance.REFERRAL_REWARD()).to.eq(REFERRAL_AMOUNT);
  });

  it("assigns owner of the contract as linkdropper", async () => {
    expect(await linkdropInstance.LINKDROPPER()).to.eq(linkdropper.address);
  });

  it("assigns correct linkdrop verification address", async () => {
    expect(await linkdropInstance.LINKDROP_VERIFICATION_ADDRESS()).to.eq(
      LINKDROP_VERIFICATION_ADDRESS
    );
  });

  it("assigns initial token balance of linkdropper", async () => {
    expect(await tokenInstance.balanceOf(linkdropper.address)).to.eq(1000);
  });

  it("creates new link key and verifies its signature", async () => {
    link = await createLink(ADDRESS_ZERO);

    expect(
      await linkdropInstance.verifyLinkKey(
        link.address,
        link.referralAddress,
        link.verificationSignature
      )
    ).to.be.true;
  });

  it("signs receiver address with link key and verifies this signature onchain", async () => {
    link = await createLink(ADDRESS_ZERO);
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(link.key, receiverAddress);

    expect(
      await linkdropInstance.verifyReceiverAddress(
        link.address,
        receiverAddress,
        receiverSignature
      )
    ).to.be.true;
  });

  it("should fail to claim tokens when paused", async () => {
    referralAddress = ADDRESS_ZERO;
    link = await createLink(referralAddress);
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(link.key, receiverAddress);

    await linkdropInstance.pause(); //Pausing contract

    await expect(
      linkdropInstance.claim(
        receiverAddress,
        referralAddress,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 80000 }
      )
    ).to.be.reverted;
  });

  it("should fail to claim more than approved amount of tokens", async () => {
    await linkdropInstance.unpause(); //Unpausing
    referralAddress = ADDRESS_ZERO;
    link = await createLink(referralAddress);
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(link.key, receiverAddress);
    await expect(
      linkdropInstance.claim(
        receiverAddress,
        referralAddress,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.reverted;
  });

  it("should succesfully claim tokens with valid claim params", async () => {
    //Approving tokens from linkdropper to Linkdrop Contract
    await tokenInstance.approve(linkdropInstance.address, 1000);

    referralAddress = ethers.Wallet.createRandom().address;
    link = await createLink(referralAddress);
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(link.key, receiverAddress);

    await expect(
      linkdropInstance.claim(
        receiverAddress,
        referralAddress,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    )
      .to.emit(linkdropInstance, "Claimed")
      .to.emit(tokenInstance, "Transfer") //should transfer claimed tokens to receiver
      .withArgs(linkdropper.address, receiverAddress, CLAIM_AMOUNT);

    let receiverTokenBalance = await tokenInstance.balanceOf(receiverAddress);
    expect(receiverTokenBalance).to.eq(CLAIM_AMOUNT);

    let referralTokenBalance = await tokenInstance.balanceOf(referralAddress);
    expect(referralTokenBalance).to.eq(REFERRAL_AMOUNT);
  });

  it("should fail to claim link twice", async () => {
    await expect(
      linkdropInstance.claim(
        receiverAddress,
        referralAddress,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith("Link has already been claimed");
  });

  it("should fail to claim tokens with fake verification signature", async () => {
    let wallet = ethers.Wallet.createRandom();
    let linkKeyaddress = wallet.address;

    let message = ethers.utils.solidityKeccak256(
      ["address", "address"],
      [linkKeyaddress, ADDRESS_ZERO]
    );
    let messageToSign = ethers.utils.arrayify(message);
    let fakeSignature = await receiver.signMessage(messageToSign);

    await expect(
      linkdropInstance.claim(
        receiverAddress,
        referralAddress,
        linkKeyaddress,
        fakeSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith("Link key is not signed by linkdrop verification key");
  });

  it("should fail to claim tokens with fake receiver signature", async () => {
    referralAddress = ADDRESS_ZERO;
    link = await createLink(referralAddress);
    let fakeLink = await createLink(referralAddress); //another fake link
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(
      fakeLink.key, //signing receiver address with fake link key
      receiverAddress
    );
    await expect(
      linkdropInstance.claim(
        receiverAddress,
        referralAddress,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith("Receiver address is not signed by link key");
  });
});
