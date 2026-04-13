document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('back-to-top');
  if (!button) return;

  const toggleVisibility = () => {
    const shouldShow = window.scrollY > 480;
    button.classList.toggle('is-visible', shouldShow);
  };

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
});
