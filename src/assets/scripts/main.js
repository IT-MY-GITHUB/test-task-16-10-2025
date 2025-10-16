// range input
const rangeInput = document.getElementById('range');
const rangeValue = document.getElementById('range-percent-value');

rangeValue.textContent = `${rangeInput.value}%`;

rangeInput.addEventListener('input', () => {
  rangeValue.textContent = `${rangeInput.value}%`;
});
//

// custom select
const select = document.getElementById('select');
const trigger = select.querySelector('.select__trigger');
const text = select.querySelector('.select__trigger-text');
const options = Array.from(select.querySelectorAll('.select__option'));
const hiddenSelectInput = select.querySelector('input[name="system_type"]');

let currentIndex = -1;

function openSelect() {
  select.classList.add('open');
}

function closeSelect() {
  select.classList.remove('open');
  currentIndex = -1;
  clearActive();
}

function clearActive() {
  options.forEach(o => o.classList.remove('active'));
}

function setActive(index) {
  clearActive();
  if (index >= 0 && index < options.length) {
    options[index].classList.add('active');
  }
}

trigger.addEventListener('click', () => {
  select.classList.toggle('open');
});

options.forEach((opt, i) => {
  opt.addEventListener('click', () => {
    text.textContent = opt.textContent;
    hiddenSelectInput.value = opt.textContent;
    closeSelect();
  });
});

document.addEventListener('click', e => {
  if (!select.contains(e.target)) closeSelect();
});

select.addEventListener('keydown', e => {
  const isOpen = select.classList.contains('open');

  switch (e.key) {
    case 'Enter':
      if (!isOpen) {
        openSelect();
      } else if (currentIndex >= 0) {
        const selected = options[currentIndex];
        text.textContent = selected.textContent;
        hiddenSelectInput.value = selected.textContent;
        closeSelect();
      }
      break;

    case 'Escape':
      closeSelect();
      break;

    case 'ArrowDown':
      if (!isOpen) openSelect();
      currentIndex = (currentIndex + 1) % options.length;
      setActive(currentIndex);
      break;

    case 'ArrowUp':
      if (!isOpen) openSelect();
      currentIndex = (currentIndex - 1 + options.length) % options.length;
      setActive(currentIndex);
      break;
  }
});

// mobile menu
const menuShowBtn = document.querySelector("svg#menu-show")
  , mobileMenu = document.getElementById("mobile_menu");
menuShowBtn?.addEventListener("click", (()=>{
    if (mobileMenu.classList.contains("show"))
        return mobileMenu.classList.remove("show"),
        void (document.body.style.overflowY = "auto");
    mobileMenu.classList.add("show"),
    document.body.style.overflowY = "hidden"
}
));

const mobileMenuItems = document.querySelectorAll(".mobile-menu__link")

mobileMenuItems.forEach((function(e) {
    e.addEventListener("click", (function() {
        document.body.style.overflowY = "auto",
        document.getElementById("mobile_menu").classList.remove("show")
        document.getElementById("menu-show").classList.remove("active")
    }
    ))
}
));

