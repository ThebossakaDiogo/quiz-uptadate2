export const META_PIXEL_ID = "";
export const BASE_CHECKOUT_URL = "";

type MetaPixelFn = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: MetaPixelFn;
    _fbq?: MetaPixelFn;
  }
}

/**
 * Safe execution helper for Meta Pixel (window.fbq)
 */
export function fbq(...args: unknown[]) {
  if (typeof window === "undefined" || !META_PIXEL_ID) return;
  if (window.fbq) {
    try {
      window.fbq(...args);
    } catch (err) {
      console.warn("[Meta Pixel] Event tracking failed:", err);
    }
  }
}

/**
 * Initializes Meta Pixel in the browser if not already loaded
 */
export function initMetaPixel() {
  if (typeof window === "undefined" || !META_PIXEL_ID) return;

  if (!window.fbq) {
    const n: MetaPixelFn = function (...args: unknown[]) {
      if (n.callMethod) {
        n.callMethod(...args);
      } else {
        if (!n.queue) n.queue = [];
        n.queue.push(args);
      }
    };

    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript?.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  fbq("init", META_PIXEL_ID);
  fbq("track", "PageView");
}

/**
 * Track generic PageView with custom page name
 */
export function trackPageView(pageName?: string) {
  fbq("track", "PageView", {
    page_name: pageName || (typeof document !== "undefined" ? document.title : "Quiz"),
    url: typeof window !== "undefined" ? window.location.href : "",
  });
}

/**
 * Track ViewContent for funnel screens
 */
export function trackViewContent(screenName: string, extraParams: Record<string, unknown> = {}) {
  fbq("track", "ViewContent", {
    content_name: screenName,
    content_category: "Quiz Funnel 28 Dias",
    content_type: "quiz_step",
    value: 19.9,
    currency: "USD",
    ...extraParams,
  });
}

/**
 * Track when user starts question 1
 */
export function trackQuizStart() {
  fbq("trackCustom", "QuizStart", {
    step: 1,
    total_steps: 13,
    quiz_name: "Desafío Glúteos Brasileños 28 días",
  });
}

/**
 * Track step by step progress
 */
export function trackQuizProgress(
  questionNumber: number,
  questionTitle: string,
  totalQuestions = 13,
) {
  const progressPercent = Math.round((questionNumber / totalQuestions) * 100);
  fbq("trackCustom", "QuizProgress", {
    question_number: questionNumber,
    question_title: questionTitle,
    progress_percent: progressPercent,
  });

  if (questionNumber === 1) {
    trackQuizStart();
  } else if (questionNumber === 7) {
    fbq("trackCustom", "QuizMidpoint", { progress_percent: 50 });
  }
}

/**
 * Track user's specific answer choices for rich audience profiling
 */
export function trackQuizAnswer(
  questionNumber: number,
  questionTitle: string,
  selectedOption: string,
) {
  fbq("trackCustom", "QuizAnswer", {
    question_number: questionNumber,
    question_title: questionTitle,
    selected_option: selectedOption,
  });
}

/**
 * Track full completion of the quiz (Question 13 finished)
 */
export function trackQuizComplete(profileSummary: Record<string, unknown> = {}) {
  fbq("trackCustom", "QuizComplete", {
    total_steps: 13,
    status: "completed",
    ...profileSummary,
  });

  fbq("track", "Lead", {
    content_name: "Quiz 28 Días Completado",
    content_category: "Quiz Lead",
    value: 19.9,
    currency: "USD",
    ...profileSummary,
  });
}

/**
 * Track InitiateCheckout when CTA button is clicked
 */
export function trackInitiateCheckout(clickLocation = "final_cta") {
  fbq("track", "InitiateCheckout", {
    content_name: "Desafío Glúteos Brasileños 28 Días",
    content_category: "Programa Digital",
    content_ids: ["BUMBUM28"],
    content_type: "product",
    value: 19.9,
    currency: "USD",
    num_items: 1,
    coupon: "BUMBUM90",
    click_location: clickLocation,
  });
}

/**
 * Reads URL search params and appends UTMs + tracking tokens directly to Hotmart Checkout URL.
 */
export function getDecoratedCheckoutUrl(baseUrl = BASE_CHECKOUT_URL): string {
  if (!baseUrl) return "#";
  if (typeof window === "undefined") return baseUrl;

  try {
    const url = new URL(baseUrl);
    const currentParams = new URLSearchParams(window.location.search);

    const paramsToPass = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "gclid",
      "src",
      "sck",
      "off",
    ];

    let hasCustomSrc = false;
    paramsToPass.forEach((param) => {
      const val = currentParams.get(param);
      if (val) {
        url.searchParams.set(param, val);
        if (param === "src" || param === "sck") hasCustomSrc = true;
      }
    });

    if (!hasCustomSrc) {
      const utmSource = currentParams.get("utm_source") || "meta_ads";
      const utmCampaign = currentParams.get("utm_campaign") || "quiz_bumbum28";
      url.searchParams.set("src", `${utmSource}_${utmCampaign}`);
      url.searchParams.set("sck", `${utmSource}_${utmCampaign}`);
    }

    return url.toString();
  } catch (err) {
    console.warn("[Meta Pixel] Error building checkout URL:", err);
    return baseUrl;
  }
}

