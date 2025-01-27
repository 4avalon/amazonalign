function setupFormEvents() {
  //console.log('[FormHandler] Configurando eventos do formulário...');

  const form = document.getElementById('contact-form-section');
  if (form) {
    form.addEventListener('submit', (event) => {
      // Impede o comportamento padrão do formulário (reload da página)
      event.preventDefault();
      //console.log('[FormHandler] Evento de submit capturado.');

      // Captura os valores dos campos
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      //console.log('[FormHandler] Valores capturados:', { name, email, message });

      // Validação simples
      if (!name || !email || !message) {
        alert('Preencha todos os campos antes de enviar.');
        //console.warn('[FormHandler] Validação falhou. Campos vazios detectados.');
        return;
      }

      // Formatação da mensagem para o WhatsApp
      const whatsappNumber = '5511933360108'; // Número de WhatsApp
      const textMessage = `Nome: ${name}\nE-mail: ${email}\nMensagem: ${message}`;
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMessage)}`;

      //console.log('[FormHandler] URL do WhatsApp gerada:', whatsappURL);

      // Redireciona para o WhatsApp
      window.open(whatsappURL, '_blank');
      //console.log('[FormHandler] Redirecionamento para o WhatsApp iniciado.');
    });
  } else {
    //console.error('[FormHandler] Formulário não encontrado!');
  }
}

// Expõe a função globalmente
window.setupFormEvents = setupFormEvents;
