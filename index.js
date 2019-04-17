// @ts-check

const fastDiff = require("fast-diff")

const Diff = {

    /**
     * @typedef {import(".").Delta} Delta
     * @param {string} original 
     * @param {string} revision 
     * @returns {Delta}
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
     * @param {Delta} delta 
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

    /**
     * @param {Delta} delta 
     */
    reverse(delta) {
        return delta.map((x) => {
            const item = x.concat()
            item[0] = -item[0]
            return item
        })
    },

    /**
     * 获取该种差异操作总计应用的字符数
     * @param {Delta} delta 
     * @param {import(".").Operation} operation 差异操作
     */
    getTotalNumber(delta, operation) {
        return delta.reduce((n, item) => {
            if (item[0] == operation) {
                return n + item[1]
            } else {
                return n
            }
        }, 0)
    },

    /**
     * 获取总计插入的字符数
     * @param {Delta} delta 
     */
    getTotalInsert(delta) {
        return Diff.getTotalNumber(delta, 1)
    },

    /**
     * 获取总计删除的字符数
     * @param {Delta} delta 
     */
    getTotalDelete(delta) {
        return Diff.getTotalNumber(delta, -1)
    },

}

module.exports = Diff
