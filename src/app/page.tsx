import { ApartmentForm } from "@/components/ApartmentForm";

const apartmentDetails = [
  {
    question: "Location / מיקום",
    answer:
      "Yitzhak Sadeh Street 28 (2 min from Carlebach light train station and TLV Mall) / רחוב יצחק שדה 28 (2 דקות מתחנת הרכבת הקלה קרליבך וקניון תל אביב)",
  },
  {
    question: "Studio Size / גודל הסטודיו",
    answer:
      "Multiple studios available with different layouts, all spacious enough for bed, couch, working and eating spaces / מספר סטודיות זמינות עם תכניות שונות, כולן מרווחות מספיק למיטה, ספה, פינת עבודה ופינת אוכל",
  },
  {
    question: "Laundry / כביסה",
    answer: "Laundry room available on each floor / חדר כביסה זמין בכל קומה",
  },
  {
    question: "Building Features / מאפייני הבניין",
    answer:
      "Coded entrance with nice lobby, fingerprint-enabled door locks, sound-proof windows / כניסה עם קוד, לובי מטופח, מנעולי דלת עם טביעת אצבע, חלונות מבודדי רעש",
  },
  {
    question: "Construction / בנייה",
    answer:
      "Ongoing sidewalk widening project nearby, expected to complete soon / פרויקט הרחבת מדרכה בסביבה, צפוי להסתיים בקרוב",
  },
  {
    question: "Availability / זמינות",
    answer:
      "Mid May - June, earlier entrance possible upon discussion / אמצע מאי - יוני, כניסה מוקדמת יותר אפשרית בדיון",
  },
  {
    question: "Parking / חניה",
    answer:
      "No dedicated parking, but available in the area / אין חניה ייעודית, אך זמינה באזור",
  },
  {
    question: "Noise Level / רמת רעש",
    answer:
      "Quiet environment with sound-proof new windows / סביבה שקטה עם חלונות חדשים מבודדי רעש",
  },
  {
    question: "Rooftop / גג",
    answer:
      "Huge incredible rooftop available for tenant use / גג ענק ומדהים זמין לשימוש הדיירים",
  },
  {
    question: "Pet Policy / מדיניות חיות מחמד",
    answer:
      "Small and medium quiet pets allowed / מותרות חיות מחמד קטנות ובינוניות שקטות",
  },
  {
    question: "Rent / שכר דירה",
    answer:
      "4800₪/month unfurnished, 5500₪/month fully furnished (including Vaad Bait) / 4800₪ לחודש ללא ריהוט, 5500₪ לחודש מרוהט במלואו (כולל ועד בית)",
  },
  {
    question: "Additional Costs / עלויות נוספות",
    answer:
      "One month deposit, Vaad Bait included, Arnona (TBC), utilities per usage / חודש פיקדון, ועד בית כלול, ארנונה (לאישור), חשבונות לפי צריכה",
  },
  {
    question: "Payment Terms / תנאי תשלום",
    answer: "12 post-dated checks / 12 צ'קים דחויים",
  },
  {
    question: "Real Estate Fee / דמי תיווך",
    answer: 'One month rent + VAT / שכר דירה חודשי + מע"מ',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Modern Studio Apartments
            <br className="hidden sm:block" />
            <span className="block sm:inline">דירות סטודיו מודרניות</span>
          </h1>
          <p className="mt-2 sm:mt-3 max-w-md mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 md:mt-5 md:max-w-3xl">
            Prime location in Tel Aviv with excellent amenities
            <br className="hidden sm:block" />
            <span className="block sm:inline">
              מיקום מרכזי בתל אביב עם מתקנים מעולים
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 mb-6 sm:mb-12">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-3 sm:px-4 py-4 sm:py-5 md:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Apartment Details / פרטי הדירה
              </h2>
              <dl className="space-y-4 sm:space-y-6">
                {apartmentDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-3 sm:pb-4 last:border-b-0 last:pb-0"
                  >
                    <dt className="text-xs sm:text-sm font-medium text-gray-500">
                      {detail.question}
                    </dt>
                    <dd className="mt-1 text-xs sm:text-sm text-gray-900">
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
