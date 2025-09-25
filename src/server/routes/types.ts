export type ValidFormat = "names" | "all";

export type FilterOptions = {
    year?: number,
    bookIds?: number[],
    exclude?: string[],
    include?: string[],
    faction?: string,
    format?: string
}