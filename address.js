const { mnemonicToWalletKey } = require("ton-crypto");
const { mnemonicNew } = require("ton-crypto");
const { WalletContractV3R2, WalletContractV4, Cell, contractAddress } = require("ton");

let addressList = [];
async function generateKeys() {
    // 生成助记词
    const mnemonic = await mnemonicNew();
    // console.log('助记词:', mnemonic.join(' '));

    // 通过助记词生成密钥对
    const key = await mnemonicToWalletKey(mnemonic);
    // console.log('私钥:', key.secretKey.toString('hex'));
    // console.log('公钥:', key.publicKey.toString('hex'));
    return { mnemonic: mnemonic.join(' '), secretKey: key.secretKey.toString('hex'), publicKey: key.publicKey.toString('hex') }
}

async function generateTonAddress(publicKey) {
    // console.log('公钥:', publicKey);
    // 使用公钥创建钱包合约
    const walletSource = WalletContractV4.create({
        publicKey: Buffer.from(publicKey, 'hex'),
        workchain: -1,  // 0 表示工作链，-1 表示主链
    });
    // console.log('合约源代码:', walletSource);
    // console.log('合约源代码:', walletSource.init.code);
    // console.log('合约数据:', walletSource.init.data);
    // 生成合约地址
    const address = contractAddress(-1, walletSource.init);

    // console.log('TON 地址:', address.toString());
    return address.toString();
}

async function main() {
    for (let i = 0; i < 10; i++) {
        const key = await generateKeys();
        // console.log('密钥对:', key);
        const address = await generateTonAddress(key.publicKey);
        addressList.push({ address: address, mnemonic: key.mnemonic, secretKey: key.secretKey });
    }
    console.log('地址列表:', addressList);
}

main();

