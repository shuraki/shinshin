import type { NextConfig } from "next";

const OLD_PROGRAM_IDS: Record<string, string> = {
  "lasova-community": "/programs/kadima",
  "krembo-inclusion": "/programs/krembo",
  "hechalutz-civic": "/programs/hechalutz",
  "teva-nature-guide": "/programs/spni",
  "maase-leadership": "/programs/maase",
  "bnei_akiva_komuniot": "/programs/bnei-akiva",
  "zofim_tracks": "/programs/zofim",
  "hamahanot_olim_education": "/programs/hamahanot-haolim",
  "kibbutz_communal": "/programs/kibbutz-movement",
  "bina_cities": "/programs#more",
  "sayarut_hiking": "/programs/sayarut-kkl",
  "noam_nationwide": "/programs/noam",
  "maccabi_tzair_sports": "/programs/maccabi-hatzair",
  "bakehila_community": "/programs/bakehila",
  "igy_lgbtq_community": "/programs/igy",
};

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(OLD_PROGRAM_IDS).map(([from, to]) => ({
      source: `/programs/${from}`,
      destination: to,
      permanent: true,
    }));
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
