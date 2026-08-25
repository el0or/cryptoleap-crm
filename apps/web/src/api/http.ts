export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(
        message: string,
        status: number,
        data: unknown,
    ) {
        super(message);

        this.name = 'ApiError';
        this.status = status;
        this.data = data
    }

}

const getErrorMessage = ( data: unknown, status: number ) => {
    if ( typeof data === 'object' && data !== null && 'message' in data ) {
        const message = ( data as { message?: unknown } ).message;

        if ( typeof message === 'string' ) {
            return message;
        }

        if (Array.isArray(message)) {
            return message.join(', ');
        }

    }
    
    return `HTTP error ${status}`
};

export const apiFetch = async <T>( path: string, options: RequestInit = {} ): Promise<T> => {
    const headers = new Headers( options.headers );

    if ( options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set(
            'Content-type',
            'application/json',
        );
    }

    const response = await fetch( path.startsWith('/api') ? path : `/api${path}`,
        {
            ...options,
            headers,
        },
    );

    let data: unknown = null;

    if (response.status !== 204) {
        const contentType = response.headers.get('content-type');

        if (
            contentType?.includes( 'application/json' )
        ) {
            data = await response.json();
        } else {
            data = await response.text();
        }
    }

    if (!response.ok) {
        throw new ApiError( getErrorMessage( data , response.status ), response.status, data );
    }

    return data as T;
}