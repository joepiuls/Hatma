import { api } from "../axios";

// Enhanced session management
let sessionId = localStorage.getItem('analytics_session_id');
if (!sessionId) {
  sessionId = Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
  localStorage.setItem('analytics_session_id', sessionId);
}

// Device detection
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
};

// Enhanced event tracking
export const trackEvent = async (eventName, payload = {}) => {
  try {
    const eventData = {
      type: eventName,
      metadata: {
        ...payload,
        // Core context
        timestamp: new Date().toISOString(),
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        
        // Enhanced context
        sessionId,
        deviceType: getDeviceType(),
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        currentUrl: window.location.href,
        path: window.location.pathname,
        
        // Performance metrics
        performance: {
          timing: {
            dns: performance.timing.domainLookupEnd - performance.timing.domainLookupStart,
            connect: performance.timing.connectEnd - performance.timing.connectStart,
            ttfb: performance.timing.responseStart - performance.timing.requestStart,
            download: performance.timing.responseEnd - performance.timing.responseStart,
            domInteractive: performance.timing.domInteractive - performance.timing.navigationStart,
            domComplete: performance.timing.domComplete - performance.timing.navigationStart,
            loadEvent: performance.timing.loadEventEnd - performance.timing.navigationStart,
          },
          memory: performance.memory ? {
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            usedJSHeapSize: performance.memory.usedJSHeapSize,
          } : null
        }
      }
    };

    // Add UTM parameters if present
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      if (urlParams.has(param)) {
        utmParams[param] = urlParams.get(param);
      }
    });
    
    if (Object.keys(utmParams).length > 0) {
      eventData.metadata.utm = utmParams;
    }

    // Add user ID if authenticated
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        // Assuming JWT token with user ID in payload
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        if (payload.userId) {
          eventData.metadata.userId = payload.userId;
        }
      } catch (e) {
        console.warn('Failed to parse auth token', e);
      }
    }

    await api.post('/analytics/track', eventData);
  } catch (error) {
    console.error('Tracking event failed:', error);
    // Optional: Implement retry logic or offline queuing here
  }
};

// Page view tracking
export const trackPageView = () => {
  trackEvent('page_visit', {
    page: window.location.pathname,
    title: document.title,
    query: window.location.search,
    hash: window.location.hash
  });
};

// Form submission tracking
export const trackFormSubmission = (formId, formData) => {
  trackEvent('form_submission', {
    formId,
    fields: Object.keys(formData).map(key => ({
      name: key,
      value: formData[key]?.toString()?.substring(0, 100) // Truncate long values
    }))
  });
};

// Conversion tracking
export const trackConversion = (conversionType, value = 0) => {
  trackEvent('conversion', {
    type: conversionType,
    value
  });
};

// E-commerce tracking
export const trackPurchase = (order) => {
  trackEvent('sale', {
    transactionId: order.id,
    value: order.total,
    currency: order.currency,
    items: order.items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }))
  });
};

// Error tracking
export const trackError = (error, context = {}) => {
  trackEvent('error', {
    message: error.message,
    stack: error.stack,
    ...context
  });
};

// Initialize tracking
export const initTracking = () => {
  // Track initial page view
  trackPageView();

  // Track subsequent route changes (for SPAs)
  if (window.history.pushState) {
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      trackPageView();
    };

    window.addEventListener('popstate', trackPageView);
  }

  // Track visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      trackEvent('session_resume');
    } else {
      trackEvent('session_pause');
    }
  });

  // Track unload events
  window.addEventListener('beforeunload', () => {
    trackEvent('session_end');
  });
};