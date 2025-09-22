const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        stripUnknown: true
    });
    if (result.error) {
        throw result.error;
    }

    return result.value;
}

export {
    validate
}
