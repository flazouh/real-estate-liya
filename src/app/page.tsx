import { ApartmentForm } from "@/components/ApartmentForm";

const apartmentDetails = [
  {
    question: "Location",
    answer:
      "Yitzhak Sadeh Street 28 (2 min from Carlebach light train station and TLV Mall)",
  },
  {
    question: "Studio Size",
    answer:
      "Multiple studios available with different layouts, all spacious enough for bed, couch, working and eating spaces",
  },
  {
    question: "Laundry",
    answer: "Laundry room available on each floor",
  },
  {
    question: "Building Features",
    answer:
      "Coded entrance with nice lobby, fingerprint-enabled door locks, sound-proof windows",
  },
  {
    question: "Construction",
    answer:
      "Ongoing sidewalk widening project nearby, expected to complete soon",
  },
  {
    question: "Availability",
    answer: "Mid May - June, earlier entrance possible upon discussion",
  },
  {
    question: "Parking",
    answer: "No dedicated parking, but available in the area",
  },
  {
    question: "Noise Level",
    answer: "Quiet environment with sound-proof new windows",
  },
  {
    question: "Rooftop",
    answer: "Huge incredible rooftop available for tenant use",
  },
  {
    question: "Pet Policy",
    answer: "Small and medium quiet pets allowed",
  },
  {
    question: "Rent",
    answer:
      "4800₪/month unfurnished, 5500₪/month fully furnished (including Vaad Bait)",
  },
  {
    question: "Additional Costs",
    answer:
      "One month deposit, Vaad Bait included, Arnona (TBC), utilities per usage",
  },
  {
    question: "Payment Terms",
    answer: "12 post-dated checks",
  },
  {
    question: "Real Estate Fee",
    answer: "One month rent + VAT",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Modern Studio Apartments
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Prime location in Tel Aviv with excellent amenities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Apartment Details
              </h2>
              <dl className="space-y-6">
                {apartmentDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-sm font-medium text-gray-500">
                      {detail.question}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {detail.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div>
            <ApartmentForm />
          </div>
        </div>
      </div>
    </main>
  );
}
