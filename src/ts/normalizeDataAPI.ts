declare global {
  interface TotalCountryAPI {
    Active: number;
    City: string;
    CityCode: string;
    Comment: string;
    Confirmed: number;
    Country: string;
    CountryCode: string;
    Date: string;
    Deaths: number;
    Lat: string;
    Lon: string;
    Province: string;
    Recovered: number;
  }
  interface TotalCountry {
    active: number;
    confirmed: number;
    country: string;
    date: string;
    deaths: number;
    recovered: number;
  }
  interface CountryAPI {
    Country: string;
    Slug: string;
    ISO2: string;
  }
  interface Country {
    country: string;
    slug: string;
  }
  interface SummaryAPI {
    ID: string;
    Message: string;
    Global: {
      NewConfirmed: number;
      TotalConfirmed: number;
      NewDeaths: number;
      TotalDeaths: number;
      NewRecovered: number;
      TotalRecovered: number;
      Date: string;
    };
    [key: string]: unknown;
  }
  interface TotalDaysAPI {
    Cases: number;
    Date: string;
    [key: string]: unknown;
  }
  interface TotalDays {
    date: string;
    confirmed: number;
    deaths: number;
    recovered: number;
  }
}

export function normalizeDataAPI(totalCountry: TotalCountryAPI): TotalCountry {
  return {
    active: totalCountry.Active,
    confirmed: totalCountry.Confirmed,
    country: totalCountry.Country,
    date: totalCountry.Date,
    deaths: totalCountry.Deaths,
    recovered: totalCountry.Recovered,
  };
}

export function normalizeCountriesAPI(countryAPI: CountryAPI): Country {
  return {
    country: countryAPI.Country,
    slug: countryAPI.Slug,
  };
}

export function normalizeDaysAPI(
  totalDays: [TotalDaysAPI, TotalDaysAPI, TotalDaysAPI]
): TotalDays {
  return {
    date: totalDays[0].Date,
    confirmed: totalDays[0].Cases,
    deaths: totalDays[1].Cases,
    recovered: totalDays[2].Cases ?? totalDays[0].Cases - totalDays[1].Cases,
  };
}
