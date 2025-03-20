export default async function fetchApi({
    endpoint,
    query,
    wrappedByKey,
    wrappedByList,
    page,
    locale,
    secondLevel,
    secondLevelQuery,
    secondLevelTarget,
}) {
    if (endpoint.startsWith('/')) {
        endpoint = endpoint.slice(1);
    }

    const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);

    if (locale) {
        url.searchParams.append('locale', locale);
    }

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    if (page) {
        url.searchParams.append(`populate[${page}][populate]`, '*');
    } else {
        /**
         * Per triggerare questo IF bisogna lasciare il parametro PAGE vuoto
         * Da qui parte modifica custom per popolare componenti di secondo livello
         * come esempio fare riferimento al componente ClientSlider.astro
         */
        if (secondLevel) {
            if (secondLevel === 'seo') {
                url.searchParams.append('populate[0]', 'seo');
                url.searchParams.append('populate[1]', 'seo.metaSocial');
                url.searchParams.append('populate[2]', 'seo.metaSocial.image');
            } else {
                if (typeof secondLevelTarget === "object") {
                    Object.entries(secondLevelTarget).forEach(([key, value]) => {
                        url.searchParams.append(`populate[${secondLevel}]${secondLevelQuery}[populate]`, value);
                    });
                } else {
                    url.searchParams.append(`populate[${secondLevel}]${secondLevelQuery}[populate]`, secondLevelTarget);
                }
            }
        } else {
            url.searchParams.append('populate', '*');
        }
    }

    const res = await fetch(url.toString());
    let data = await res.json();

    if (wrappedByKey) {
        data = data[wrappedByKey];
    }

    if (wrappedByList) {
        data = data[0];
    }

    if (page) {
        //data = data[0]['attributes'][page];
        if (page !== 'content') {
            data = data[page];
        } else {
            data = data[0][page];
        }
    }

    //console.log(url);

    return data;
}