import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";

export const metadata = {
  title: 'Aabout - CMS Kampus',
  description: 'About us page for CMS Kampus'
}

export default async function ArticlesPage() {

  
  return (
    <>
    <AboutSection />
    <TeamSection />
    </>
  );
}