const citations = {
  'tool-error': `@article{shi2026toolerror,
  title   = {How Tool-Error Signals Shape Recovery Route Selection in Information-Gathering {LLM} Agents: A Controlled Factorial Study},
  author  = {Shi, Yunjiao and Liu, Yuru and Du, Guomin and Liu, Hualin and Feng, Shi},
  journal = {IEEE Access},
  year    = {2026},
  volume  = {14},
  pages   = {147769--147778},
  doi     = {10.1109/ACCESS.2026.3736562}
}`,
  reqtestagent: `@article{shi2026reqtestagent,
  title   = {{ReqTestAgent}: Execution-Grounded Language-Model Agents for Acceptance Testing under Requirement Ambiguity},
  author  = {Shi, Yunjiao and Song, Rui},
  journal = {Frontiers in Artificial Intelligence},
  year    = {2026},
  note    = {Accepted 30 September 2026; in production},
  doi     = {10.3389/frai.2026.1960601},
  url     = {https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2026.1960601/abstract}
}`,
};

const citationDialog = document.querySelector('#citation-dialog');
const citationText = document.querySelector('#citation-text');
const copyStatus = document.querySelector('#copy-status');

if (typeof citationDialog.showModal === 'function') {
  document.querySelectorAll('[data-citation]').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => {
      citationText.value = citations[button.dataset.citation];
      copyStatus.textContent = '';
      citationDialog.showModal();
    });
  });
}

document.querySelector('.dialog-close').addEventListener('click', () => citationDialog.close());
citationDialog.addEventListener('click', (event) => {
  if (event.target !== citationDialog) return;
  const bounds = citationDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    citationDialog.close();
  }
});

document.querySelector('.copy-citation').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(citationText.value);
    copyStatus.textContent = 'Citation copied.';
  } catch {
    citationText.focus();
    citationText.select();
    copyStatus.textContent = 'Text selected. Use your device’s Copy command.';
  }
});

const sections = [...document.querySelectorAll('main > section[id]')];
const navigationLinks = [...document.querySelectorAll('.navigation a')];
let scrollScheduled = false;

function updateNavigation() {
  const activationLine = Math.min(180, window.innerHeight * 0.25);
  let current = sections[0].id;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= activationLine) current = section.id;
  });
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 3) {
    current = sections.at(-1).id;
  }
  navigationLinks.forEach((link) => {
    const active = link.hash === `#${current}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scrollScheduled = false;
}

window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    window.requestAnimationFrame(updateNavigation);
    scrollScheduled = true;
  }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();
document.querySelector('#copyright-year').textContent = new Date().getFullYear();
