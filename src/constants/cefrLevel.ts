enum CefrLevel {
    A1 = "A1",
    A2 = "A2",
    B1 = "B1",
    B2 = "B2",
    C1 = "C1",
    C2 = "C2"
}

export function getCefrLevelCaseInsensitive(cefrLevelMixedCase:string):CefrLevel|null {
    const cefrLevelLowerCase = cefrLevelMixedCase.toLowerCase();
    for (const cefrLevel of Object.values(CefrLevel)) {
        if (cefrLevel.toLowerCase() === cefrLevelLowerCase) return cefrLevel;
    }
    return null;
}

export default CefrLevel;