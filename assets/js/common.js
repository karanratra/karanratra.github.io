$(document).ready(function() {
    $('a.abstract').click(function() {
        $(this).parent().parent().find(".abstract.hidden").toggleClass('open');
        $(this).parent().parent().find(".bibtex.hidden.open").toggleClass('open');
    });
    $('a.bibtex').click(function() {
        $(this).parent().parent().find(".bibtex.hidden").toggleClass('open');
        $(this).parent().parent().find(".abstract.hidden.open").toggleClass('open');
    });
    $('a').removeClass('waves-effect waves-light');
});

// Scroll-triggered fade-in animations
document.addEventListener('DOMContentLoaded', function() {
  // Fade-in sections on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.featured-section, .card, .metric-card, .impact-card, .case-study-card, .vol-card, .repo-focus-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Animate hero portrait on load
  const portrait = document.querySelector('.hero-portrait__frame');
  if (portrait) {
    portrait.style.opacity = '0';
    portrait.style.transform = 'scale(0.96)';
    portrait.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';
    setTimeout(() => {
      portrait.style.opacity = '1';
      portrait.style.transform = 'scale(1)';
    }, 100);
  }

  // Animate hero content on load
  const heroContent = document.querySelector('.hero-intro__content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateX(-20px)';
    heroContent.style.transition = 'opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s';
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateX(0)';
    }, 100);
  }

  // Animate metric cards with stagger
  document.querySelectorAll('.metric-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.5s ease ' + (0.1 + i * 0.1) + 's, transform 0.5s ease ' + (0.1 + i * 0.1) + 's';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 200);
  });

  // Animate hero-kicker on load
  const heroKicker = document.querySelector('.hero-kicker');
  if (heroKicker) {
    heroKicker.style.opacity = '0';
    heroKicker.style.transform = 'translateY(12px)';
    heroKicker.style.transition = 'opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s';
    setTimeout(() => {
      heroKicker.style.opacity = '1';
      heroKicker.style.transform = 'translateY(0)';
    }, 100);
  }
});

// Counter animation for metric values
function animateCounter(el, target, duration) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

document.addEventListener('DOMContentLoaded', function() {
  // Animate hero metric text values (these are strings, not numbers — skip)
  // The metrics are already "16+", "100M+", "25%", "$10M" — these are display values, not counters
});
