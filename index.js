const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width= 1024
canvas.height= 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7


//background object
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './Fighting Game Assets/background.png'

})

//shop object
const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './Fighting Game Assets/shop.png',
    scale: 2.75,
    framesMax: 6

})


//Player Object
const player = new Fighter({
   position: {
    x:0,
    y:0
},
velocity :{
    x:0,
    y:0
},
offset : {
    x:0,
    y:0
},
imageSrc : './Fighting Game Assets/samuraiMack/idle.png',
framesMax: 8,
scale: 2.5,
offset: {
    x: 215,
    y: 157
},
sprites : {
    //idle sprite
    idle : {
        imageSrc: './Fighting Game Assets/samuraiMack/idle.png',
        framesMax: 8
    },
    //run sprite
    run : {
            imageSrc: './Fighting Game Assets/samuraiMack/Run.png',
            framesMax: 8
    },
    jump : {
        imageSrc: './Fighting Game Assets/samuraiMack/Jump.png',
        framesMax: 2
},
    fall : {
        imageSrc: './Fighting Game Assets/samuraiMack/Fall.png',
        framesMax: 2
    },
    attack1 : {
        imageSrc: './Fighting Game Assets/samuraiMack/Attack1.png',
        framesMax: 6
    },
    takeHit : {
        imageSrc: './Fighting Game Assets/samuraiMack/Take Hit - white silhouette.png',
        framesMax: 4
    },
    death : {
        imageSrc: './Fighting Game Assets/samuraiMack/Death.png',
        framesMax: 6
    }
},
    attackBox: {
        offset: {
            x:100,
            y:50
    },
        width: 150,
        height: 50
}
})

//Enemy Object
const enemy = new Fighter({
    position: {
     x:400,
     y:100
 },
 velocity :{
     x:0,
     y:0
 },
 color: 'blue',
 offset : {
    x:-50,
    y:0
},
imageSrc : './Fighting Game Assets/kenji/idle.png',
framesMax: 4,
scale: 2.5,
offset: {
    x: 215,
    y: 167
},
sprites : {
    //idle sprite
    idle : {
        imageSrc: './Fighting Game Assets/kenji/Idle.png',
        framesMax: 4
    },
    //run sprite
    run : {
            imageSrc: './Fighting Game Assets/kenji/Run.png',
            framesMax: 8
    },
    jump : {
        imageSrc: './Fighting Game Assets/kenji/Jump.png',
        framesMax: 2
},
    fall : {
        imageSrc: './Fighting Game Assets/kenji/Fall.png',
        framesMax: 2
    },
    attack1 : {
        imageSrc: './Fighting Game Assets/kenji/Attack1.png',
        framesMax: 4
    },
    takeHit: {
        imageSrc: './Fighting Game Assets/kenji/Take hit.png',
        framesMax: 3
    },
    death: {
        imageSrc: './Fighting Game Assets/kenji/Death.png',
        framesMax: 7
    }

},
attackBox: {
    offset: {
        x:-170,
        y:50,
    },
    width: 170,
    height: 50
}
 })


console.log(player)

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

//animation Function
function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle ='black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if(keys.a.pressed && player.lastkey ==='a') {
        player.velocity.x =-5
        player.switchSprite('run')
    }else if (keys.d.pressed && player.lastkey ==='d') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }
    //jumping
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    //enemy movement
    if(keys.ArrowLeft.pressed && enemy.lastkey ==='ArrowLeft') {
        enemy.velocity.x =-5
        enemy.switchSprite('run')
    }else if (keys.ArrowRight.pressed && enemy.lastkey ==='ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
        }else {
            enemy.switchSprite('idle')
        }
    //jumping
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }
       
    //detect for collision & enemy gets hit
    if ( rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) &&
        player.isAttacking && player.frameCurrent === 4
    ){
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyhealth', {
            width: enemy.health + '%'
        })
    }

    //if player misses
    if(player.isAttacking && player.frameCurrent === 4 ){
        player.isAttacking = false
    }

    //this is where our player gets hit
    if ( rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) &&
        enemy.isAttacking &&
        enemy.frameCurrent === 2
    ){
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerhealth', {
            width: player.health + '%'
        })
    }
    //if enemy misses
    if(enemy.isAttacking && enemy.frameCurrent === 2 ){
        enemy.isAttacking = false
    }
    //end game based on health
    if (enemy.health <= 0 || player.health <= 0){
        determineWinner({player, enemy, timerId})
    }
}

//infinite animation loop
animate()

//keydown
window.addEventListener('keydown', (event)=>{
    switch(event.key) {
        //player keys
        case 'd' :
            keys.d.pressed = true
            player.lastkey ='d'
            break
        case 'a' :
           keys.a.pressed = true
           player.lastkey = 'a'
            break
        case 'w' :
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break

        //enemy keys
        case 'ArrowRight' :
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp' :
            enemy.velocity.y = -20
            break
        case 'ArrowDown' :
            enemy.attack()
            break
        
    }
})

//keyup
window.addEventListener('keyup', (event)=>{
    switch(event.key) {
        //player keys
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :
            keys.a.pressed = false
            break


        //enemy keys
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break

    }
})