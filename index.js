// @ts-check

const fastDiff = require("fast-diff")

const Diff = {

    /**
     * @param {string} original 
     * @param {string} revision 
     * @returns {import(".").Delta}
     */
    create(original, revision) {
        const result = fastDiff(original, revision)

        return result.map((item) => {
            const [operation, str] = item

            /** @type {import(".").DiffItem} */
            const diffItem = [
                operation,
                str.length,
            ]

            if (operation !== 0) {  // not EQUAL
                diffItem.push(str)
            }

            return diffItem
        })
    },

    /**
     * @param {string} original 
     * @param {import(".").Delta} delta 
     */
    apply(original, delta) {
        let result = ""
        let index = 0

        for (const item of delta) {
            const [operation, num, str] = item

            if (operation == -1) {
                // DELETE
                index += num
            } else if (operation == 0) {
                // KEEP
                result += original.slice(index, index += num)
            } else {
                // INSERT
                result += str
            }
        }

        return result
    },

}

module.exports = Diff
