export const META_PIXEL_ID = "1749248649530991";
export const BASE_CHECKOUT_URL = "https://go.centerpag.com/PPU38CQFHQ9";
export const BASE_BACKREDIRECT_URL = "https://go.centerpag.com/PPU38CQFPHQ";

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
        n.queue ??= [];
        n.queue.push(args);
      }
    };

    window._fbq ??= n;
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
    value: 9.9,
    currency: "USD",
    ...extraParams,
  });
}

/**
 * Track when user clicks to start the quiz on landing page
 */
export function trackLandingStartClick() {
  fbq("trackCustom", "QuizLandingStartClick", {
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track when user starts question 1
 */
export function trackQuizStart() {
  fbq("trackCustom", "QuizStart", {
    step: 1,
    total_steps: 13,
    quiz_name: "BrazilianBooty - Desafío 28 Días",
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
 * Track navigation back within the quiz
 */
export function trackQuizNavigationBack(fromScreen: string) {
  fbq("trackCustom", "QuizBackClick", {
    from_screen: fromScreen,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track user scratching the coupon card
 */
export function trackCouponScratchStart() {
  fbq("trackCustom", "CouponScratchStart", {
    coupon_code: "BUMBUM90",
  });
}

/**
 * Track coupon successfully unlocked
 */
export function trackCouponUnlocked() {
  fbq("trackCustom", "CouponUnlocked", {
    coupon_code: "BUMBUM90",
    discount: "90% OFF",
    status: "unlocked",
  });
}

/**
 * Track click on continue button after unlocking coupon
 */
export function trackCouponContinueClick() {
  fbq("trackCustom", "CouponContinueClick", {
    coupon_code: "BUMBUM90",
    destination: "vsl_final_screen",
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
    content_name: "BrazilianBooty - Quiz Completado",
    content_category: "Quiz Lead",
    value: 9.9,
    currency: "USD",
    ...profileSummary,
  });
}

/**
 * Track InitiateCheckout when CTA button is clicked
 */
export function trackInitiateCheckout(
  clickLocation = "final_cta",
  productValue = 9.9,
  couponCode = "BUMBUM90",
  extra: Record<string, unknown> = {},
) {
  fbq("track", "InitiateCheckout", {
    content_name: "BrazilianBooty - Desafío 28 Días",
    content_category: "Programa Digital",
    content_ids: ["BRAZILIANBOOTY28"],
    content_type: "product",
    value: productValue,
    currency: "USD",
    num_items: 1,
    coupon: couponCode,
    click_location: clickLocation,
    ...extra,
  });
}

/**
 * Reads URL search params and appends UTMs + tracking tokens directly to Checkout URL.
 */
export function getDecoratedCheckoutUrl(baseUrl = BASE_CHECKOUT_URL): string {
  if (!baseUrl) return "#";
  if (typeof window === "undefined") return baseUrl;

  try {
    const url = new URL(baseUrl, window.location.origin);
    const currentParams = new URLSearchParams(window.location.search);

    // Pass all query parameters forward (UTMs, fbclid, gclid, ttclid, etc.)
    currentParams.forEach((value, key) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    // Provide default src/sck for sales tracking if not already set
    if (!url.searchParams.has("src") && !url.searchParams.has("sck")) {
      const utmSource = currentParams.get("utm_source") || "meta_ads";
      const utmCampaign = currentParams.get("utm_campaign") || "quiz_brazilianbooty";
      url.searchParams.set("src", `${utmSource}_${utmCampaign}`);
      url.searchParams.set("sck", `${utmSource}_${utmCampaign}`);
    }

    return url.toString();
  } catch (err) {
    console.warn("[Tracking] Error building checkout URL:", err);
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
 * Track when VSL video reaches pitch section
 */
export function trackVslPitchReached() {
  fbq("trackCustom", "VslPitchReached", {
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track VSL unmuting
 */
export function trackVslUnmute() {
  fbq("trackCustom", "VslUnmuteClick", {
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track VSL speed change
 */
export function trackVslSpeedChange(speed: number) {
  fbq("trackCustom", "VslSpeedChange", {
    speed,
  });
}

/**
 * Track CTA click on the VSL page
 */
export function trackVslCtaClick(location = "vsl_primary_cta") {
  trackInitiateCheckout(location, 9.9, "BUMBUM90");
  fbq("trackCustom", "VslCtaClick", {
    click_location: location,
    product: "BrazilianBooty - Desafío 28 Días",
    value: 9.9,
    currency: "USD",
  });
}

/**
 * Track Backredirect page view
 */
export function trackBackredirectView() {
  trackPageView("Backredirect - BrazilianBooty 28 Días");
  trackViewContent("Backredirect BrazilianBooty", {
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
  trackInitiateCheckout(location, 9.9, "BUMBUM90", { page: "backredirect" });
  fbq("trackCustom", "BackredirectCtaClick", {
    click_location: location,
    product: "BrazilianBooty - Desafío 28 Días",
    value: 9.9,
    currency: "USD",
  });
}

/**
 * Track when Downsell modal ($5.90 offer) is triggered/viewed
 */
export function trackDownsellModalView() {
  fbq("trackCustom", "DownsellModalView", {
    offer: "BrazilianBooty Plan 28 Días Downsell",
    price: 5.9,
    currency: "USD",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track CTA click on Downsell offer ($5.90)
 */
export function trackDownsellCtaClick(location = "downsell_modal_cta") {
  trackInitiateCheckout(location, 5.9, "BUMBUM590", { page: "downsell_modal" });

  fbq("trackCustom", "DownsellCtaClick", {
    click_location: location,
    product: "BrazilianBooty - Desafío 28 Días Downsell",
    value: 5.9,
    currency: "USD",
  });
}

/**
 * Track when user dismisses or closes downsell modal
 */
export function trackDownsellDismiss() {
  fbq("trackCustom", "DownsellModalDismiss", {
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track FAQ Accordion interaction
 */
export function trackFaqToggle(faqQuestion: string, isOpen: boolean, screenContext = "final_vsl") {
  if (isOpen) {
    fbq("trackCustom", "FaqItemOpened", {
      question: faqQuestion,
      screen_context: screenContext,
    });
  }
}

/**
 * Track Biometrics selection (Weight, Height, IMC)
 */
export function trackBiometrics(weight: number, height: number, imc: number) {
  fbq("trackCustom", "QuizBiometricsSaved", {
    weight_kg: weight,
    height_cm: height,
    calculated_imc: imc,
  });
}

/**
 * Track Diagnostic screen view with calculations
 */
export function trackDiagnosticView(details: Record<string, unknown> = {}) {
  fbq("trackCustom", "QuizDiagnosticView", {
    ...details,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track Dedicated VSL page view
 */
export function trackVslPageView() {
  trackPageView("VSL Presentación - BrazilianBooty 28 Días");
  trackViewContent("Quiz VSL Dedicated Page", {
    page_type: "vsl_presentation",
  });
}

/**
 * Track Full Plan offer page view
 */
export function trackPlanPageView(details: Record<string, unknown> = {}) {
  trackPageView("Plano 28 Días - BrazilianBooty");
  trackViewContent("Quiz Plan Offer Screen", {
    page_type: "full_offer_plan",
    price: 9.9,
    currency: "USD",
    ...details,
  });
}

/**
 * Track Sound toggle interaction in quiz UI
 */
export function trackSoundToggle(soundEnabled: boolean) {
  fbq("trackCustom", "QuizSoundToggle", {
    sound_enabled: soundEnabled,
  });
}
