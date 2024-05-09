export function shortenSymbol(longSymbol, letters) {
    const newSymbol = longSymbol.substring(0, letters).toString() + ".."
    return newSymbol
}
