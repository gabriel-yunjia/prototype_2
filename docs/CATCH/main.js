title = "CATCH";

description = `
[Move] Move Cursor To Move Pan
`;

characters = [`
   p|====/


`];

options = {
  theme: "simple",
  viewSize: { x: 300, y: 300 },
  isPlayingBgm: true,
  isReplayEnabled: true,
};

/** @type {{ pos: Vector, char: number }} */
let player;
let speed;
let strikes;
let foods;
let bombs;
let colors;

function update() {
  // Initialize game elements
  if (!ticks) {
    player = { pos: vec(150, 200), char: 0 };
    speed = 5;
    strikes = 0;
    foods = [];
    bombs = [];
  }

  // Draw boundaries
  color("yellow");
  rect(0, 0, 7, 300);
  rect(293, 0, 7, 300);


  // Draw player character
  color("black");
  char(characters[player.char], player.pos);

  switch(strikes){
    case 0:
    colors = "green"
    break;
    case 1:
    colors = "yellow"
    break;
    case 2:
    colors = "red"
    break;
  }
  
  color(colors);
  let playerCollider = box(player.pos.x + 40,player.pos.y, 50,10); // Adjust the size as needed

  // Move player automatically
  player.pos.x = clamp(input.pos.x-35, -10, 230);

  

  // Generate food
  if (rnd() < 0.02) {
    foods.push({
      pos: vec(rnd(7, 293), 0),
      speed: rnd(1, 3),
    });
  }

  // Draw and move food
  color("purple");
  remove(foods, (food) => {
    food.pos.y += food.speed;

    // Check collision with player
    if (box(food.pos, 1).isColliding.rect.green || box(food.pos, 1).isColliding.rect.yellow || box(food.pos, 1).isColliding.rect.red) {
      play("coin");
      addScore(2);
      return true; // Remove the collided food only
    }

    // Check if food missed
    if (food.pos.y > 300) {
      play("hit");
      addScore(-1);
      return true;
    }

    // Draw food
    
    box(food.pos, 9);
    return false;
  });


    // Generate BOMBS
  if (rnd() < 0.01) {
      bombs.push({
        pos: vec(rnd(7, 293), 0),
        speed: rnd(1, 3),
      });
    }
  
    // Draw and move food
    color("black");
    remove(bombs, (bomb) => {
      bomb.pos.y += bomb.speed;
  
      // Check collision with player
      if (box(bomb.pos, 1).isColliding.rect.green || box(bomb.pos, 1).isColliding.rect.yellow || box(bomb.pos, 1).isColliding.rect.red ) {
        play("explosion");
        strikes++;
        return true;
      }
  
      // Check if food missed
      if (bomb.pos.y > 300) {

        return true;
      }
  
      // Draw food
      
      box(bomb.pos, 8);
      return false;
    });


  // Check game over conditions
  if (strikes >= 3) {
    play("hit");
    end();
  }
  


}
