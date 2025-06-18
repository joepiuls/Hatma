import { useEffect } from "react";
import Shop from "../components/Shop";
import { trackEvent } from "../utils/trackEvent";

const ShopPage = () => {
  useEffect(()=>{
    trackEvent('page_visit', {page: 'Shop'})
  }, [])
  return (
    <div>
      <Shop />
    </div>
  );
};

export default ShopPage;
