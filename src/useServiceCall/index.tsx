"use client";

import { UseServiceCallProps, UseServiceCallStatusProps } from "../types";
import { useState } from "react";

const useServiceCall = ({ fn, resources }: UseServiceCallProps) => {
    const onSuccess = resources?.onSuccess;
    const onError = resources?.onError;
    
    const [status, setStatus] = useState<UseServiceCallStatusProps>('idle');
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [args, setArgs] = useState(null);

    const redirector = (url: string) => {
        window.location.href = url;
    }

    const makeRequest = async (...args: any) => {
        setStatus('loading');
        setArgs(args);

        try {
            const response = await fn(...args);
            setStatus("loaded");
            
            if (onSuccess) {
                onSuccess({ data: response, redirector });
            } else {
                setData(response);
            }
        } catch (error: any) {
            setStatus("error");
            setError(error);

            if (onError) {
                onError({ error, redirector });
            }
        }
    }

    return { 
        data, 
        status, 
        error, 
        args, 
        makeRequest 
    };
}

export default useServiceCall;