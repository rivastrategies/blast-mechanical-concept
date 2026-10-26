(() => {
  const intent = new URLSearchParams(window.location.search).get("intent");
  const contentByIntent = {
    quote: ["Request a System Quote", "Tell us which system you want to replace in the Service details field below. Our team will call you to discuss your options and arrange an estimate."],
    schedule: ["Request Maintenance Service", "Mention maintenance service or a maintenance membership in the Service details field below. Our team will call you to confirm availability; submitting this form does not book an appointment."],
    iaq: ["Request an Air Quality Evaluation", "Describe your air quality or humidity concerns in the Service details field below. Our team will call you to discuss the next step."],
  };
  const content = contentByIntent[intent];
  if (!content) return;
  document.body.dataset.serviceIntent = intent;
  const heading = document.querySelector("h1");
  const instructions = document.querySelector("#request-instructions");
  if (heading) heading.textContent = content[0];
  if (instructions) instructions.textContent = content[1];
})();
