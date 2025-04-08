"use client"

import { UseServiceCallProps, UseServiceCallStatusProps } from "../types";
import { useState } from "react";

const useServiceCall = ({ fn }: UseServiceCallProps) => {
    const [status, setStatus] = useState<UseServiceCallStatusProps>('idle');
    const [args, setArgs] = useState(null);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const makeRequest = async (...args: any) => {
        setStatus('loading');
        setArgs(args);
        try {
            const response = await fn(...args);
            setData(response);
            setStatus("loaded");
            return response;
        } catch (err: any) {
            setStatus("error");
            setError(err);
        }
    }

    return { data, status, error, args, makeRequest };
}

export default useServiceCall;