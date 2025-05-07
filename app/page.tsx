import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles";
import { getUpcomingEvents } from "@/lib/events";
import ArticleCard from "@/components/ArticleCard";
import EventCard from "@/components/EventCard";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TeamSection from "@/components/TeamSection";
import FacilitiesPage from "@/components/FacilitiesPage";
import EventsSection from "@/components/EventsSection";
import ArticlesSection from "@/components/ArticleSection";

// Ini akan memastikan halaman selalu memuat data terbaru
export const dynamic = "force-dynamic";
// Atau alternatifnya, gunakan revalidate jika ingin refresh berkala
// export const revalidate = 60; // Seconds

export default async function HomePage() {
  // Fetch both latest articles and upcoming events
  const latestArticles = await getPublishedArticles();
  const upcomingEvents = await getUpcomingEvents();

  // Limit to the most recent ones for display
  const featuredArticles = latestArticles.slice(0, 6);
  const featuredEvents = upcomingEvents.slice(0, 3);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <FacilitiesPage />
      <ArticlesSection
              articles={latestArticles}
              title="Artikel Terbaru"
              limit={3}
       />
      <EventsSection
        events={upcomingEvents}
        title="Acara Mendatang"
        limit={3}
      />
    </>
  );
}
