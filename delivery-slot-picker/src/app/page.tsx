import Image from "next/image";
import DeliverySlotPicker from "./components/DeliverySlotPicker/DeliverySlotPicker";

import axios from 'axios';
import * as https from 'https';
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

export async function GetDates ()   {
    return await axios.get('http://localhost:3000/api/dates?groupSize=3', { httpsAgent })
}

export default async function Home() {

  const dates = await GetDates();
  console.log(dates.data)

  let dynamicGroup: any = [];

  dates.data.forEach((group: any) => {
    dynamicGroup.push({days: group})
  });

  console.log(dynamicGroup)
  const groups = dynamicGroup;


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className=" flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <DeliverySlotPicker groups={groups} flag />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
