export function normalizeDataAPI(totalCountry) {
    return {
        active: totalCountry.Active,
        confirmed: totalCountry.Confirmed,
        country: totalCountry.Country,
        date: totalCountry.Date,
        deaths: totalCountry.Deaths,
        recovered: totalCountry.Recovered,
    };
}
export function normalizeCountriesAPI(countryAPI) {
    return {
        country: countryAPI.Country,
        slug: countryAPI.Slug,
    };
}
export function normalizeDaysAPI(totalDays) {
    return {
        date: totalDays[0].Date,
        confirmed: totalDays[0].Cases,
        deaths: totalDays[1].Cases,
        recovered: totalDays[2].Cases ?? totalDays[0].Cases - totalDays[1].Cases,
    };
}
