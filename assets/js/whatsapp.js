const WHATSAPP_NUMBER = "5511933082223"; // ajuste se necessário

const BASE_MESSAGE =
  "Olá! Tenho uma empresa de comércio/serviços (até 20 funcionários) e quero entender a assessoria jurídica mensal. Pode me enviar a proposta?";

function waLink(text){
  const msg = encodeURIComponent(text);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

function initWhatsApp(){
  // CTAs
  document.querySelectorAll(".js-wa-cta").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(waLink(BASE_MESSAGE), "_blank", "noopener,noreferrer");
    });
  });

  // Form -> compõe mensagem e abre WhatsApp
  const form = document.querySelector(".js-wa-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const nome = (fd.get("nome") || "").toString().trim();
    const whatsapp = (fd.get("whatsapp") || "").toString().trim();
    const segmento = (fd.get("segmento") || "").toString().trim();

    const text =
      `${BASE_MESSAGE}\n\n` +
      `Nome: ${nome}\n` +
      `WhatsApp: ${whatsapp}\n` +
      `Segmento: ${segmento}`;

    window.open(waLink(text), "_blank", "noopener,noreferrer");
  });
}

document.addEventListener("DOMContentLoaded", initWhatsApp);
