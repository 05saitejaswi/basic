# Monitor Issue

A practice project - a single-page clone of a Jira-style issue detail view, built with plain HTML, CSS, and JavaScript. Made to work on flexbox/grid layout, CSS custom properties, and vanilla DOM scripting.
clubbing reused propeties in css


**Top nav**
- Collapsible sidebar toggle
- Live search box that highlights matching text on the page as you type
- Help menu dropdown with a couple of external links
- Light/dark theme toggle (swaps a `data-theme` attribute, which flips a set of CSS variables)

**Sidebar**
- Static nav list (For you, Recent, Starred, Apps, Plans, Spaces)
- "Recent" opens a popup panel with a search box and a recent-items list

**Issue view**
- Title, summary, description, expected/actual result fields
- Comment box - post a comment (renders as a card with name/timestamp) or delete one
- Status dropdown (To Do / In Progress / In Review / Done) that recolors the pill
- Details panel: assignee, labels (add/edit/remove/dedupe as chips), team, sprint, reporter, etc.
- Collapsible "Development" section

**Create issue modal**
- Full form: space, work type, summary, description, assignee, reporter, priority, labels, team, start date
- Reporter field is a hand-built search/autocomplete (not a native `<select>`)
- Client-side validation on submit (required fields get inline error messages), then a toast confirms creation