/**
 * Track when VSL video begins playback
 */
export function trackVslPlay(videoName = "vsl-video.mp4") {
  fbq("trackCustom", "VslPlay", {
    video_name: videoName,
    page_type: "vsl",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track VSL video watch milestone (25%, 50%, 75%, 90%, 100%)
 */
export function trackVslMilestone(percent: number, videoName = "vsl-video.mp4") {
  fbq("trackCustom", `VslWatch_${percent}%`, {
    video_name: videoName,
    milestone_percent: percent,
  });

  if (percent >= 50) {
    fbq("trackCustom", "VslEngagedViewer", { percent });
  }
}

/**
 * Track CTA click on the VSL page
 */
export function trackVslCtaClick(location = "vsl_primary_cta") {
  trackInitiateCheckout(location);
  fbq("trackCustom", "VslCtaClick", {
    click_location: location,
    product: "Desafío Glúteos Brasileños 28 Días",
    value: 9.9,
    currency: "USD",
  });
}

/**
 * Track Backredirect page view
 */
export function trackBackredirectView() {
  trackPageView("Backredirect - Oferta Especial 28 Días");
  trackViewContent("Backredirect Especial", {
    page_type: "backredirect",
    value: 9.9,
    currency: "USD",
  });
  fbq("trackCustom", "BackredirectView", {
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track CTA click on Backredirect page ($9.90 offer)
 */
export function trackBackredirectCtaClick(location = "backredirect_primary_cta") {
  trackInitiateCheckout(location);
  fbq("trackCustom", "BackredirectCtaClick", {
    click_location: location,
    product: "Desafío Glúteos Brasileños 28 Días",
    value: 9.9,
    currency: "USD",
  });
}

/**
 * Track when Downsell modal ($5.90 offer) is triggered/viewed
 */
export function trackDownsellModalView() {
  fbq("trackCustom", "DownsellModalView", {
    offer: "Plan 28 Días Downsell",
    price: 5.9,
    currency: "USD",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track CTA click on Downsell offer ($5.90)
 */
export function trackDownsellCtaClick(location = "downsell_modal_cta") {
  fbq("track", "InitiateCheckout", {
    content_name: "Desafío Glúteos Brasileños 28 Días - Oferta Downsell",
    content_category: "Programa Digital",
    content_ids: ["BUMBUM28_DOWNSELL"],
    content_type: "product",
    value: 5.9,
    currency: "USD",
    num_items: 1,
    coupon: "BUMBUM590",
    click_location: location,
  });

  fbq("trackCustom", "DownsellCtaClick", {
    click_location: location,
    product: "Desafío Glúteos Brasileños 28 Días Downsell",
    value: 5.9,
    currency: "USD",
  });
}
