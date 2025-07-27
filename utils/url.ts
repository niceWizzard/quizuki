export function isValidWaygroundUrl(url: string): boolean {
    const regex = /^(https?:\/\/)?(www\.)?(quizizz\.com|wayground\.com)(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$/;
    return regex
        .test(url);
}