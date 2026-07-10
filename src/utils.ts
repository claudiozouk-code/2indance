/**
 * Helper utilities for dynamic SEO injection and user engagement tracking.
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Dynamically injects tracking tags (like Google Analytics, Facebook Pixel, GTM, etc.)
 * from the database's custom SEO configuration string.
 *
 * Normal assignment of innerHTML to a container does NOT execute `<script>` tags
 * for security reasons. This utility parses the HTML, finds all `<script>` blocks,
 * re-creates them using `document.createElement('script')` with matching attributes,
 * and appends them to a dedicated DOM node to guarantee proper execution.
 *
 * @param htmlString Raw HTML tracking string containing scripts, noscripts, and other tags
 */
export function injectTrackingTags(htmlString: string | null | undefined): void {
  if (!htmlString || typeof window === "undefined") return;

  const containerId = "custom-seo-tags-container";
  let container = document.getElementById(containerId);

  // If container exists, check if the content has changed
  if (container) {
    const currentHash = container.getAttribute("data-content-hash");
    const newHash = String(htmlString.length) + "-" + btoa(unescape(encodeURIComponent(htmlString.substring(0, 50))));
    
    if (currentHash === newHash) {
      // Content is identical; skip re-injecting to prevent duplicate tracking initialization
      return;
    }
    
    // Content changed; clear previous elements before loading new tags
    container.innerHTML = "";
    container.setAttribute("data-content-hash", newHash);
  } else {
    container = document.createElement("div");
    container.id = containerId;
    container.style.display = "none";
    document.body.appendChild(container);
    
    const initialHash = String(htmlString.length) + "-" + btoa(unescape(encodeURIComponent(htmlString.substring(0, 50))));
    container.setAttribute("data-content-hash", initialHash);
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    
    // Collect all elements from parsed head and body
    const nodes = Array.from(doc.head.childNodes).concat(Array.from(doc.body.childNodes));

    nodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tagName = el.tagName.toLowerCase();

        if (tagName === "script") {
          const scriptEl = document.createElement("script");
          
          // Clone attributes (e.g. src, async, defer, type)
          Array.from(el.attributes).forEach((attr) => {
            scriptEl.setAttribute(attr.name, attr.value);
          });
          
          // Re-assign text content (inline code)
          scriptEl.text = el.textContent || "";
          container?.appendChild(scriptEl);
        } else {
          // Clone and append non-script tags (e.g. meta, link, noscript, css styling)
          const clonedNode = el.cloneNode(true);
          container?.appendChild(clonedNode);
        }
      } else if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE) {
        // Preserve standard text nodes and comments
        const clonedNode = node.cloneNode(true);
        container?.appendChild(clonedNode);
      }
    });
    
    console.log("[SEO-Tracking] Dynamic tracking tags successfully parsed and injected.");
  } catch (error) {
    console.error("[SEO-Tracking] Error parsing or injecting custom tracking tags:", error);
  }
}

/**
 * Dispatches a custom user engagement event to any active Google Analytics instance.
 * Falls back to console logs in development or when no GA tracker is active.
 *
 * @param action Event category action (e.g., 'click_book_class', 'view_subpage')
 * @param category Broad category name (e.g., 'Engagement', 'Navigation')
 * @param label Optional detailed description label
 * @param value Optional numerical value
 */
export function trackUserEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    console.log(`[Engagement Tracked] Action: "${action}" | Category: "${category}" | Label: "${label || "N/A"}"`, { value });
  } else {
    // Development tracking simulation logs
    console.log(`[Engagement LocalLog] Action: "${action}" | Category: "${category}" | Label: "${label || "N/A"}"`, { value });
  }
}
