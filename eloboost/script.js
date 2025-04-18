const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = navLinks.querySelectorAll('li');

  function toggleNav() {
    const nav = document.getElementById("navLinks");
    nav.classList.toggle("show");
  }

  function openPreview(img) {
    const modal = document.getElementById('imgPreviewModal');
    const preview = document.getElementById('previewImage');
    preview.src = img.src;
    modal.style.display = 'flex';
    modal.onclick = () => modal.style.display = 'none';
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinks.classList.remove('show');
      navToggle.classList.remove('fa-times');
      navToggle.classList.add('fa-bars');
    });
  });

  const galleryButtons = document.querySelectorAll('.gallery-btn');
const galleryImages = document.querySelectorAll('.gallery-img');
const descriptions = document.querySelectorAll('.desc');

galleryButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    // Dezaktywuj poprzednie
    document.querySelector('.gallery-btn.active')?.classList.remove('active');
    document.querySelector('.gallery-img.active')?.classList.remove('active');
    document.querySelector('.desc.active')?.classList.remove('active');

    // Aktywuj bieżące
    btn.classList.add('active');
    galleryImages[i].classList.add('active');
    descriptions[i].classList.add('active');
  });
});

// OBSERVER (jeśli element z ID `performance` istnieje)
const perfSection = document.getElementById('performance');
if (perfSection) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        perfSection.classList.add('show');
        observer.unobserve(perfSection);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(perfSection);
}