import { useEffect, useState, useRef } from 'react';

export function useOtpTimer(durationInSeconds: number = 60) {
    const [timeLeft, setTimeLeft] = useState(durationInSeconds);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const start = () => {
        setTimeLeft(durationInSeconds);
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const reset = () => {
        clearInterval(timerRef.current!);
        setTimeLeft(durationInSeconds);
    };

    useEffect(() => {
        start(); // auto start on mount

        return () => {
            clearInterval(timerRef.current!);
        };
    }, []);

    const formatted = `${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`;

    return { timeLeft, formatted, start, reset };
}
