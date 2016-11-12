export function toFullQualifiedURL(url: string): string {
    const a = document.createElement('a');
    a.href = url;
    return a.href;
}
