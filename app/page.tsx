import { Footer } from "@/components/Footer/Footer";
import HeroSection from "@/components/Hero/hero-section";
import ParticlesHero from "@/components/Hero/ParrticlesHero";
import PhoneSpecsTable from "@/components/ReviewTaple/ReviewsTaple";
import AI_Input_Search from "@/components/Search/ai-input-search";
import { PhoneCarousel } from "@/components/ui/phone-carousel";

export default function Home() {
  return (
    <>
      <div className="relative w-full min-h-screen overflow-hidden mb-20">
       
        <ParticlesHero/>
        <HeroSection />
        <AI_Input_Search/>
        <PhoneSpecsTable/>
        <PhoneCarousel images={[

          {src:"/video/mi.mp4" },
          {src:"/london.jpg" },
          {src:"/video/iphone1.mp4"},
          
          
        ]} />
        <Footer/>

      </div>





    </>

  );
}
