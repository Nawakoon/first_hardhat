// import
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract")
    const simpleStorage = await SimpleStorageFactory.deploy()
    // if we didn't put any agrument
    // hardhat will run this function in defaultNetwork -> hardhat network
    // work like $ yarn hardhat run scripts/deploy.js --network hardhat
    await simpleStorage.deployed()
    console.log(`Deployed contract to: ${simpleStorage.address}`)
    // see what happens when we deploy to hardhat local network
    if (network.config.chainId === 4 && process.env.ETERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await simpleStorage.deployTransaction.wait(6)
        await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Currennt Value is: ${currentValue}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Update Value is: ${updatedValue}`)
}

// args for contract that have to pass args in constructor
const verify = async (contractAddress, args) => {
    console.log("Verifying contract... ")
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
