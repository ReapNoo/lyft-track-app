// src/utils/debounce.ts

export function debouncePress<T extends (...args: any[]) => void>(
    func: T, 
    wait: number = 500
) {
    let lastTap = 0;
    
    return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastTap > wait) {
            lastTap = now;
            func(...args);
        }
    };
}