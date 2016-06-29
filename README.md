
Callback madness

## TODO

* Canvas

  + DONE Can we shift the origin?
  + DONE Use light/dark versions
  + DONE Pixel decode
  + DONE Callbacks
  + DONE Match to window size
  + DONE Re-draw on window resize
  + DONE Add central buttons
  + DONE Rename drawNoteButton, and DRY

  + TODO De-pixelate switch label text?
  + TODO Use brighter green? (Put boardColors into separate file)


* Logic

  + DONE Extent click decoder to cope with all buttons
  + DONE Handlers to make all buttons light up
    - DONE Notes on mouse down/up (put a "depressed" field into State)
    - DONE Swithches toggle on click
    - DOME Tidy switch re-rendering - border and text (make separate function to draw Button trim which does black ring and text)
  + Add sounds

* Code

 + TODO Document all modules - how to make module documentation not merge with first function?
 + DONE Sort out packaging/webpack etc

From [Wikipedia](https://en.wikipedia.org/wiki/Simon_(game)), Notes are

E-note (blue, lower right);  329.628  (was 659.255)
C-sharp-note (yellow, lower left); 277.183 (was 554.365)
A-note (red, upper right). 440
E-note (green, upper left, an octave lower than blue); 164.814 (was 329.628)
