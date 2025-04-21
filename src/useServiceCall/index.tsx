"use client"

import { UseServiceCallProps, UseServiceCallStatusProps } from "../types";
import { useState } from "react";

const useServiceCall = ({ fn, config }: UseServiceCallProps) => {
    const [status, setStatus] = useState<UseServiceCallStatusProps>('idle');
    const [args, setArgs] = useState(null);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const redirector = config?.redirector;

    const makeRequest = async (...args: any) => {
        setStatus('loading');
        setArgs(args[0]);
        try {
            const response = await fn(...args);
            setData(response);
            setStatus("loaded");

            if (redirector) {
                window.location.href = redirector;
            }
        } catch (err: any) {
            setStatus("error");
            setError(err);
        }
    }

    return { data, status, error, args, makeRequest };
}

export default useServiceCall;