import chai from "chai";
const ethers = require("ethers");
import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from "ethereum-waffle";
import NFTMock from "../build/NFTMock";
import LinkdropERC721 from "../build/LinkdropERC721";

chai.use(solidity);
const { expect } = chai;

const ADDRESS_ZERO = ethers.utils.getAddress(
  "0x0000000000000000000000000000000000000000"
);

const ONE_ETHER = ethers.utils.parseEther("1");

let provider = createMockProvider();
let [linkdropper, linkdropVerifier, receiver] = getWallets(provider);

const LINKDROP_VERIFICATION_ADDRESS = linkdropVerifier.address;

let nftInstance;
let linkdropInstance;
let link;
let tokenId;
let receiverAddress;
let receiverSignature;

const signLinkAddress = async function(linkAddress, tokenId) {
  let messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint"],
    [linkAddress, tokenId]
  );
  let messageHashToSign = ethers.utils.arrayify(messageHash);
  let signature = await linkdropVerifier.signMessage(messageHashToSign);
  return signature;
};

const createLink = async function(tokenId) {
  let wallet = ethers.Wallet.createRandom();
  let key = wallet.privateKey;
  let address = wallet.address;
  let verificationSignature = await signLinkAddress(address, tokenId);
  return {
    key, //link's ephemeral private key
    address, //address corresponding to link key
    verificationSignature, //signed by linkdrop verifier
    tokenId //nft id
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

describe("Linkdrop ERC721 tests", () => {
  before(async () => {
    nftInstance = await deployContract(linkdropper, NFTMock, [
      linkdropper.address,
      10 //minting 10 NFTs to the contract owner | tokenIds: [0,9]
    ]);

    linkdropInstance = await deployContract(linkdropper, LinkdropERC721, [
      nftInstance.address,
      LINKDROP_VERIFICATION_ADDRESS
    ]);
  });

  it("assigns correct NFT address", async () => {
    expect(await linkdropInstance.NFT_ADDRESS()).to.eq(nftInstance.address);
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
    expect(await nftInstance.balanceOf(linkdropper.address)).to.eq(10);
  });

  it("assigns linkdropper as owner of initial NFTs", async () => {
    expect(await nftInstance.ownerOf(9)).to.eq(linkdropper.address);
  });

  it("should fail to send eth to linkdrop contract address", async () => {
    let tx = {
      to: linkdropInstance.address,
      value: ONE_ETHER
    };
    await expect(linkdropper.sendTransaction(tx)).to.be.reverted;
  });

  it("creates new link key and verifies its signature", async () => {
    tokenId = 0;
    link = await createLink(tokenId);

    expect(
      await linkdropInstance.verifyLinkKey(
        link.address,
        link.tokenId,
        link.verificationSignature
      )
    ).to.be.true;
  });

  it("signs receiver address with link key and verifies this signature onchain", async () => {
    link = await createLink(tokenId);
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

  it("should fail to claim NFT when paused", async () => {
    link = await createLink(tokenId);
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(link.key, receiverAddress);

    await linkdropInstance.pause(); //Pausing contract

    await expect(
      linkdropInstance.claim(
        receiverAddress,
        tokenId,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 80000 }
      )
    ).to.be.reverted;
  });

  it("should fail to claim non approved NFT", async () => {
    await linkdropInstance.unpause(); //Unpausing
    link = await createLink(tokenId);
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(link.key, receiverAddress);
    await expect(
      linkdropInstance.claim(
        receiverAddress,
        tokenId, //NFT with this id is not approved yet
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.reverted;
  });

  it("should succesfully claim NFT with valid claim params", async () => {
    tokenId = 0;
    //Approving NFT with tokenID = 0 from linkdropper to Linkdrop Contract
    await nftInstance.approve(linkdropInstance.address, tokenId);

    link = await createLink(tokenId);
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(link.key, receiverAddress);

    await expect(
      linkdropInstance.claim(
        receiverAddress,
        tokenId,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    )
      .to.emit(linkdropInstance, "Claimed")
      .to.emit(nftInstance, "Transfer") //should transfer claimed NFT
      .withArgs(linkdropper.address, receiverAddress, tokenId);
  });

  it("should fail to claim link twice", async () => {
    await expect(
      linkdropInstance.claim(
        receiverAddress,
        tokenId,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith("Link has already been claimed");
  });

  it("should fail to claim NFT with fake verification signature", async () => {
    let wallet = ethers.Wallet.createRandom();
    let linkKeyaddress = wallet.address;

    let message = ethers.utils.solidityKeccak256(
      ["address", "uint"],
      [linkKeyaddress, tokenId]
    );
    let messageToSign = ethers.utils.arrayify(message);
    let fakeSignature = await receiver.signMessage(messageToSign);

    await expect(
      linkdropInstance.claim(
        receiverAddress,
        tokenId,
        linkKeyaddress,
        fakeSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith("Link key is not signed by linkdrop verification key");
  });

  it("should fail to claim NFT with fake receiver signature", async () => {
    link = await createLink(tokenId);
    let fakeLink = await createLink(tokenId); //another fake link
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(
      fakeLink.key, //signing receiver address with fake link key
      receiverAddress
    );
    await expect(
      linkdropInstance.claim(
        receiverAddress,
        tokenId,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith("Receiver address is not signed by link key");
  });

  it("should fail to claim NFT with already claimed tokenId", async () => {
    link = await createLink(tokenId); //NFT with this tokenId has already been claimed by othe receiver
    receiverAddress = ethers.Wallet.createRandom().address;
    receiverSignature = await signReceiverAddress(link.key, receiverAddress);

    await expect(
      linkdropInstance.claim(
        receiverAddress,
        tokenId,
        link.address,
        link.verificationSignature,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.reverted;
  });
});
