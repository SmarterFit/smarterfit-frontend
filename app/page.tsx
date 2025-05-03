import SectionHero from "@/components/pages/home/SectionHero";
import SectionsContainer from "@/components/base/containers/section/SectionsContainer";
import SectionPlans from "@/components/pages/home/SectionPlans";
import SectionAbout from "@/components/pages/home/SectionAbout";

export default function Home() {
   return (
      <SectionsContainer>
         <SectionHero />
         <SectionAbout />
         <SectionPlans />
      </SectionsContainer>
   );
}
