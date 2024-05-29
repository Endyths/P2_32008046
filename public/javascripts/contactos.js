document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const recaptchaResponse = await grecaptcha.execute('<%= process.env.RECAPTCHA_SITE_KEY %>', { action: 'submit' });
      document.querySelector('#g-recaptcha-response').value = recaptchaResponse;
      form.submit();
    });
  });