import Hero from "../components/Hero";
import Services from "../components/Services";
import CTA from "../components/CTA";
import ApproachSection from "../components/ApproachSection";
import Solutions from "../components/Solution";
import ProductDisplay from "../components/ProductDisplay";
import BlogSection from "../components/BlogSection";
import EmailSubscription from "../components/EmailSubscription";

const Home = () => {
  return (
    <div className="bg-white">
      <Hero />
      <Solutions />
      <ApproachSection />
      <Services />
      <ProductDisplay />
      <CTA />
      <BlogSection />
      <EmailSubscription />
    </div>
  );
};

export default Home;
