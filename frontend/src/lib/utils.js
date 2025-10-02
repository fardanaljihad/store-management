export const formatNumber = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(value);
}

export const parseNumber = (value) => {
    if (!value) return "";
    return value.replace(/[^0-9]/g, "");
}
