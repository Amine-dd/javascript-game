const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/background.png',
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  frameMax: 6,
});

const player = new Fighter({
  position: {
    x: 50,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/samuraiMack/Idle.png',
  frameMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      frameMax: 8,
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      frameMax: 8,
    },

    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      frameMax: 2,
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      frameMax: 2,
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      frameMax: 6,
    },
    takeHit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      frameMax: 4,
    },
    death: {
      imageSrc: './img/samuraiMack/Death.png',
      frameMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 900,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: './img/kenji/Idle.png',
  frameMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      frameMax: 4,
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      frameMax: 8,
    },

    jump: {
      imageSrc: './img/kenji/Jump.png',
      frameMax: 2,
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      frameMax: 2,
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      frameMax: 4,
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      frameMax: 3,
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      frameMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

console.log(player);
const keys = {
  q: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  z: {
    pressed: false,
  },
  k: {
    pressed: false,
  },
  m: {
    pressed: false,
  },
  o: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255,255,255,0.1)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player movement
  if (keys.q.pressed && player.lastKey === 'q') {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }
  //enemy movement
  if (keys.k.pressed && enemy.lastKey === 'k') {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.m.pressed && enemy.lastKey === 'm') {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  //detect for collison && enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    //document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    gsap.to('#enemyHealth', {
      width: enemy.health + '%',
    });
  }
  //if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }
  //this is where a player gets hit

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    //document.querySelector('#playerHealth').style.width = player.health + '%';
    gsap.to('#playerHealth', {
      width: player.health + '%',
    });
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  //end the game based on health
  if (enemy.health === 0 || player.health === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'q':
        keys.q.pressed = true;
        player.lastKey = 'q';
        break;
      case 'z':
        player.velocity.y = -20;
        break;
      case 'e':
        player.attack();
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      case 'm':
        keys.m.pressed = true;
        enemy.lastKey = 'm';
        break;
      case 'k':
        keys.k.pressed = true;
        enemy.lastKey = 'k';
        break;
      case 'o':
        enemy.velocity.y = -20;
        break;
      case 'p':
        enemy.attack();
    }
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'q':
      keys.q.pressed = false;
      break;
    case 'z':
      keys.z.pressed = false;
      break;
  }
  //enemy keys

  switch (event.key) {
    case 'm':
      keys.m.pressed = false;
      break;
    case 'k':
      keys.k.pressed = false;
      break;
    case 'o':
      keys.o.pressed = false;
      break;
  }
});
