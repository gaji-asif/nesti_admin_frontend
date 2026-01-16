import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Button from "../../ui/button/Button";

export interface Service {
  id: string;
  name: string;
  category: string[];
  city: string;
  region: string;
  is_remote: boolean;
  short_description: string;
  price_from: number;
  contact_url: string;
  photo_url: string;
  rating_avg: number;
  rating_count: number;
  is_partner?: boolean;
  partner_discount?: string;
}

// Define the table data using the interface
const tableData: Service[] = [
  {
    id: "1",
    name: "Imetysohjaaja Minna Valkeapää",
    category: ["Imetysohjaus"],
    city: "Pursimiehenkatu 12, Helsinki",
    region: "Uusimaa",
    is_remote: true,
    short_description:
      "Asiantuntemuksella, lempeydellä ja kiireettömästi oman kotisi rauhassa. Kotikäynnit pääkaupunkiseudulla.",
    price_from: 85,
    contact_url: "https://www.imetysohjaajaminna.fi",
    photo_url:
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop",
    rating_avg: 4.9,
    rating_count: 87,
  },
  {
    id: "2",
    name: "Perhe-Arte Synnytysvalmennus",
    category: ["Synnytysvalmennus"],
    city: "Urho Kekkosen katu 4, Helsinki",
    region: "Uusimaa",
    is_remote: false,
    short_description:
      "Asiantuntevaa synnytysvalmennusta Helsingissä, Lahdessa ja Tampereella. Kuljemme perheiden rinnalla.",
    price_from: 120,
    contact_url: "https://perhe-arte.fi",
    photo_url:
      "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?w=400&h=300&fit=crop",
    rating_avg: 4.8,
    rating_count: 156,
  },
  {
    id: "3",
    name: "Ilmatar Doula",
    category: ["Doula"],
    city: "Tehtaankatu 21, Helsinki",
    region: "Uusimaa",
    is_remote: false,
    short_description:
      "Tukea raskausaikaan, synnytykseen ja synnytyksen jälkeiseen aikaan. Kokonaisvaltaista perheen hyvinvointia.",
    price_from: 200,
    contact_url: "https://www.ilmatardoula.fi",
    photo_url:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=300&fit=crop",
    rating_avg: 4.9,
    rating_count: 143,
  },
  {
    id: "4",
    name: "Wario Mama's Äitiysfysioterapia",
    category: ["Fysioterapia (äidit/lapset)"],
    city: "Helsinginkatu 15, Helsinki",
    region: "Uusimaa",
    is_remote: false,
    short_description:
      "Erikoisfysioterapiaa raskaana oleville ja synnyttäneille äideille. Kokonaisvaltaista palautumista.",
    price_from: 75,
    contact_url: "https://wariomamas.fi",
    photo_url:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    rating_avg: 4.7,
    rating_count: 98,
  },
  {
    id: "5",
    name: "Kaunis Odotus Kätilöpalvelut",
    category: ["Synnytysvalmennus", "Uniohjaus"],
    city: "Tikkurilantie 88, Vantaa",
    region: "Uusimaa",
    is_remote: false,
    short_description:
      "Kätilön palvelut lämmöllä ja kiireettömästi, kaikissa raskauden vaiheissa. Ultraäänitutkimukset.",
    price_from: 90,
    contact_url: "https://kaunisodotus.fi",
    photo_url:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=300&fit=crop",
    rating_avg: 4.8,
    rating_count: 67,
  },
  {
    id: "6",
    name: "Imetyksen Tuki ry",
    category: ["Imetysohjaus"],
    city: "Valtakunnallinen etäpalvelu",
    region: "Valtakunnallinen",
    is_remote: true,
    short_description:
      "Imetystukivanhempien antama vertaistuki imetyksen kaikkiin vaiheisiin. Luotettavaa tietoa ja vinkkejä.",
    price_from: 0,
    contact_url: "https://imetys.fi",
    photo_url:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop",
    rating_avg: 4.6,
    rating_count: 234,
  },
  {
    id: "7",
    name: "The Nest Doulas",
    category: ["Doula"],
    city: "Runeberginkatu 33, Helsinki",
    region: "Uusimaa",
    is_remote: false,
    short_description:
      "Kansainvälisten perheiden doula-kollektiivi. Tukea kaikille perheille taustasta riippumatta.",
    price_from: 180,
    contact_url: "https://www.doulacollective.fi",
    photo_url:
      "https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=400&h=300&fit=crop",
    rating_avg: 4.9,
    rating_count: 89,
  },
  {
    id: "8",
    name: "Aktiivi Fysioterapia",
    category: ["Fysioterapia (äidit/lapset)"],
    city: "Hämeenkatu 14, Tampere",
    region: "Pirkanmaa",
    is_remote: false,
    short_description:
      "Aktiivista terveyttä koko perheelle! Erikoisosaamista lasten ja äitien fysioterapiassa.",
    price_from: 68,
    contact_url: "https://aktiivifysioterapia.fi",
    photo_url:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    rating_avg: 4.7,
    rating_count: 112,
  },
  {
    id: "9",
    name: "Unirauha - Vauvojen uniohjaus",
    category: ["Uniohjaus"],
    city: "Tapiolantie 5, Espoo",
    region: "Uusimaa",
    is_remote: true,
    short_description:
      "Yksilöllistä uniohjausta vauvoille ja taaperoille. Lempeät menetelmät koko perheen hyvinvointiin.",
    price_from: 95,
    contact_url: "tel:+358401234567",
    photo_url:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop",
    rating_avg: 4.8,
    rating_count: 156,
  },
  {
    id: "10",
    name: "Vyöhyketerapeutti Mari Virtanen",
    category: ["Vyöhyketerapia"],
    city: "Aurakatu 8, Turku",
    region: "Varsinais-Suomi",
    is_remote: false,
    short_description:
      "Vyöhyketerapiaa äideille ja lapsille. Kokonaisvaltaista hyvinvointia jalkapohjien kautta.",
    price_from: 65,
    contact_url: "tel:+358407654321",
    photo_url:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    rating_avg: 4.6,
    rating_count: 78,
  },
  {
    id: "11",
    name: "Marian Konditoria Sello",
    category: ["Kahvila"],
    city: "Leppävaarankatu 3-9, Espoo",
    region: "Uusimaa",
    is_remote: false,
    short_description:
      "Laadukas konditoria ja kahvila Sellon kauppakeskuksessa. Herkulliset leivonnaiset ja kahvit perheille.",
    price_from: 5,
    contact_url: "https://marian.fi/myymalat/sello/",
    photo_url:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
    rating_avg: 4.7,
    rating_count: 203,
    is_partner: true,
    partner_discount: "-10%",
  },
  {
    id: "12",
    name: "Take the Cake Kauppakeskus Mylly",
    category: ["Kahvila"],
    city: "Myllynkatu 1, 21280 Raisio",
    region: "Varsinais-Suomi",
    is_remote: false,
    short_description:
      "Upeat kakut ja leivonnaiset Myllyn kauppakeskuksessa. Täydellinen pysähdyspaikka perheille.",
    price_from: 5,
    contact_url: "https://www.mbakery.fi/leipomo/kahvilat/take-the-cake/",
    photo_url:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=400&h=300&fit=crop",
    rating_avg: 4.8,
    rating_count: 156,
    is_partner: true,
    partner_discount: "-15%",
  },
];

export default function AllServices() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-white/[0.1] dark:bg-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                City
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Region
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Remote
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Price From
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Contact
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Rating
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Rating Count
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Partner
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Edit
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Delete
              </TableCell>
          
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">
                  {service.id}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.category.join(", ")}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.city}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.region}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.is_remote ? "Yes" : "No"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  €{service.price_from}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <a href={service.contact_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Contact
                  </a>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.rating_avg}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.rating_count}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.is_partner ? `Yes (${service.partner_discount})` : "No"}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Button size="sm" onClick={() => console.log('Edit', service.id)}>Edit</Button>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Button size="sm" onClick={() => console.log('Delete', service.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
