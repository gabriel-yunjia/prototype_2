title = "prototype";

description = `
[Hold]
choose direction
`;

characters = [];

options = {
  theme: "simple",
  viewSize: {x:300, y:300},
};

///** @type {Vector} */
let player;
//let playerCollision;
let speed;
let velocity
let angle;
let enemies;
let itemTime;
let items;
let num;
// // let items;

function update() {

  // init the pos of player
  if (!ticks) {
    player = vec(150, 285);
    angle = 0;
    speed = 2;
    velocity = vec(0,-1 * speed);
    enemies = [];
    items = [];
    itemTime = 0;
    num = 2;
  }

  // draw boundaries
  color("light_yellow");
  rect(0, 0, 300, 7);
  rect(0, 0, 7, 300);
  rect(0, 293, 300, 7);
  rect(293, 0, 7, 300);

  // draw the player object
  color("green");
  box(player,7);
  //playerCollision = box(player,7);

  // make the player move
  player.add(velocity);

  // Bounce back when hitting the top boundary
  if (player.y < 7) {
    player.y = 7;
    velocity.y *= -1;
  }

  // Bounce back when hitting the left boundary
  if (player.x < 7) {
    player.x = 7;
    velocity.x *= -1;
  }

  // Bounce back when hitting the bottom boundary
  if (player.y > 293) {
    player.y = 293;
    velocity.y *= -1;
  }

  // Bounce back when hitting the right boundary
  if (player.x > 293) {
    player.x = 293;
    velocity.x *= -1;
  }

  // choose direction
  if (input.isPressed) {
    color("light_black");
    bar(player, 20, 3, (angle -= 0.08), 0);
  }

  // move slower when choosing direction
  if (input.isJustPressed) {
    velocity.x *= 0.4;
    velocity.y *= 0.4;
  }

  // change direction
  if (input.isJustReleased) {
    velocity = vec(speed * Math.cos(angle), speed * Math.sin(angle));
  }

  // update enemies
  updateEnemies();

  updateItems();
}

function updateEnemies() {
  // generate enemies
  if (rnd() < 0.007) {
    enemies.push({
      pos: vec(rnd(7, 293), rnd(7, 293)),
      direction: vec(rnd(0.5, 0.8) * speed * Math.cos(rnd(0, 2 * Math.PI)), rnd(0.5, 0.8) * speed * Math.sin(rnd(0, 2 * Math.PI))),
    });
    //enemies.push(vec(rnd(7, 293), rnd(7, 293)));
    //enemy.add(velocity);
  }
  color("red");

  // make the enemy move
  enemies.forEach((enemy) => {
    //box(enemy.pos,7);
    enemy.pos.add(enemy.direction);

    // Bounce back when hitting the top boundary
    if (enemy.pos.y < 7) {
      enemy.pos.y = 7;
      enemy.direction.y *= -1;
    }

    // Bounce back when hitting the left boundary
    if (enemy.pos.x < 7) {
      enemy.pos.x = 7;
      enemy.direction.x *= -1;
    }

    // Bounce back when hitting the bottom boundary
    if (enemy.pos.y > 293) {
      enemy.pos.y = 293;
      enemy.direction.y *= -1;
    }

    // Bounce back when hitting the right boundary
    if (enemy.pos.x > 293) {
      enemy.pos.x = 293;
      enemy.direction.x *= -1;
    }

    // check collision
    if (box(enemy.pos,7).isColliding.rect.green) {
      end();
    }
  });

}

function updateItems() {
  // generate items every 10 seconds
  color("light_blue");
  if (itemTime >= 600) {
    items.push({
      pos: vec(rnd(7, 293), rnd(7, 293)),
      collide: false,
    });
    itemTime = 0;
  } else {
    itemTime ++;
  }
  
  // collect the item
  remove(items, (item) => {
    if (box(item.pos,15).isColliding.rect.green) {
      num = 4;
      remove(enemies, (enemy) => {
        num --;
        return num > 0;
      });
    }
    return box(item.pos,15).isColliding.rect.green;
  });
}