export function isValidWaygroundUrl(url: string): boolean {
    const regex = /^(https?:\/\/)?(www\.)?wayground\.com\/(?:join\/)?quiz\/([a-f0-9]{24})(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/;
    return regex.test(url);
}



export function extractWaygroundQuizId(url: string): string | null {
    const regex = /wayground\.com\/(?:join\/)?quiz\/([a-f0-9]{24})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}
