import themes from "daisyui/src/theming/themes";
import { ConfigProps } from "./types/config";

const config = {
  // REQUIRED
  appName: "ChatRabbit",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Create a 24/7 customer service agent trained on your website in 5 minutes. Try for free.",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "trychatrabbit.ai",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Three pricing plans: Free trial, Starter, Basic, and Professional
    plans: [
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_free_trial"
            : "price_free_trial",
        name: "Free Trial",
        description: "Perfect for getting started",
        price: 0,
        priceAnchor: "",
        features: [
          { name: "1 Chatbot" },
          { name: "25 Messages/month" },
          { name: "50 Web pages" },
          { name: "50K Character limit" },
          { name: "Basic analytics" },
          { name: "Email support" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_starter"
            : "price_starter",
        name: "Starter",
        description: "For small businesses",
        price: 29,
        priceAnchor: 39,
        features: [
          { name: "3 Chatbots" },
          { name: "1,000 Messages/month" },
          { name: "Unlimited web pages" },
          { name: "500K Character limit" },
          { name: "Advanced analytics" },
          { name: "Priority email support" },
          { name: "Custom branding" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_basic"
            : "price_basic",
        name: "Basic",
        description: "For growing teams",
        price: 99,
        priceAnchor: 149,
        isFeatured: true,
        features: [
          { name: "10 Chatbots" },
          { name: "5,000 Messages/month" },
          { name: "Unlimited web pages" },
          { name: "5M Character limit" },
          { name: "Advanced analytics" },
          { name: "Priority chat support" },
          { name: "Custom branding" },
          { name: "API access" },
          { name: "Lead capture" },
        ],
      },
      {
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_professional"
            : "price_professional",
        name: "Professional",
        description: "For larger organizations",
        price: 249,
        priceAnchor: 349,
        features: [
          { name: "Unlimited Chatbots" },
          { name: "Unlimited Messages" },
          { name: "Unlimited web pages" },
          { name: "Unlimited Character limit" },
          { name: "Advanced analytics" },
          { name: "24/7 priority support" },
          { name: "Custom branding" },
          { name: "API access" },
          { name: "Lead capture" },
          { name: "SSO authentication" },
          { name: "Custom integrations" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `ShipFast <noreply@resend.shipfa.st>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Marc at ShipFast <marc@resend.shipfa.st>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "marc.louvion@gmail.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "corporate",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["corporate"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/signin",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
