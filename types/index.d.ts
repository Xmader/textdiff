// Type definitions for textdiff
// Project: https://github.com/Xmader/textdiff/
// Definitions by: Xmader <https://github.com/Xmader>

export declare enum Operation {
    INSERT = 1,
    EQUAL = 0,
    DELETE = -1,
}

export interface DiffItem extends Array<string | number> {
    /** 差异操作 */
    [0]: Operation,

    /** 该项差异操作应用的字符数 */
    [1]: number,

    /** 该项差异操作增加/删除的字符串 */
    [2]?: string,
}

// export type Delta = DiffItem[]
export interface Delta extends Array<DiffItem> { }

export interface Diff {
    create(original: string, revision: string): Delta;
    apply(original: string, delta: Delta): string;
    reverse(delta: Delta): Delta;
    getTotalNumber(delta: Delta, operation: Operation): number;
    getTotalInserted(delta: Delta): number;
    getTotalDeleted(delta: Delta): number;
}

declare const textdiff: Diff
export = textdiff
