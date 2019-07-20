export default {
  titles: {
    createLinkKey: 'Create Link Key',
    setupCampaign: 'Setup Campaign',
    chooseToken: 'Choose token',
    total: 'Total:',
    fillTheField: 'Fill all fields to see the details',
    amountPerLink: 'Amount per link',
    totalLinks: 'Total links to distribute',
    howTo: 'How to:',
    addIcon: 'Check your icon, if not<br>—submit or send to us',
    eth: 'ETH',
    ethInLinks: '{{ethAmount}} ETH in {{linksAmount}} links',
    holdEth: 'Ether will be hold in Linkdrop Contract',
    oneLinkContains: 'One link contains: ',
    oneLinkContentsWithEth: '{{tokenAmount}} {{tokenSymbol}} + {{ethAmount}} ETH',
    oneLinkContents: '{{tokenAmount}} {{tokenSymbol}}',
    // step1

    tokenAddress: 'Token Address',
    tokenAddressPlaceholder: '0x Token Address',

    // step2
    summaryPay: 'Summary & Pay',
    linksToGenerate: 'Links to generate',
    oneLinkContainsTitle: 'One link contains',
    serviceFeeTitle: 'Service fee',
    totalEthInLinks: 'Total ETH in links',
    ethPerLink: '{{eth}} ETH per link',
    ethHold: 'Will be hold in Linkdrop Contract',
    charge: 'We charge you <strong>{{price}} ETH</strong> to start generate links',
    approveTokens: 'Approve permission to spend <span>{{tokenAmount}} {{tokenSymbol}}</span> for generating links',
    sendEthToGenerate: 'You wil send <span>{{ethAmount}} ETH</span> to start generate links',
    etherToDistribute: '<span>{{ethAmount}} ETH</span> — Ether to distribute',
    serviceFeeToDistribute: '<span>{{ethAmount}} ETH</span> — Service fee',

    // step3
    sendEth: 'Send {{ethAmount}} ETH to Linkdrop Contract',
    serviceFee: '<span>{{price}} ETH</span> in service fees',
    serviceFeePerLink: '<span>{{price}} ETH</span> per link, for covering gas fees and our service costs',

    // step4
    generatingLinks: 'Generating links…',
    loadingProcess: 'It may take a few minuts, <span>don’t close this page</span>',

    // step5
    getTheLinks: 'Get the Links',
    linkdropSdk: 'Linkdrop SDK',
    automaticDistribution: 'Automatic distribution on the fly',
    nodeJsSupport: 'Right now Linkdrop SDK supports only Node.js.',
    otherPlatforms: 'We\'re working on adding other languages and platforms.',
    contactUs: ' Contact us for more details.',
    codeDetails: 'See the code and deatails',
    contractParams: 'Linkdrop Contract parameters',
    masterAddress: 'Master Address: <span>{{address}}</span>',
    signingKey: 'Signing Key: <span>{{signingKey}}</span>',
    downloadFile: 'Download CSV file',
    manual: 'Manual distribution',
    howToClaimPreview: 'How claim page will look like for receivers — <a href={{url}}>Preview<a/>',
    faq: 'FAQ',
    visitHelpCenter: 'Visit Help Center',
    customizations: 'Customization of Claim page',
    pauseOrStop: 'Pause / Stop Linkdrop campaign',
    analytics: 'Analytics of Linkdrop campaign'
  },
  texts: {
    _1: 'Before setup Linkdrop campaign you need to create a key',
    _3: 'It’s created once and will work for the next campaigns.',
    _2: 'The Link Key is a unique private key that allows us to sign every link for you so you no need to do it manually.',
    _4: 'To create Link Key simply click on “Create” button below and confirm transaction.',

    // step2
    _6: 'By service fees, we cover Gas costs for links distribution and our operation costs.',
    _7: 'For now, we charge fix price — {{price}} ETH per link.',
    _8: 'We use Stripe to process payments so we don’t know and don’t store your bank card details.',

    // step3
    _9: 'One more thing, to complete generating links you need to send Ether for links and fees to Linkdrop Contract',
    _10: 'Ether will be stored in Linkdrop Contract. You can stop campaign anytime and get back your Ether.',
    _11: 'To send {{ethAmount}} ETH to Linkdrop Contract simply click on “Send” button and confirm transaction.',
    _12: 'MetaMask will show you <span>Transaction<br/>pop-up that you need to confirm',
    _13: 'We plan to charge in USD and add monthly plans soon. For Enterprise customers, we offer custom solutions. Contact us for more details.',
    _14: 'Approve permission to spend {{amount}} {{tokenSymbol}} for generating links',
    _15: 'You wil send {{eth}} ETH to start generate links',
    _16: '{{eth}} ETH — Ether to distribute',
    _17: '{{eth}} ETH — Service fee',
    codeBlock: `// import library
const linkGenerator = require(‘volca-link-generator’);

// init link generator
const linkGenerator = LinkGenerator({
       verificationPK: ‘32ebc000000000000000000000000000000000000000
       contractAddress: ‘0xa712700000000000000000000000000000000000’
       networkId: ‘3’
});

//Usage example:
// Generating claim link for tokenId #1
const tokenId = 1;
const claimLink = linkGenerator.generatorNFT(tokenId);`
  },
  buttons: {
    create: 'Create',
    next: 'Next',
    addTokenIcon: 'Add Token Icon',
    addEth: '+ ETH',
    payAndContinue: 'Pay & Continue',
    send: 'Send',
    useLinkdropSdk: 'Use Linkdrop SDK',
    seeOnGithub: 'See How-To On Github',
    downloadCsv: 'Download CSV',
    qr: 'QR-Codes',
    approve: 'Approve',
    sendAndContinue: 'Send & Continue'
  }
}
