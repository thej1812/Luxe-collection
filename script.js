// Load the character chosen from the home page
document.addEventListener("DOMContentLoaded", function() {
    // Get the selected character from localStorage
    const selectedCharacterIndex = localStorage.getItem('selectedCharacterIndex');
    const selectedCharacterSprite = localStorage.getItem('selectedCharacterSprite');
    const selectedCharacterName = localStorage.getItem('selectedCharacterName');
    
    // Update the character name display
    const playerNameElement = document.getElementById('playerName');
    if (playerNameElement && selectedCharacterName) {
        playerNameElement.textContent = selectedCharacterName;
    }
    
    // Create and add the character spritesheet to the game
    const gameCharacter = document.querySelector(".game-character");
    if (gameCharacter && selectedCharacterSprite) {
        // Create the sprite sheet image
        const spriteSheet = document.createElement('img');
        spriteSheet.src = selectedCharacterSprite;
        spriteSheet.className = "Character_sprite-sheet PixelArtImage active";
        
        // Add to the character container
        gameCharacter.appendChild(spriteSheet);
    }
});

// Set up controls for the game character
document.addEventListener("DOMContentLoaded", function() {
    const gameCharacter = document.querySelector(".game-character");
    
    // Add event listeners for the direction buttons
    document.getElementById('up-button').addEventListener('click', function() {
        setCharacterDirection('UP');
    });
    
    document.getElementById('down-button').addEventListener('click', function() {
        setCharacterDirection('DOWN');
    });
    
    document.getElementById('left-button').addEventListener('click', function() {
        setCharacterDirection('LEFT');
    });
    
    document.getElementById('right-button').addEventListener('click', function() {
        setCharacterDirection('RIGHT');
    });
    
    // Function to set the character direction
    function setCharacterDirection(direction) {
        // Remove all direction classes
        gameCharacter.classList.remove("Character--walk-down");
        gameCharacter.classList.remove("Character--walk-up");
        gameCharacter.classList.remove("Character--walk-left");
        gameCharacter.classList.remove("Character--walk-right");
        
        // Add the appropriate direction class
        if (direction === "UP") {
            gameCharacter.classList.add("Character--walk-up");
        } else if (direction === "DOWN") {
            gameCharacter.classList.add("Character--walk-down");
        } else if (direction === "LEFT") {
            gameCharacter.classList.add("Character--walk-left");
        } else if (direction === "RIGHT") {
            gameCharacter.classList.add("Character--walk-right");
        }
    }
});

// Original game logic starts here
var character = document.querySelector(".character"); 
var map = document.querySelector(".map");

// Start in the middle of the map
var x = 90;
var y = 34;
var held_directions = []; // Which arrow keys are held
var speed = 1; // How fast the character moves

const placeCharacter = () => {
   var pixelSize = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--pixel-size')
   );

   const held_direction = held_directions[0];
   if (held_direction) {
      if (held_direction === directions.right) { x += speed; }
      if (held_direction === directions.left) { x -= speed; }
      if (held_direction === directions.down) { y += speed; }
      if (held_direction === directions.up) { y -= speed; }
      character.setAttribute("facing", held_direction);
   }
   character.setAttribute("walking", held_direction ? "true" : "false");

   // Wall limits
   var leftLimit = -8;
   var rightLimit = (16 * 11) + 8;
   var topLimit = -8 + 32;
   var bottomLimit = (16 * 7);
   if (x < leftLimit) { x = leftLimit; }
   if (x > rightLimit) { x = rightLimit; }
   if (y < topLimit) { y = topLimit; }
   if (y > bottomLimit) { y = bottomLimit; }

   var camera_left = pixelSize * 66;
   var camera_top = pixelSize * 42;

   map.style.transform = `translate3d(${-x * pixelSize + camera_left}px, ${-y * pixelSize + camera_top}px, 0)`;
   character.style.transform = `translate3d(${x * pixelSize}px, ${y * pixelSize}px, 0)`;  
}

// Start the game loop
const step = () => {
   placeCharacter();
   window.requestAnimationFrame(() => {
      step();
   });
}
step(); // Start the first step


/* Direction key state */
const directions = {
   up: "up",
   down: "down",
   left: "left",
   right: "right",
}
const keys = {
   38: directions.up,
   37: directions.left,
   39: directions.right,
   40: directions.down,
}
document.addEventListener("keydown", (e) => {
   var dir = keys[e.which];
   if (dir && held_directions.indexOf(dir) === -1) {
      held_directions.unshift(dir);
   }
});

document.addEventListener("keyup", (e) => {
   var dir = keys[e.which];
   var index = held_directions.indexOf(dir);
   if (index > -1) {
      held_directions.splice(index, 1);
   }
});

// NEW FEATURE: Press "A" key to place character on the map
document.addEventListener("keydown", (e) => {
   if (e.key === "a" || e.key === "A") {
      // Add character to map if not already there
      if (!map.contains(character)) {
         map.appendChild(character);
      }

      // Reset to starting position
      x = 90;
      y = 34;

      // Update position
      placeCharacter();
   }
});


/* BONUS! Dpad functionality for mouse and touch */
var isPressed = false;
const removePressedAll = () => {
   document.querySelectorAll(".dpad-button").forEach(d => {
      d.classList.remove("pressed");
   });
}
document.body.addEventListener("mousedown", () => {
   isPressed = true;
});
document.body.addEventListener("mouseup", () => {
   isPressed = false;
   held_directions = [];
   removePressedAll();
});
const handleDpadPress = (direction, click) => {   
   if (click) {
      isPressed = true;
   }
   held_directions = (isPressed) ? [direction] : [];

   if (isPressed) {
      removePressedAll();
      document.querySelector(".dpad-" + direction).classList.add("pressed");
   }
}
// Bind events for dpad
document.querySelector(".dpad-left").addEventListener("touchstart", (e) => handleDpadPress(directions.left, true));
document.querySelector(".dpad-up").addEventListener("touchstart", (e) => handleDpadPress(directions.up, true));
document.querySelector(".dpad-right").addEventListener("touchstart", (e) => handleDpadPress(directions.right, true));
document.querySelector(".dpad-down").addEventListener("touchstart", (e) => handleDpadPress(directions.down, true));

document.querySelector(".dpad-left").addEventListener("mousedown", (e) => handleDpadPress(directions.left, true));
document.querySelector(".dpad-up").addEventListener("mousedown", (e) => handleDpadPress(directions.up, true));
document.querySelector(".dpad-right").addEventListener("mousedown", (e) => handleDpadPress(directions.right, true));
document.querySelector(".dpad-down").addEventListener("mousedown", (e) => handleDpadPress(directions.down, true));

document.querySelector(".dpad-left").addEventListener("mouseover", (e) => handleDpadPress(directions.left));
document.querySelector(".dpad-up").addEventListener("mouseover", (e) => handleDpadPress(directions.up));
document.querySelector(".dpad-right").addEventListener("mouseover", (e) => handleDpadPress(directions.right));
document.querySelector(".dpad-down").addEventListener("mouseover", (e) => handleDpadPress(directions.down));
