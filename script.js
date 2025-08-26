// 🌙 Dark mode toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('i');

// Load saved preference
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
}

themeToggle.addEventListener('click', () => {
    const dark = body.classList.toggle('dark-mode');
    icon.classList.replace(dark ? 'fa-moon' : 'fa-sun', dark ? 'fa-sun' : 'fa-moon');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
});

// 📑 Page navigation
document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const pageId = link.dataset.page;

        document.querySelectorAll('.page').forEach(page =>
            page.classList.remove('active')
        );

        document.getElementById(pageId).classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 🔒 Close mobile menu after clicking
        navLinks.classList.remove('active');
    });
});

// 📩 Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            subject: contactForm.subject.value,
            message: contactForm.message.value
        };

        console.log(formData); // send to backend later
        alert('✅ Thank you! Your message has been sent.');
        contactForm.reset();
    });
}

// 🍔 Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}
// =======================
// ⌨️ TYPING EFFECT (LOOP)
// =======================
const typingElement = document.getElementById("typing");
const roles = ["Developer", "Designer", "Programmer"]; // add more if you like
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentRole = roles[roleIndex];
  const currentText = currentRole.substring(0, charIndex);

  typingElement.textContent = currentText;

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex++;
    setTimeout(typeLoop, 100);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 50);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeLoop, 1200); // pause before deleting
    } else {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeLoop, 200);
    }
  }
}

window.addEventListener("load", typeLoop);
