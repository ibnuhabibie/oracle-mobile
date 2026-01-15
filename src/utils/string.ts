import { formatPrice } from "./formatter";

export const getTranslateByKey = (translations, key, locale) => {
    console.log(translations)
    if (Array.isArray(translations)) {
        const transItem = translations.find((tr) => tr.key === key && tr.locale === locale);
        return transItem?.value || '';
    }
}

export const getPricingVariant = (variants, locale) => {
    if (Array.isArray(variants)) {
        const pricingVariant = variants.find((pv) => pv.locale === locale);
        if (pricingVariant) {
            return formatPrice(parseFloat(pricingVariant.price), pricingVariant.currency_symbol);
        }
    }

    return '';
}