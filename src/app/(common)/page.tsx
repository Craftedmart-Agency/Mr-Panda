import ExpertChef from "./_components/ExpertChef";
import HeroBanner from "./_components/HeroBanner";
import NewsletterSection from "./_components/NewsletterSection";
import HappyCustomers from "./_components/ReviewSection";
import SpecialFood from "./_components/SpecialFood";
import WelcomeSection from "./_components/WelcomeSection";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <SpecialFood />
      <WelcomeSection/>
      <ExpertChef />
      <HappyCustomers />
      <NewsletterSection/>
    </>
  );
}