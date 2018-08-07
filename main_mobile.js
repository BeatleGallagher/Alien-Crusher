enchant();

window.onload = ()=>{

    var game = new Game(screen.width,screen.height);
    game.preload('graphic.png','start.png','end.png','alien-smasher-bg.jpg','effect0.png','bomb2.wav','se1.wav','se2.wav','se3.wav','se5.wav','jingle01.wav','bar.png','bgm06.wav');
    game.fps = 30;
    var score,randomNumber;
    randomNumber = Math.floor(Math.random() * 1000);
    score = 0;
    
//ALIEN CLASS
Alien = Class.create(Sprite,{
    initialize:function(posX,posY,frame,size){
        Sprite.call(this,16,15);
        this.image = game.assets['graphic.png'];
        this.x = posX;
        this.y = posY;
        this.scaleX = size;
        this.scaleY = size;
        this.frame = frame;
        game.rootScene.addChild(this);
        this.addEventListener(Event.TOUCH_START,this.handleTouchControl);
        this.addEventListener(Event.TOUCH_START,this.explodeAnimation);
       
    },
     handleTouchControl:function(){   
        game.rootScene.removeChild(this); 
        score++;
       
        scoreLabel.text =  "Aliens Crushed: " + score;
        scoreLabel.font = "18px  monospace";
        scoreLabel.color = "red";
        game.rootScene.addChild(scoreLabel);

        randomNumber = Math.floor(Math.random() * screen.width);
    
    },
    explodeAnimation:function(){
            var explosion = new Sprite(16,16);
            explosion.image = game.assets['effect0.png'];
            explosion.x = this.x;
            explosion.y = this.y;
            explosion.scaleX = 2;
            explosion.scaleY = 2;
            explosion.frame = [0,1,2,3,-1,,,];
            game.rootScene.addChild(explosion);
            game.assets['bomb2.wav'].play();
            game.rootScene.tl.delay(5).then(function(){
                game.rootScene.removeChild(explosion);
            }); 
    }
});

AlienAttacker = Class.create(Sprite,{
    initialize:function(posX,posY,frame,size){
        Sprite.call(this,16,15);
        this.image = game.assets['graphic.png'];
        this.x = posX;
        this.y = posY;
        this.scaleX = size;
        this.scaleY = size;
        this.frame = frame;
        game.rootScene.addChild(this);
        this.addEventListener(Event.TOUCH_START,this.handleTouchControl);
        this.addEventListener(Event.TOUCH_START,this.explodeAnimation);
       
    },
     handleTouchControl:function(){   
        game.rootScene.removeChild(this); 
        score++;
       
        scoreLabel.text =  "Aliens Destroyed: " + score;
        scoreLabel.font = "18px  monospace";
        scoreLabel.color = "red";
        game.rootScene.addChild(scoreLabel);

        randomNumber = Math.floor(Math.random() * screen.width);
    
    },
    explodeAnimation:function(){
            var explosion = new Sprite(16,16);
            explosion.image = game.assets['effect0.png'];
            explosion.x = this.x;
            explosion.y = this.y;
            explosion.scaleX = 2;
            explosion.scaleY = 2;
            explosion.frame = [0,1,2,3,4,-1,,,,];
            game.rootScene.addChild(explosion);
            game.assets['bomb2.wav'].play();
            game.rootScene.tl.delay(5).then(function(){
            game.rootScene.removeChild(explosion);
        }); 
    },
    onenterframe:function(){
        if(this.within(powerBar,32)){  
            game.assets['se3.wav'].play();
            powerBar.scaleX-=30;
        }
    }
});
//POWERBLOCK CLASS TO KEEP POWER UP WHEN CLICKED
powerBlock = Class.create(Sprite,{
    initialize:function(posX,posY){   
        Sprite.call(this,16,16);
        this.image = game.assets['graphic.png'];
        this.frame = 8;
        this.x = posX;
        this.y = posY;
        this.scaleX = 2.5;
        this.scaleY = 2.5;
        this.addEventListener(Event.TOUCH_START,this.powerUp);  
    },
    powerUp:function(){  
        this.image = game.assets['graphic.png'];
        this.frame = 8;
        this.scaleX = 2.5;
        this.scaleY = 2.5;  
        game.rootScene.addChild(this);
        game.assets['se1.wav'].play();
        game.rootScene.removeChild(powerBlock);
        
        powerBar.scaleX = 250;
    }
}); 

//POWERBAR THAT INDICATES YOUR ENERGY LEVEL 
powerBar = Class.create(Sprite,{
    initialize:function(){
        Sprite.call(this,1,16);
        this.image = game.assets['bar.png'];
        this.frame = 0;
        this.scaleX = 250;
        this.scaleY = 1;
        this.x = screen.width / 2;
        this.y = screen.height - 35;
        game.rootScene.addChild(this);    
    },
    onenterframe:function(){
        
       //SPEEDS UP THE RUNNING DOWN OF THE POWERBAR
        if(score <= 100){
            this.scaleX--;
        }  else if(score  > 100 && score < 130){
            this.scaleX-=2;
        } else if(score > 130 && score < 150){
            this.scaleX-=3;
        } else{
            this.scaleX-=4;
        }

        if(this.scaleX <= -1){
            game.rootScene.removeChild(this);
            game.assets['bgm06.wav'].play();
            gameOver = new GameOverScene();
            game.pushScene(gameOver);
        }

        if(this.scaleX <= 125){    
            game.rootScene.addChild(powerBlock); 
        } 
         
    }
 }); 

BackGround = Class.create(Sprite,{
    initialize:function(){
        Sprite.call(this,game.width,game.height);
        this.image = game.assets['alien-smasher-bg.jpg'];
        this.width = game.width;
        this.height = game.height;
        game.rootScene.addChild(this);
    }
});



//START SCENE - THE FIRST SCENE THAT LOADS UP IN THE BROWSER
StartScene = Class.create(Scene,{
    initialize:function(){
        game.assets['jingle01.wav'].play();
        game.rootScene.backgroundColor = "black";
        Scene.apply(this);
        startImage = new Sprite(236,48);
        startImage.image = game.assets['start.png'];
        startImage.x = (screen.width / 2) - (startImage.width / 2);
        startImage.y = (screen.height / 2) - (startImage.height / 2);
        startImage.addEventListener(Event.TOUCH_START,this.loadLevel_1);
        this.addChild(startImage);

        //GAME TITLE
        gameName = new Label();
        gameName.width = screen.width;
        gameName.y = screen.height / 2 - (startImage.height * 3);
        gameName.color = "white";
        gameName.font = "40px monospace";
        gameName.textAlign = "center";
        gameName.text = "ALIEN CRUSHER";
        this.addChild(gameName);

        //GAME TITLE SLOGAN
        gameNameSlogan = new Label();
        gameNameSlogan.width = screen.width;
        gameNameSlogan.y = screen.height / 6;
        gameNameSlogan.color = "white";
        gameNameSlogan.font = "20px monospace";
        gameNameSlogan.textAlign = "center";
        gameNameSlogan.text = "Get ready to be infested!";
        this.addChild(gameNameSlogan);

        //START SPRITE IMAGE
        startLabel = new Label();
        startLabel.width = screen.width;
        startLabel.y = screen.height / 2 + startImage.height;
        startLabel.color = "white";
        startLabel.font = "16px monospace";
        startLabel.textAlign = "center";
        startLabel.text = "Click on START to play.";
        game.rootScene.addChild(startLabel);
        this.addChild(startLabel);
    },
    loadLevel_1:function(){
       game.popScene(StartScene);
       LevelOneScene = new LevelOneScene();
       game.pushScene(LevelOneScene);
    }
});

//THE GAME LEVEL WHERE ALL GAME PLAY TAKES PLACE
LevelOneScene = Class.create(Scene,{
    initialize:function(){
        //ALIENS THAT ATTACK YOUR POWERBAR
        game.rootScene.on("enterframe",function(){  
            if(game.frame === 1000){
                game.assets['se5.wav'].play();
                alien5 = new AlienAttacker(screen.width ,screen.height - 50,6,3);
                alien5.tl.moveTo(screen.width / 2,screen.height - 100,20).rotateBy(360,5).moveTo(screen.width / 2,screen.height - 65,5).loop();      
            } 
            if(game.frame === 2500){
                game.assets['se5.wav'].play();
                alien6 = new AlienAttacker(screen.width ,screen.height - 50,6,3);
                alien6.tl.moveTo(screen.width / 2,screen.height - 100,20).rotateBy(360,5).moveTo(screen.width / 2,screen.height - 65,5).loop();      
            } 
            if(game.frame === 3500){
                game.assets['se5.wav'].play();
                alien6 = new AlienAttacker(screen.width ,screen.height - 50,6,3);
                alien6.tl.moveTo(screen.width / 2,screen.height - 100,20).rotateBy(360,5).moveTo(screen.width / 2,screen.height - 65,5).loop();      
            } 
            if(game.frame === 4000){
                game.assets['se5.wav'].play();
                alien6 = new AlienAttacker(screen.width ,screen.height - 50,6,3);
                alien6.tl.moveTo(screen.width / 2,screen.height - 100,20).rotateBy(360,5).moveTo(screen.width / 2,screen.height - 65,5).loop();      
            } 
        });

        Bg = new BackGround();
      
        //CREATES SCORE LABEL
        scoreLabel = new Label();
        scoreLabel.x = 5;
        scoreLabel.y = 5;
        scoreLabel.text =  "Aliens Crushed: " + score;
        scoreLabel.font = "18px monospace";
        scoreLabel.color = "red";
        game.rootScene.addChild(scoreLabel);

        //CREATES POWERBAR LABEL
        energyLabel = new Label();
        energyLabel.x = (screen.width / 2) - 35;
        energyLabel.y = screen.height - 18;
        energyLabel.width = 100;
        energyLabel.text = "Energy Bar";
        energyLabel.font = "14px  monospace";
        energyLabel.color = "yellow";
        game.rootScene.addChild(energyLabel);

        //INSTANTIATING INSTANCES OF THE DIFFERENT CLASSES CREATED
        powerBar = new powerBar();
        powerBlock = new powerBlock((screen.width / 2) - 8,(screen.height / 2) - 8);
        alien = new Alien(screen.width / 2,0,3,1.3);
        alien.tl.moveTo(100,200,10).rotateBy(360,10).scaleTo(3,10).scaleTo(0.5,10).moveBy(100,50,100).moveTo(200,400,10).rotateBy(360,10).scaleTo(3,10).scaleTo(0.5,10).moveBy(50,50,100).loop();

        //CREATE RANDOM SPAWNING ALIENS AT SET TIME INTERVALS
        setInterval(function(){
            randomNumber1 = Math.floor(Math.random() * 500);
            alien = new Alien(-30,randomNumber1,3,1.5);
            alien.tl.moveTo(randomNumber1,screen.height - randomNumber1,100).and().rotateBy(360,100).moveTo(randomNumber1,50,100).rotateBy(270,100).moveTo(randomNumber1,randomNumber1,100).loop();    
        },2000);
        setInterval(function(){
            randomNumber2 = Math.floor(Math.random() * 500);
            alien2 = new Alien(-30,randomNumber2,4,1);
            alien2.tl.moveTo(randomNumber2,randomNumber2,300).and().rotateBy(360,50).moveTo(screen.width / 2,50,300).loop();    
        },5000);
        setInterval(function(){
            randomNumber3 = Math.floor(Math.random() * 500);
            alien3 = new Alien(randomNumber3,-30,5,2.6);
            alien3.tl.moveTo(screen.width / 2,randomNumber3,100).and().rotateBy(360,50).moveTo(screen.width / 2,50,100).loop();    
        },7500);
        setInterval(function(){
            randomNumber4 = Math.floor(Math.random() * 500);
            alien4 = new Alien(randomNumber4,-30,6,1);
            alien4.tl.moveTo(screen.width / 2,randomNumber4,300).and().rotateBy(360,50).moveTo(screen.width / 2,50,300).moveTo(screen.width / 2,screen.height - 50,300).moveBy(randomNumber,50,50).loop();        
        },10000);
        
    }
    
});
//THE GAME OVER SCENE IF YOUR ENERGY BAR RUNS OUT
GameOverScene = Class.create(Scene,{
    initialize:function(){
       
        Scene.apply(this);
        gameOverImage = new Sprite(189,97);
        gameOverImage.x = (game.width / 2) - 94.5;
        gameOverImage.y = (game.height / 2) - 43.5;
        gameOverImage.image = game.assets['end.png'];
        this.addChild(gameOverImage);
        gameOverImage.addEventListener(Event.TOUCH_START,this.reload);

        gameOverLabel = new Label();
       
        gameOverLabel.width = screen.width;
        gameOverLabel.y = screen.height / 2 - 70;
        gameOverLabel.color = "white";
        gameOverLabel.font = "20px monospace";
        gameOverLabel.textAlign = "center";
        gameOverLabel.text = "Click on GAME OVER to play again.";
        game.rootScene.addChild(gameOverLabel);
        alert("YOUR DEVICE HAS BEEN INFESTED PUNY HUMAN! WHU HA HAA!");
    },
    reload:function(){
        location.reload(); 
    }
}); 

game.onload = ()=>{ 
 
    StartScene = new StartScene();
    game.pushScene(StartScene);

    }
    game.start();
}

