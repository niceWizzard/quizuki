export function isValidWaygroundUrl(url: string): boolean {
    const regex = /^(https?:\/\/)?(www\.)?(wayground\.com|quizizz\.com)\/(?:[a-z]+\/)*quiz\/([a-f0-9]{24})(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/
    return regex.test(url);
}

export function extractWaygroundQuizId(url: string): string | null {
    const regex = /^(https?:\/\/)?(www\.)?(wayground\.com|quizizz\.com)\/(?:[a-z]+\/)*quiz\/([a-f0-9]{24})/;
    const match = url.match(regex);
    return match ? match[4] : null;
}

