"use client";

import { usePhoneStore } from "@/store/PhoneStore";
import { motion } from "framer-motion";
import {
  BatteryCharging, Camera, Cpu, Monitor, ShoppingCart, Globe, Wifi, HardDrive, Shield, Weight, Ruler, DollarSign, CpuIcon,
  Palette,
  CloudLightning,

} from "lucide-react";
import VideoReview from "./VideoReview";
import PhoneSummary from "./PhoneSummary";
import { useRouter } from "next/navigation";

export default function PhoneSpecsTable() {
  const phoneProp = usePhoneStore((state) => state.phone);


  if (!phoneProp || !phoneProp.name || phoneProp.name.trim() === "") return null;

  const phone = {
    name: phoneProp.name || "Unknown",
    cpu: phoneProp.specs?.cpu || "",
    battery: phoneProp.specs?.battery || "",
    batteryCapacity: phoneProp.specs?.batteryCapacity || "",
    fastCharging: phoneProp.specs?.fastCharging || false,
    camera: phoneProp.specs?.camera || "",
    frontCamera: phoneProp.specs?.frontCamera || "",
    video: phoneProp.specs?.video || "",
    screen: phoneProp.specs?.screen || "",
    displayType: phoneProp.specs?.displayType || "",
    resolution: phoneProp.specs?.resolution || "",
    storage: phoneProp.specs?.storage || "",
    ram: phoneProp.specs?.ram || "",
    os: phoneProp.specs?.os || "",
    network: phoneProp.network || "",
    support5G: phoneProp.specs?.support5G || false,
    sim: phoneProp.specs?.sim || "",
    sensors: phoneProp.specs?.sensors || "",
    colors: Array.isArray(phoneProp.specs?.colors) ? phoneProp.specs.colors : [],
    material: phoneProp.specs?.material || "",
    protection: phoneProp.protection || "",
    weight: phoneProp.weight || "",
    dimensions: phoneProp.dimensions || "",
    price: phoneProp.price || "",
    rating: phoneProp.rating ?? 4.5,
    image: phoneProp.image || "/Samsung-Galaxy.png",
    pros: Array.isArray(phoneProp.pros) ? phoneProp.pros : [],
    cons: Array.isArray(phoneProp.cons) ? phoneProp.cons : [],

  };


  const containerVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <section className="mt-12 md:mx-44 mx-auto p-4">
      {/*SUMMMARY*/}

      <PhoneSummary summary={phoneProp.summary} />
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col md:flex-row items-start gap-6">



        {/* SPECS TABLE */}
        <div className="flex-1 rounded-2xl bg-white text-black dark:bg-black dark:text-white border border-zinc-400 shadow-xl p-7">
          <h2 className="text-xl font-bold mb-4 border-b border-zinc-400 pb-2 text-center md:text-left">Phone Specifications</h2>


          <div className="space-y-3 text-sm ">
            <Spec title="Name" icon={<CpuIcon size={16} />} value={phone.name} />
            <Spec title="CPU" icon={<Cpu size={16} />} value={phone.cpu} />
            <Spec title="Battery" icon={<BatteryCharging size={16} />} value={phone.battery} />
            <Spec title="Camera" icon={<Camera size={16} />} value={phone.camera} />
            <Spec title="Display" icon={<Monitor size={16} />} value={phone.screen} />
            <Spec title="Storage" icon={<HardDrive size={16} />} value={phone.storage} />
            <Spec title="RAM" icon={<HardDrive size={16} />} value={phone.ram} />
            <Spec title="Operating System" icon={<Globe size={16} />} value={phone.os} />
            <Spec title="Networks" icon={<Wifi size={16} />} value={phone.network} />
            <Spec title="Protection" icon={<Shield size={16} />} value={phone.protection} />
            <Spec title="Dimensions" icon={<Ruler size={16} />} value={phone.dimensions} />
            <Spec title="Weight" icon={<Weight size={16} />} value={phone.weight} />
            <Spec title="Price" icon={<DollarSign size={16} />} value={phone.price} />
            <Spec title="Front Camera" icon={<Camera size={16} />} value={phone.frontCamera || "N/A"} />
            <Spec title="Video Recording" icon={<Camera size={16} />} value={phone.video || "N/A"} />
            <Spec title="Display Type" icon={<Monitor size={16} />} value={phone.displayType || "N/A"} />
            <Spec title="Resolution" icon={<Monitor size={16} />} value={phone.resolution || "N/A"} />
            <Spec title="SIM Type" icon={<Globe size={16} />} value={phone.sim || "N/A"} />
            <Spec title="5G Support" icon={<Wifi size={16} />} value={phone.support5G ? "Yes" : "No"} />
            <Spec title="Sensors" icon={<Cpu size={16} />} value={phone.sensors || "N/A"} />
            <Spec title="Colors" icon={<Palette size={16} />} value={phone.colors?.join(", ") || "N/A"} />
            <Spec title="Material" icon={<Shield size={16} />} value={phone.material || "N/A"} />
            <Spec title="Battery Capacity" icon={<BatteryCharging size={16} />} value={phone.batteryCapacity || "N/A"} />
            <Spec title="Fast Charging" icon={<CloudLightning size={16} />} value={phone.fastCharging ? "Yes" : "No"} />
            <div className='border-t border-black mt-6'></div>
            <div className="flex items-center gap-2  bg-white text-black dark:bg-black dark:text-white font-semibold pt-3 border-black dark:border-white">
              <span className="text-amber-300 " />Rate : {phone.rating} / 5 ⭐
            </div>
          </div>

          {/* Buy Button */}
          <button className="mt-5 w-full flex items-center justify-center gap-2 bg-gray-700  text-white dark:bg-gray-300 dark:text-black font-bold py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200  transition">
            <ShoppingCart size={18} /> Buy Now
          </button>

          {/* YouTube Review Video */}

          <VideoReview />


        </div>

      </motion.div>
    </section>
  );
}

function Spec({ title, value, icon }: { title: string; value: any; icon: any }) {
  return (
    <div className="flex justify-between items-center bg-white text-black dark:bg-black dark:text-white border border-zinc-400 rounded-lg p-2">
      <div className="flex items-center gap-2">
        {icon} <span>{title}</span>
      </div>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}
