import SectionHero from "@/components/pages/home/SectionHero";
import SectionsContainer from "@/components/base/containers/section/SectionsContainer";
import SectionPlans from "@/components/pages/home/SectionPlans";
import SectionAbout from "@/components/pages/home/SectionAbout";
import SectionClasses from "@/components/pages/home/SectionClasses";
import SectionTestimonials from "@/components/pages/home/SectionTestimonials";

export default function Home() {
   return (
      <SectionsContainer>
         <SectionHero />
         <SectionAbout />
         <SectionPlans />
         <SectionClasses />
         <SectionTestimonials />
      </SectionsContainer>
   );
}
