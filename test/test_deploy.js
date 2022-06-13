// yarn hardhat test
const { ethers } = require("hardhat")
const { expect, assert } = require("chai")

// do this as annonymous function
// write annonymous like this is the best practice
describe("SimpleStorage", function () {
    // make these variable global
    let simpleStorageFactory, simpleStorage
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
        simpleStorage = await simpleStorageFactory.deploy()
    })

    // try this for running specific test
    // $ yarn hardhat test --grep <test name>
    // $ yarn hardhat test --grep favorite
    it("Should start with a favorite number: 0", async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"
        // assert
        assert.equal(currentValue.toString(), expectedValue)
        // this work the same
        // expect(currentValue.toString()).to.equal(expectedValue)
    })
    // try this for running specific test
    // it.only("Should update when we call store", async function () {
    it("Should update when we call store", async function () {
        const expectedValue = "65"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)

        const currentValue = await simpleStorage.retrieve()
        assert.equal(currentValue.toString(), expectedValue)
    })
    it("Should work correctly with the people struct and array", async function () {
        const expectedPersonName = "Patrick"
        const expectedFavoriteNumber = "16"
        const transactionResponse = await simpleStorage.addPerson(
            expectedPersonName,
            expectedFavoriteNumber
        )
        await transactionResponse.wait(1)
        const { favoriteNumber, name } = await simpleStorage.people(0)
        assert.equal(name, expectedPersonName)
        assert.equal(favoriteNumber, expectedFavoriteNumber)
    })
})
