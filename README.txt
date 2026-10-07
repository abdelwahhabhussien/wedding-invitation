WEDDING INVITATION — FINAL

1) Open index.html directly for a local preview, or upload the whole folder to your hosting.
2) The live version is intended to be served over HTTPS/HTTP.

CURRENT DETAILS
- Groom: عبدالرحمن
- Bride: هبه
- Date: الخميس 12 نوفمبر 2026
- Time: 6:30 مساءً
- Venue: Lumira دار الإشارة

OPENING
The song starts when the guest presses "افتح الدعوة / Open Invitation".
The music control appears after opening and can pause/resume the song.

HERO BACKGROUND
images/site-bg.jpg is the supplied nostalgic wedding collage background.
The central invitation card is kept on top so the names/date remain editable.

MUSIC
images/audio/song.mp3 is the supplied song.

GUEST MESSAGES
The RSVP form submits to the Google Apps Script endpoint configured in js/app.js.
It sends the guest name and message using a normal POST form submission, which avoids CORS issues on a static hosted site.
See ../GOOGLE_APPS_SCRIPT.txt for the Apps Script code/deployment settings.

If you replace the Apps Script deployment URL, update GOOGLE_SHEET_ENDPOINT in js/app.js.


V9 FIXES:
- Hero keeps the moving/floating childhood photos outside the card.
- The supplied nostalgic artwork is used only as a softened parchment texture inside the center hero card.
- H & A monograms are locked to one clean horizontal line in both the opening seal and hero badge.
- The YES message keeps the exact emojis: 😂❤️🔥.
- Google Sheet setup was corrected for standalone Apps Script projects using SpreadsheetApp.openById; see ../GOOGLE_APPS_SCRIPT.txt.
