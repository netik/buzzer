Last update 5/29/2020

* Support multi-tenant use...  (p3)

  - room key
  - room title
  - room key generation
  - change title
  - change logo
     - file upload

* Add authenticated sessions and passwords (p1)

* Add a database (p2)

* Lock down the host panel! (p1)

* Lock down cheating via sessions (p1)

* Ability to send a buzzer to everyone from the host panel (small lift)

* Jeopardy boop boop boop sound

* Countdown beep in last 5 seconds

* Animations (tbd)

* Give Host ability to change people's names and other data

* Keyboard shortcuts from our hardware game:

   helpstr = [ { "key": "SPACE", "text": "Stop/Start clock" }, 
                { "key": "SHIFT-ESC" , "text": "Quit" },
                { "key": "H or ?" , "text": "HELP" },         (implement as modal)
                { "key": "1" , "text": "+1 point Player 1" }, (probably can't do this)
                { "key": "2" , "text": "+1 point Player 2" },
                { "key": "3" , "text": "+1 point Player 3" },
                { "key": "4" , "text": "+1 point Player 4" },
                { "key": "Q" , "text": "-1 point Player 1" },
                { "key": "W" , "text": "-1 point Player 2" },
                { "key": "E" , "text": "-1 point Player 3" },
                { "key": "R" , "text": "-1 point Player 4" },
                { "key": "P" , "text": "Clock: +5 seconds" },
                { "key": "L" , "text": "Clock: -5 seconds" },
                { "key": "T" , "text": "Play a \"time's up\" sound" },
                { "key": "B" , "text": "Play a buzzer sound" },
                { "key": "N" , "text": "Name Players" },
                { "key": "S" , "text": "Draw Splash Screen" },
                { "key": "SHIFT-A" , "text": "Reset game" },
                { "key": "SHIFT-Z" , "text": "Reset Clock" },
