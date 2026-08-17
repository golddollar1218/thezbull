// ─────────────────────────────────────────────
//  CONFIG — Update these when your token launches
// ─────────────────────────────────────────────
const CONFIG = {
  tokenAddress: "TBA",

  // Optional: DexScreener pair address (overrides tokenAddress for chart)
  dexScreenerPair: "",

  // pump.fun coin page — auto-built from tokenAddress if left empty
  pumpFunUrl: "",

  twitter: "https://x.com/zbullsol",
  telegram: "https://t.me/zbullsol",
};

const PLACEHOLDER_CA = "TBA";

function isTokenLive() {
  const addr = CONFIG.tokenAddress;
  return Boolean(addr) && addr !== "TBA";
}

function getChartId() {
  if (CONFIG.dexScreenerPair) return CONFIG.dexScreenerPair;
  return isTokenLive() ? CONFIG.tokenAddress : "";
}

function getPumpFunUrl() {
  if (CONFIG.pumpFunUrl) return CONFIG.pumpFunUrl;
  if (isTokenLive()) return `https://pump.fun/coin/TBA/coin/${CONFIG.tokenAddress}`;
  return "https://pump.fun/coin/TBA";
}

function buildDexScreenerEmbedUrl(id) {
  const params = new URLSearchParams({
    embed: "1",
    loadChartSettings: "0",
    trades: "0",
    tabs: "0",
    info: "0",
    chartLeftToolbar: "0",
    chartDefaultOnMobile: "1",
    chartTheme: "dark",
    chartStyle: "1",
    chartType: "usd",
    interval: "15",
  });
  return `https://dexscreener.com/solana/${id}?${params.toString()}`;
}

function initContract() {
  const display = document.getElementById("ca-display");
  const copyBtn = document.getElementById("copy-ca");
  const toast = document.getElementById("copy-toast");
  const address = isTokenLive() ? CONFIG.tokenAddress : PLACEHOLDER_CA;

  display.textContent = address;

  copyBtn.addEventListener("click", async () => {
    if (!isTokenLive()) {
      toast.textContent = "Token address not set yet!";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
      return;
    }

    try {
      await navigator.clipboard.writeText(CONFIG.tokenAddress);
      copyBtn.classList.add("copied");
      copyBtn.querySelector("span").textContent = "Copied!";
      toast.textContent = "Contract address copied!";
      toast.classList.add("show");

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.querySelector("span").textContent = "Copy";
        toast.classList.remove("show");
      }, 2500);
    } catch {
      toast.textContent = "Copy failed — select and copy manually.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });
}

function initChart() {
  const iframe = document.getElementById("dexscreener-embed");
  const placeholder = document.getElementById("chart-placeholder");
  const link = document.getElementById("dexscreener-link");
  const chartId = getChartId();

  if (!chartId) {
    iframe.classList.add("hidden");
    placeholder.classList.remove("hidden");
    link.href = "https://dexscreener.com/solana";
    link.textContent = "Browse Solana pairs on DexScreener →";
    return;
  }

  iframe.src = buildDexScreenerEmbedUrl(chartId);
  link.href = `https://dexscreener.com/solana/${chartId}`;
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initSocialLinks() {
  const pumpUrl = getPumpFunUrl();

  document.querySelectorAll("[data-pumpfun]").forEach((el) => {
    el.href = pumpUrl;
  });

  document.querySelectorAll("[data-telegram]").forEach((el) => {
    el.href = CONFIG.telegram;
  });

  document.querySelectorAll("[data-twitter]").forEach((el) => {
    el.href = CONFIG.twitter;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initContract();
  initChart();
  initNav();
  initSocialLinks();
});
