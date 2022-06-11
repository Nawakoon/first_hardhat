// import
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    const SimpleFactory = await ethers.getContractFactory("Simple")
    console.log("Deploying contract")
    const simple = await SimpleFactory.deploy()
    // if we didn't put any agrument
    // hardhat will run this function in defaultNetwork -> hardhat network
    // work like $ yarn hardhat run scripts/deploy.js --network hardhat
    await simple.deployed()
    console.log(`Deployed contract to: ${simple.address}`)
    // see what happens when we deploy to hardhat local network

    if (network.config.chainId === 4 && process.env.ETERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        // wait ETHERSCAN to detect contract
        await simple.deployTransaction.wait(6)
        // [] mean the lastest address
        await verify(simple.address, [])
    }
    const currentValue = await simple.retrieve()
    console.log(`Currennt Value is: ${currentValue}`)

    // Update the current value
    const transactionResponse = await simple.store(100)
    await transactionResponse.wait(1)
    const updatedValue = await simple.retrieve()
    console.log(`Update Value is: ${updatedValue}`)
    console.log("Do you know handsome guy")
    const handsomeGuy = await simple.seeWhoHandsome()
    console.log(`=> ${handsomeGuy}`)
    // console.log(updatedValue)            // BigNumber { value: "99" }
    // console.log(typeof updatedValue)     // this guy is object
    // console.log(typeof handsomeGuy)      // this guy is string
}

// if something go wrong try this guy
// https://ethereum.stackexchange.com/questions/121176/error-when-trying-to-verify-contract/123243#123243?newreg=2f23593b9ee54a7b8717b9911ecd61b3
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
