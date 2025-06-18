import Hero from "../components/Hero";
import Services from "../components/Services";
import CTA from "../components/CTA";
import ApproachSection from "../components/ApproachSection";
import Solutions from "../components/Solution";
import ProductDisplay from "../components/ProductDisplay";
import BlogSection from "../components/BlogSection";
import EmailSubscription from "../components/EmailSubscription";
import { trackEvent } from "../utils/trackEvent";
import { useEffect } from "react";

const Home = () => {



 useEffect(() => {
  const referrer = document.referrer;
  let source = 'Direct'; // default for users typing your URL or bookmarked

  if (referrer) {
    try {
      const refUrl = new URL(referrer);
      const hostname = refUrl.hostname;

      if (hostname.includes('google')) source = 'Google';
      else if (hostname.includes('facebook')) source = 'Facebook';
      else if (hostname.includes('instagram')) source = 'Instagram';
      else source = hostname;
    } catch (err) {
      console.warn('Invalid referrer URL:', referrer);
    }
  }

  trackEvent('traffic_source', { source });
  trackEvent('page_visit', {page:'HomePage'});
  }, [])

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
