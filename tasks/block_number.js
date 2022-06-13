// create function
const { task } = require("hardhat/config")

task("block-number", "Prints the current block number").setAction(
    // const blockTask = async function() => {
    // async function blockTask() {
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber() // hre -> hardhat run-time enviroment
        console.log(`Current block number: ${blockNumber}`)
    }
)

module.export = {}
