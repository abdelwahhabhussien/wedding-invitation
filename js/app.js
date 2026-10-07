// ==========================
// WEDDING INVITATION BEHAVIOR
// ==========================
const $ = (s) => document.querySelector(s);

function setText(selector, value){ const el=$(selector); if(el) el.textContent=value; }

setText('.hero h1 span:first-child', WEDDING.groomName);
setText('.hero h1 span:last-child', WEDDING.brideName);
setText('.hero-date strong', WEDDING.dateEnglish);
setText('.hero-date span', WEDDING.timeArabic);
setText('.venue-card h3', WEDDING.venueName);
setText('.map-btn', 'فتح الموقع على الخريطة ↗');
$('.map-btn').href = WEDDING.mapsUrl;
const calendarBtn = $('#calendarBtn');
if(calendarBtn){
  const start='20261112T163000Z';
  const end='20261112T183000Z';
  const params=new URLSearchParams({action:'TEMPLATE',text:`Wedding — ${WEDDING.groomName} & ${WEDDING.brideName}`,dates:`${start}/${end}`,location:WEDDING.venueName+', '+WEDDING.venueAddress,details:'Wedding invitation'});
  calendarBtn.href='https://calendar.google.com/calendar/render?'+params.toString();
  calendarBtn.target='_blank';
  calendarBtn.rel='noopener';
}

setText('.footer strong', `${WEDDING.brideName} & ${WEDDING.groomName}`);
setText('.envelope-letter strong', `${WEDDING.brideName} & ${WEDDING.groomName}`);

// Envelope opening
const opening = $('#opening');
const envelope = $('#envelope');
const site = $('#site');
$('#openBtn').addEventListener('click', async () => {
  envelope.classList.add('open');

  // Start the song from the user's click. Browsers allow autoplay here
  // because this play() call is directly inside the click interaction.
  try {
    await audio.play();
    audioBtn.hidden = false;
    audioBtn.textContent = '❚❚';
  } catch (err) {
    // If the browser blocks playback for any reason, the floating button
    // remains available so the guest can start it manually.
    audioBtn.hidden = false;
    audioBtn.textContent = '♫';
  }

  setTimeout(() => {
    opening.classList.add('hidden');
    site.classList.add('visible');
    site.setAttribute('aria-hidden','false');
  }, 850);
});

// Countdown
const target = new Date(WEDDING.targetISO).getTime();
function pad(n){return String(Math.max(0,n)).padStart(2,'0')}
function countdown(){
  let diff = target - Date.now();
  if(diff < 0) diff = 0;
  const sec = Math.floor(diff/1000);
  const days = Math.floor(sec/86400);
  const hours = Math.floor((sec%86400)/3600);
  const mins = Math.floor((sec%3600)/60);
  const secs = sec%60;
  setText('#days', pad(days)); setText('#hours', pad(hours)); setText('#minutes', pad(mins)); setText('#seconds', pad(secs));
}
countdown(); setInterval(countdown,1000);

// Funny runaway NO button: desktop hover + mobile touch.
const noBtn = $('#noBtn');
const area = $('#answerArea');
function moveNo(){
  const a = area.getBoundingClientRect();
  const b = noBtn.getBoundingClientRect();
  const maxX = Math.max(0, a.width - b.width);
  const maxY = Math.max(0, a.height - b.height);
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  noBtn.style.transform = 'none';
  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}
noBtn.addEventListener('mouseenter', moveNo);
noBtn.addEventListener('pointerdown', (e)=>{ e.preventDefault(); moveNo(); });
noBtn.addEventListener('touchstart', (e)=>{ e.preventDefault(); moveNo(); }, {passive:false});
$('#yesBtn').addEventListener('click',()=>{
  $('#yesMessage').hidden=false;
  $('#yesBtn').textContent='تمت الموافقة ❤️';
});

// RSVP -> Google Apps Script / Google Sheet
// We submit through a hidden iframe so the public static site does not need
// CORS access to read the Apps Script response.
const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz9Yr2cb1olC-x5RI9y1WNhewK_ZBnWGu8aP8ySm1qp8LhOpsJdEJJFjUg0m9cZBKlj/exec';
const thanksModal = $('#thanksModal');

function closeThanks(){
  if(!thanksModal) return;
  thanksModal.hidden = true;
  thanksModal.setAttribute('aria-hidden','true');
}

if(thanksModal){
  thanksModal.querySelectorAll('[data-close-thanks]').forEach((el)=>el.addEventListener('click', closeThanks));
}

function submitToGoogleSheet(data){
  const frameName = 'google-sheet-submit-frame';
  let frame = document.getElementById(frameName);
  if(!frame){
    frame = document.createElement('iframe');
    frame.name = frameName;
    frame.id = frameName;
    frame.title = 'Google Sheet submission';
    frame.setAttribute('aria-hidden','true');
    frame.style.display = 'none';
    document.body.appendChild(frame);
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = GOOGLE_SHEET_ENDPOINT;
  form.target = frameName;
  form.style.display = 'none';

  const fields = {
    action: 'rsvp',
    name: data.name,
    message: data.message,
    timestamp: data.savedAt,
    guestName: data.name,
    guestMessage: data.message
  };

  Object.entries(fields).forEach(([key,value])=>{
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value || '';
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  setTimeout(()=>form.remove(), 1500);
}

$('#rsvpForm').addEventListener('submit',(e)=>{
  e.preventDefault();
  const data = {
    name: $('#guestName').value.trim(),
    message: $('#guestMessage').value.trim(),
    savedAt: new Date().toISOString()
  };

  if(!data.name) return;

  // Keep a local copy as a safety net, then send to the Google Sheet.
  localStorage.setItem('wedding-rsvp-last', JSON.stringify(data));
  submitToGoogleSheet(data);

  e.target.reset();
  if(thanksModal){
    thanksModal.hidden = false;
    thanksModal.setAttribute('aria-hidden','false');
  }
});

document.addEventListener('keydown',(e)=>{ if(e.key === 'Escape') closeThanks(); });

// Music is intentionally hidden until the guest opens the invitation.
const audio = $('#music');
const audioBtn = $('#audioBtn');
audioBtn.addEventListener('click', async()=>{
  if(audio.paused){ await audio.play(); audioBtn.textContent='❚❚'; }
  else {audio.pause(); audioBtn.textContent='♫';}
});
