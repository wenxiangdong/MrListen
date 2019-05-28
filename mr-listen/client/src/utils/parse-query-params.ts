const parseQueryParams = (query: string) => {
    query = decodeURIComponent(query);
    return query
        .split("&")
        .map(keyValue => {
            const [key, value] = keyValue.split("=");
            return {[key]: value};
        })
        .reduce((pre, cur) => ({
            ...pre,
            ...cur
        }), {});
}

export default parseQueryParams;