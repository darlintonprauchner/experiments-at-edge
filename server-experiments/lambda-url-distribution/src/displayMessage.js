exports.handler = async (event) => {
    const featureFlags = event.headers['flags'] ? JSON.parse(event.headers['flags']) : {};

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Hello world!', 
            featureFlags
        }),
    };
};