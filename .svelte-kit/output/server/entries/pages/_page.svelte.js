import "../../chunks/async.js";
import { F as head } from "../../chunks/app-server.js";
function _page($$renderer) {
  head($$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>anytool</title>`);
    });
    $$renderer2.push(`<meta name="description" content="On-demand tool generation for AI agents. Create any tool instantly."/>`);
  });
  $$renderer.push(`<div class="min-h-screen bg-white"><header class="border-b border-gray-200"><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex justify-between items-center py-6"><img src="/anytool.svg" alt="anytool" class="h-8"/> <div class="text-sm text-gray-600"><a href="mailto:support@anytoolhq.com" class="hover:text-gray-900">Contact</a></div></div></div></header> <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-40"><h1 class="text-2xl font-bold text-gray-900 mb-6">On-demand tool generation for AI agents</h1> <p class="text-xl text-gray-600 mb-8">Instead of building dozens of tools, give your AI agents one tool that can
      create anything instantly. QR codes, charts, calculators, forms — all
      securely rendered and shareable.</p></section> <footer class="border-t border-gray-200 py-8"><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500"><p>© 2025 anytool.</p></div></footer></div>`);
}
export {
  _page as default
};
