/**
 * Somalia location data — regions and districts.
 * No schema changes needed to add new regions — just extend this file.
 */

export interface District {
  name: string;
  villages?: string[];
}

export interface Region {
  name: string;
  active: boolean;
  districts: District[];
}

export const REGIONS: Region[] = [
  {
    name: "Gedo",
    active: true,
    districts: [
      { name: "Baardheere", villages: ["Barwaaqo", "Buulo Xaaji", "Ceel Waaq"] },
      { name: "Luuq", villages: ["Luuq Town", "Beerta", "Dhaban"] },
      { name: "Doolow", villages: ["Doolow Town", "Kabasa", "Qansaxley"] },
      { name: "Garbaharey", villages: ["Garbaharey Town", "Dinsoor Road"] },
      { name: "Belet Xaawo", villages: ["Belet Xaawo Town", "Diff"] },
      { name: "Ceel Waaq", villages: ["Ceel Waaq Town"] },
      { name: "Burdhuubo", villages: ["Burdhuubo Town"] },
    ],
  },
  {
    name: "Banadir",
    active: false,
    districts: [
      { name: "Mogadishu" },
      { name: "Hodan" },
      { name: "Wadajir" },
      { name: "Kaaraan" },
    ],
  },
  {
    name: "Bay",
    active: false,
    districts: [
      { name: "Baidoa" },
      { name: "Burhakaba" },
      { name: "Qansax Dheere" },
    ],
  },
  {
    name: "Bakool",
    active: false,
    districts: [
      { name: "Xudur" },
      { name: "Waajid" },
      { name: "Rab Dhuure" },
    ],
  },
  {
    name: "Jubbada Hoose",
    active: false,
    districts: [
      { name: "Kismaayo" },
      { name: "Jamaame" },
      { name: "Badhaadhe" },
    ],
  },
  {
    name: "Jubbada Dhexe",
    active: false,
    districts: [
      { name: "Bu'aale" },
      { name: "Saakow" },
      { name: "Jilib" },
    ],
  },
  {
    name: "Hiiraan",
    active: false,
    districts: [
      { name: "Beledweyne" },
      { name: "Buulo Burde" },
      { name: "Jalalaqsi" },
    ],
  },
  {
    name: "Shabelle Hoose",
    active: false,
    districts: [
      { name: "Marka" },
      { name: "Baraawe" },
      { name: "Qoryooley" },
    ],
  },
  {
    name: "Shabelle Dhexe",
    active: false,
    districts: [
      { name: "Jowhar" },
      { name: "Balcad" },
      { name: "Adan Yabaal" },
    ],
  },
  {
    name: "Mudug",
    active: false,
    districts: [
      { name: "Gaalkacyo" },
      { name: "Hobyo" },
      { name: "Xarardheere" },
    ],
  },
  {
    name: "Galguduud",
    active: false,
    districts: [
      { name: "Dhuusamarreeb" },
      { name: "Cadaado" },
      { name: "Ceel Buur" },
    ],
  },
  {
    name: "Nugaal",
    active: false,
    districts: [
      { name: "Garoowe" },
      { name: "Eyl" },
      { name: "Burtinle" },
    ],
  },
  {
    name: "Bari",
    active: false,
    districts: [
      { name: "Boosaaso" },
      { name: "Qardho" },
      { name: "Bandarbeyla" },
    ],
  },
  {
    name: "Sool",
    active: false,
    districts: [
      { name: "Laascaanood" },
      { name: "Taleex" },
    ],
  },
  {
    name: "Sanaag",
    active: false,
    districts: [
      { name: "Erigavo" },
      { name: "Ceel Afweyn" },
    ],
  },
  {
    name: "Togdheer",
    active: false,
    districts: [
      { name: "Burco" },
      { name: "Oodweyne" },
    ],
  },
  {
    name: "Woqooyi Galbeed",
    active: false,
    districts: [
      { name: "Hargeysa" },
      { name: "Berbera" },
      { name: "Gebiley" },
    ],
  },
  {
    name: "Awdal",
    active: false,
    districts: [
      { name: "Boorama" },
      { name: "Saylac" },
      { name: "Baki" },
    ],
  },
];

/** Get active regions */
export function getActiveRegions() {
  return REGIONS.filter((r) => r.active);
}

/** Get districts for a region */
export function getDistricts(regionName: string) {
  return REGIONS.find((r) => r.name === regionName)?.districts || [];
}

/** Get villages for a district in a region */
export function getVillages(regionName: string, districtName: string) {
  const region = REGIONS.find((r) => r.name === regionName);
  const district = region?.districts.find((d) => d.name === districtName);
  return district?.villages || [];
}

/** Format a full location string */
export function formatLocation(opts: {
  village?: string | null;
  district?: string | null;
  region?: string | null;
  country?: string | null;
}) {
  return [opts.village, opts.district ? `${opts.district} District` : null, opts.region ? `${opts.region} Region` : null, opts.country]
    .filter(Boolean)
    .join(", ");
}
