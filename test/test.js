
const fs = require("fs")
const textdiff = require("../")

const v1 = fs.readFileSync(__dirname + "/v1.txt", "utf8").slice(0, -2)
const v2 = fs.readFileSync(__dirname + "/v2.txt", "utf8").slice(0, -2)
const deltas = {
    v1_to_v2: require("./delta-v1-to-v2.json"),
    v2_to_v1: require("./delta-v2-to-v1.json"),
    v1_to_v1: [[0, v1.length]],
    v1_to_empty: [[-1, v1.length, v1]],
    empty_to_v1: [[1, v1.length, v1]],
    empty_to_empty: []
}

describe("Should create correct deltas for:", () => {
    it("v1 -> v2", () => {
        (textdiff.create(v1, v2)).should.deepEqual(deltas.v1_to_v2)
    })
    it("v2 -> v1", () => {
        (textdiff.create(v2, v1)).should.deepEqual(deltas.v2_to_v1)
    })
    it("v1 -> v1", () => {
        (textdiff.create(v1, v1)).should.deepEqual(deltas.v1_to_v1)
    })
    it("v1 -> empty", () => {
        (textdiff.create(v1, "")).should.deepEqual(deltas.v1_to_empty)
    })
    it("empty -> v1", () => {
        (textdiff.create("", v1)).should.deepEqual(deltas.empty_to_v1)
    })
    it("empty -> empty", () => {
        (textdiff.create("", "")).should.deepEqual(deltas.empty_to_empty)
    })
})

describe("Should correctly apply delta patches for:", () => {
    it("v1 -> v2", () => {
        (textdiff.apply(v1, deltas.v1_to_v2)).should.equal(v2)
    })
    it("v2 -> v1", () => {
        (textdiff.apply(v2, deltas.v2_to_v1)).should.equal(v1)
    })
    it("v1 -> v1", () => {
        (textdiff.apply(v1, deltas.v1_to_v1)).should.equal(v1)
    })
    it("v1 -> empty", () => {
        (textdiff.apply(v1, deltas.v1_to_empty)).should.equal("")
    })
    it("empty -> v1", () => {
        (textdiff.apply("", deltas.empty_to_v1)).should.equal(v1)
    })
    it("empty -> empty", () => {
        (textdiff.apply("", deltas.empty_to_empty)).should.equal("")
    })
})

describe("Should correctly reverse the delta patches and apply for:", () => {
    it("v1 -> v2", () => {
        (textdiff.apply(v1, textdiff.reverse(deltas.v2_to_v1))).should.equal(v2)
    })
    it("v2 -> v1", () => {
        (textdiff.apply(v2, textdiff.reverse(deltas.v1_to_v2))).should.equal(v1)
    })
    it("v1 -> v1", () => {
        (textdiff.apply(v1, textdiff.reverse(deltas.v1_to_v1))).should.equal(v1)
    })
    it("v1 -> empty", () => {
        (textdiff.apply(v1, textdiff.reverse(deltas.empty_to_v1))).should.equal("")
    })
    it("empty -> v1", () => {
        (textdiff.apply("", textdiff.reverse(deltas.v1_to_empty))).should.equal(v1)
    })
    it("empty -> empty", () => {
        (textdiff.apply("", textdiff.reverse(deltas.empty_to_empty))).should.equal("")
    })
})

describe("Should correctly calculate the number of characters inserted:", () => {
    it("v1 -> v2", () => {
        (textdiff.getTotalInsert(deltas.v1_to_v2)).should.equal(110)
    })
    it("v2 -> v1", () => {
        (textdiff.getTotalInsert(deltas.v2_to_v1)).should.equal(6)
    })
    it("v1 -> v1", () => {
        (textdiff.getTotalInsert(deltas.v1_to_v1)).should.equal(0)
    })
    it("v1 -> empty", () => {
        (textdiff.getTotalInsert(deltas.v1_to_empty)).should.equal(0)
    })
    it("empty -> v1", () => {
        (textdiff.getTotalInsert(deltas.empty_to_v1)).should.equal(v1.length)
    })
    it("empty -> empty", () => {
        (textdiff.getTotalInsert(deltas.empty_to_empty)).should.equal(0)
    })
})

describe("Should correctly calculate the number of characters deleted:", () => {
    it("v1 -> v2", () => {
        (textdiff.getTotalDelete(deltas.v1_to_v2)).should.equal(6)
    })
    it("v2 -> v1", () => {
        (textdiff.getTotalDelete(deltas.v2_to_v1)).should.equal(110)
    })
    it("v1 -> v1", () => {
        (textdiff.getTotalDelete(deltas.v1_to_v1)).should.equal(0)
    })
    it("v1 -> empty", () => {
        (textdiff.getTotalDelete(deltas.v1_to_empty)).should.equal(v1.length)
    })
    it("empty -> v1", () => {
        (textdiff.getTotalDelete(deltas.empty_to_v1)).should.equal(0)
    })
    it("empty -> empty", () => {
        (textdiff.getTotalDelete(deltas.empty_to_empty)).should.equal(0)
    })
})

