import DOMPurify, { type DOMPurify as DOMPurifyType } from 'dompurify';

function addDaisyUIHook(purify: DOMPurifyType) {
    purify.addHook('afterSanitizeAttributes', (node: Element) => {
        if (node.tagName === 'A') {
            // add daisy link class
            if(!node.classList.contains('link')) {
                node.classList.add('link');
            }
        }
    });
}

function addSafeLinkHook(purify: DOMPurifyType) {
    // Sanitizing links with /redirect?to=...
    purify.addHook("afterSanitizeAttributes", (node) => {
        if (node.tagName === "A") {
            if (node.hasAttribute("href")) {
                const href = node.getAttribute("href");
                if (href) {
                    const params = new URLSearchParams();
                    params.set("to", encodeURIComponent(href));
                    node.setAttribute("href", `/redirect?${params.toString()}`);
                }
            }
            node.setAttribute("rel", "nofollow");
            node.setAttribute("target", "_blank");
        }
    });
}

function addHooks(purify: DOMPurifyType) {
    addDaisyUIHook(purify);
    addSafeLinkHook(purify);
}

export default defineNuxtPlugin(async (nuxtApp) => {
    let sanitize: typeof DOMPurify.sanitize;

    if (import.meta.server) {
        const { JSDOM } = await import('jsdom');
        const domPurify = DOMPurify(new JSDOM('').window);
        addHooks(domPurify);
        sanitize = domPurify.sanitize;
    } else {
        const domPurify = DOMPurify(window);
        addHooks(domPurify);
        sanitize = domPurify.sanitize;
    }

    nuxtApp.provide('sanitizeHTML', sanitize);
});
