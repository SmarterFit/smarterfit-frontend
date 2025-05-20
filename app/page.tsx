import Header from "@/components/Header";
import SectionAbout from "@/components/sections/SectionAbout";
import SectionContact from "@/components/sections/SectionContact";
import SectionHero from "@/components/sections/SectionHero";
import SectionPlans from "@/components/sections/SectionPlans";

export default function Home() {
   return (
      <div>
         <Header />
         <main className="flex flex-col items-center justify-center">
            <SectionHero />
            <SectionAbout />
            <SectionPlans />
            <SectionContact />
         </main>
      </div>
   );
}
