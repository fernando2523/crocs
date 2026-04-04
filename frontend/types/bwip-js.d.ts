declare module 'bwip-js' {
    const bwipjs: {
        toCanvas: (
            canvas: HTMLCanvasElement,
            options: {
                bcid: string;
                text: string;
                scale?: number;
                height?: number;
                includetext?: boolean;
                textxalign?: string;
                [key: string]: any;
            },
            callback?: (err: Error | null) => void
        ) => void;
    };

    export default bwipjs;
}