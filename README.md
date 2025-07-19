# play-editor

play-editor is a web frontend for a DMX lighting control system,
designed for live stage performances or for ambient lights in a home setup.

This React web app is designed to work in tandem with
[play](https://github.com/mholzen/play), which provides a server responsible for
interfacing with the DMX controller.  The app will retrieve the definition of
controls (toggles, dials, selectors, etc...), render their current state, and
allow the user to control the DMX signals sent.

It also serves as an opportunity for me to continue to refine my software
engineering skills.

## Quick start

### Dependencies

- nodejs, version 23.11.0 or later
- the play DMX server, running at [http://localhost:1300](http://localhost:1300)

### Development mode

Runs the app in the development mode.

```bash
brew install node
make run
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
