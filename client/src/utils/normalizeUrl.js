export const normalizeUrl = (s) => {
    if (!s) return "";
    try {
        const u = new URL(s);
        return u.href;
    } catch {
        return `https://${s}`;
    }
};
