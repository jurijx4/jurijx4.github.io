const Relationships = artifacts.require("Relationships");
const { items: ItemStruct, isDefined, isPayable, isType } = require("./ast_helper");
let { catchRevert } = require("./exceptionHelpers.js");

contract("Relationships", (accounts) => {
    let [alice, bob] = accounts;
    let names = ["Alice", "Bob"];
    let contractInstance;
    beforeEach(async () => {
        contractInstance = await Relationships.new();
    });
    describe("enum Status", () => {
        let enumStatus;
        before(() => {
          enumStatus = Relationships.enums.Status;
          assert(
            enumStatus,
            "The contract should define an Enum called Status"
          );
        });
  
        it("should define `SINGLE`", () => {
          assert(
            enumStatus.hasOwnProperty('SINGLE'),
            "The enum does not have a `SINGLE` value"
          );
        });
  
        it("should define `TAKEN`", () => {
          assert(
            enumStatus.hasOwnProperty('TAKEN'),
            "The enum does not have a `TAKEN` value"
          );
        });
  
        it("should define `MARRIED`", () => {
          assert(
            enumStatus.hasOwnProperty('MARRIED'),
            "The enum does not have a `MARRIED` value"
          );
        });
      })

    describe("Relationship struct", () => {
        let subjectStruct;
  
        before(() => {
          subjectStruct = ItemStruct(Relationships);
          assert(
            subjectStruct !== null, 
            "The contract should define an `Relationship Struct`"
          );
        });
  
        it("should have a `id`", () => {
          assert(
            isDefined(subjectStruct)("id"), 
            "Struct Item should have a `id` member"
          );
          assert(
            isType(subjectStruct)("id")("uint256"), 
            "`id` should be of type `uint256`"
          );
        });

        it("should have a `creator`", () => {
            assert(
              isDefined(subjectStruct)("creator"), 
              "Struct Relationship should have a `creator` member"
            );
            assert(
              isType(subjectStruct)("creator")("address"), 
              "`creator` should be of type `address`"
            );
          });

        it("should have a `first_person`", () => {
            assert(
                isDefined(subjectStruct)("first_person"), 
                "Struct Relationship should have a `first_person` member"
            );
            assert(
                isType(subjectStruct)("first_person")("string"), 
                "`first_person` should be of type `string`"
            );
        });        

        it("should have a `second_person`", () => {
          assert(
            isDefined(subjectStruct)("second_person"), 
            "Struct Relationship should have a `second_person` member"
          );
          assert(
            isType(subjectStruct)("second_person")("string"), 
            "`second_person` should be of type `string`"
          );
        });
  
        it("should have a `status`", () => {
          assert(
            isDefined(subjectStruct)("status"), 
            "Struct Relationship should have a `status` member"
          );
        });

        it("should have a `kids`", () => {
            assert(
              isDefined(subjectStruct)("kids"), 
              "Struct Relationship should have a `kids` member"
            );
            assert(
              isType(subjectStruct)("kids")("uint"), 
              "`kids` should be of type `uint`"
            );
        });
      });
      describe("Use cases", () => {
        it("should allow user to get in action by saying he/she is single", async () => {
            const result = await contractInstance.createRelationship(names[0], names[1], 0, 0, {from: alice});
            assert.equal(result.receipt.status, true);
            assert.equal(result.logs[0].args.first_person, names[0]);
            assert.equal(result.logs[0].args.second_person, names[1]);
            assert.equal(result.logs[0].args.status, 0);
        });
        it("should allow user to get in to the relationship", async () => {
            const result = await contractInstance.createRelationship(names[0], names[1], 1, 0, {from: alice});
            assert.equal(result.receipt.status, true);
            assert.equal(result.logs[0].args.first_person, names[0]);
            assert.equal(result.logs[0].args.second_person, names[1]);
            assert.equal(result.logs[0].args.status, 1);
        });
        it("should allow user to get married", async () => {
            const result = await contractInstance.createRelationship(names[0], names[1], 2, 0, {from: alice});
            assert.equal(result.receipt.status, true);
            assert.equal(result.logs[0].args.first_person, names[0]);
            assert.equal(result.logs[0].args.second_person, names[1]);
            assert.equal(result.logs[0].args.status, 2);
        });
        it("user is not in action so he/she cant terminate the relationship", async () => {
            await catchRevert(contractInstance.itsNotWorking(names[0], {from: alice}));
        });
        it("should allow user to terminate the relathionship", async () => {
            await contractInstance.createRelationship(names[0], names[1], 2, 0, {from: alice});
            const result = await contractInstance.itsNotWorking(names[1], {from: alice});
            assert.equal(result.receipt.status, true);
            assert.equal(result.logs[0].args.status, 0);
        });
        it("user is not in action so he/she cant add kids", async () => {
            await catchRevert(contractInstance.itsNotWorking(names[1], {from: alice}));
        });
        it("should allow user to add more kids", async () => {
            await contractInstance.createRelationship(names[0], names[1], 2, 2, {from: alice});
            const result = await contractInstance.addKids(2,{from: alice});
            assert.equal(result.receipt.status, true);
            assert.equal(result.logs[0].args.kids, 4);
        });
    
      });
})