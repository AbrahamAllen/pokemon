function random(low, high){
		return Math.round(Math.random()*(high-low))+low;
}

function write(txt, add=false){
	div = document.getElementById('battleText');
	if(add){div.innerHTML += txt}else{div.innerHTML = txt};
}


const elemList = ['fire', 'water', 'earth', 'air', 'acid', 'electric'];
const weakDict = new Object(); weakDict['fire'] = 'water, air';weakDict['water'] = 'electric, air';weakDict['earth'] = 'fire, acid'; weakDict['air'] = 'earth, electric '; weakDict['acid'] = 'water'; weakDict['electric'] = 'earth, fire';
const shapeList = ['snake', 'wolf', 'horse', 'bear', 'cat'];
const mapCol = new Object();

const moveDict = new Object();
moveDict['wolf'] = ['scratch <br> /3/90', 'bite <br> /5/80', 'pounce <br> /10/70']; moveDict['snake'] = ['constrict <br> /4/90', 'bite <br> /5/80', 'swallow <br> /100/40']; moveDict['horse'] = ['kick <br> /4/90', 'bite <br> /5/80', 'charge <br> /7/80']; moveDict['bear'] = ['claw <br> /5/80', 'charge <br> /7/80', 'maul <br> /10/70']; moveDict['cat'] = ['bite <br> /5/80', 'slash <br> /7/80', 'pounce <br> /10/70'];
moveDict['fire'] = ['fireball <br> /5/90', 'flamethrower <br> /10/80']; moveDict['water'] = ['water blast <br> /4/100', 'drown <br> /50/50']; moveDict['air'] = ['air blade <br> /3/100', 'windstorm <br> /10/70']; moveDict['earth'] = ['rock throw <br> /5/90', 'earthquake <br> /10/100']; moveDict['acid'] = ['spit <br> /5/80', 'toxins <br> /30/60']; moveDict['electric'] = ['shock <br> /5/100', 'thunder <br> /10/80'];


class Monster{
	constructor(scale, elem, id, shape = shapeList[random(0, shapeList.length-1)]){
		this.id = id;
		
		this.type = new Type(elem, shape);
		this.stats = new Stats(scale, this.type.shape, this.type.elem);
		this.moves = new Object();
		
		this.moves = [];
		this.moves.push(moveDict[this.type.shape][0]);	
		if(scale > 2){this.moves.push(moveDict[this.type.shape][1])};
		if(scale > 3){this.moves.push(moveDict[this.type.elem][0])};
		if(scale > 5){this.moves.push(moveDict[this.type.shape][2])};
		if(scale > 7){this.moves.push(moveDict[this.type.elem][1])};
	}
	
	//comabt functions
	attack(move, target){
		if(target.stats.hp <= 0){write('<br>enemy killed <br> Click to continue'); return};
		let txt = move.innerText.split('/'); console.log(txt[0]); let amt = parseInt(txt[1]);

		if(random(0,100)<txt[2]){ write('<br>'+this.id+ ' used '+txt[0], true); target.damage(amt*this.stats.atk, this.type.elem)}
		else{write('<br>'+this.id +' missed', true)}
	}
	
	damage(amt, elem){
		let dmg = amt-this.stats.def;
		if(this.type.weak.includes(elem)){dmg+=dmg; write('<br> super effective', true)};
		this.stats.hp-=dmg;
		write('<br>did '+dmg+' damage', true);
		document.getElementById(this.id).innerHTML = this.stats.hp;
		if(this.stats.hp <= 0){this.kill()}
	}
	
	heal(){
		this.stats.hp = this.stats.maxhp;
	}
	
	kill(){
		write('<br>'+this.id+' killed', true);
		document.getElementById(this.id).remove();
		if(this.id == 'player'){user.party.splice(this.slot, 1); document.getElementById('playermoves').remove();if(user.party.length == 0){gameOver()}; user.party[0].build(); user.activeMonster = user.party[0]; user.slotOrg()};
		if(this.id == 'enemy'){rewards(Math.ceil(this.stats.lvl/2)); user.enemy = false};
		if(this.id == 'boss'){rewards(this.stats.lvl); user.enemy = false};
		
		console.log(user.party);
	}
	
	expUp(amt){
		this.stats.exp+=amt;
		if(this.stats.exp >= 5*this.stats.lvl){this.levelUp(); this.stats.exp = 0};
	}
	
	levelUp(){
		this.stats.maxhp += this.stats.growth[0];
		this.stats.atk += this.stats.growth[1];
		this.stats.def += this.stats.growth[2];
		this.stats.spd += this.stats.growth[3];
		this.stats.lvl++;
		
		this.stats.hp = this.stats.maxhp;
		
		
		if(this.stats.lvl == 2){this.moves.push(moveDict[this.type.shape][1])};
		if(this.stats.lvl == 4){this.moves.push(moveDict[this.type.elem][0])};
		if(this.stats.lvl == 6){this.moves.push(moveDict[this.type.shape][2])};
		if(this.stats.lvl == 8){this.moves.push(moveDict[this.type.elem][1])};
	
		
		alert('LEVEL UP');
	}
	
	//create div on battlefield
	build(){
		let div = document.createElement('div');
		div.id = this.id;
		div.className = this.type.shape+this.type.elem;
		div.innerHTML = this.stats.hp;
		document.getElementById('battlefield').appendChild(div);
		
		let moves = document.createElement('div');
		moves.id = this.id+'moves';
		document.getElementById('battlefield').appendChild(moves);
		
		this.buildMoves();
	}
	
	buildMoves(){
		console.log(Object.values(this.moves));
		for(let move of Object.values(this.moves)){
			let div = document.createElement('div');
			div.className = 'button ' + this.type.elem+'border';
			div.innerHTML = move;
			div.onclick = function(){playerAttack(this)};
			document.getElementById(this.id+'moves').appendChild(div);
		}
		if(this.id == 'player'){
			let run = document.createElement('div');
			run.className = 'button';
			run.style.backgroundColor = 'lightgreen';
			run.innerHTML = "Run";
			run.onclick = function(){removeBattlefield()};
			document.getElementById('playermoves').appendChild(run);
			
			let swap = document.createElement('div');
			swap.className = 'button';
			swap.style.backgroundColor = 'orange';
			swap.innerHTML = 'Swap';
			swap.onclick = function(){
				document.getElementById('player').remove();
				document.getElementById('playermoves').remove();
				user.openParty();
			}
			document.getElementById('playermoves').appendChild(swap);
		};
	}
	
	
	statDisplay(){
		let txt = '';
		
		txt += 'health '+this.stats.hp+'<br>';
		txt += 'attack '+this.stats.atk+'<br>';
		txt += 'defense '+this.stats.def+'<br>';
		txt += 'speed '+this.stats.spd+'<br>';
		txt += 'exp '+this.stats.exp+'<br>';
		txt += 'lvl '+this.stats.lvl+'<br>';
		txt += 'slot '+this.slot;
		
		return txt; 
		
	}
}

class Type{
	constructor(elem, shape){
		this.elem = elem;
		this.shape = shape; 
		this.weak = weakDict[this.elem];
	}
}

class Stats{
	constructor(scale, shape, elem){
		this.maxhp = 20;
		this.atk = 2;
		this.def = 2;
		this.spd = 5;
		
		this.exp = 0;
		this.lvl = scale;
		
		this.growth;
		
		switch(shape){
			case 'snake': this.def+=2; this.growth = [10,1,3,0]; break; 
			case 'wolf': this.spd++; this.atk++; this.growth = [10, 2, 1, 1]; break; 
			case 'horse': this.spd++; this.def++; this.growth = [10, 1, 2, 2]; break; 
			case 'bear': this.def++; this.maxhp+=5; this.growth = [15, 1, 2, 0]; break;
			case 'cat': this.spd++; this.atk++; this.growth = [10, 2, 0, 2]; break; 
		}
		
		switch(elem){
			case 'fire': this.growth[1]+=2; break;
			case 'water': this.growth[0]+=5; this.growth[3]++; break;
			case 'earth': this.growth[2]++; this.growth[0]+=5; break;
			case 'air': this.growth[3]++; this.growth[2]++; break;
			case 'acid': this.growth[1]++; this.growth[2]++; break;
			case 'electric': this.growth[1]++; this.growth[3]++; break;
		}
		
		let i = 1;
		while(i < scale){
			this.maxhp += this.growth[0];
			this.atk += this.growth[1];
			this.def += this.growth[2];
			this.spd += this.growth[3];
			i++;
		}
		this.hp = this.maxhp;
	}
}

//player input and data holder class

class User{
	constructor(){
		this.id = 'user';
		
		this.x = 1500;
		this.y = 1500;
		
		this.dx = 0;
		this.dy = 0;
		this.tx = this.y;
		this.ty = this.x;
		
		this.party = [];
		this.enemy;
		this.activeMonster;
		
		this.inbattle = false;
		this.level = 0;
	}
	
	locate(x,y){
		this.tx = x; this.ty = y;
		if(this.tx == this.x && this.ty == this.y){return};
		if(this.tx > this.x){this.dx = 20}else{this.dx = -20};
		if(this.ty > this.y){this.dy = 20}else{this.dy = -20};
	}
	
	move(){
		window.scrollTo(this.x-window.innerWidth/2, this.y-window.innerHeight/2);
		
		let div = document.getElementById(this.id);
		if(this.tx == this.x){this.dx = 0};
		if(this.ty == this.y){this.dy = 0};
		this.x+=this.dx; this.y+=this.dy;
		div.style.left = this.x.toString()+'px'; div.style.top = this.y.toString()+'px';
		
		if(this.dx != 0 && this.dy != 0){this.col()};
	}
	
	col(){
		for(let encounter of Object.values(mapCol)){
			if(this.x > encounter[0] && this.x < encounter[0]+encounter[2] && this.y > encounter[1] && this.y < encounter[1]+encounter[3]){
				
				if(encounter[4].type == 'heal'){user.party[0].heal(); document.getElementById(encounter[4].id).remove(); delete mapCol[encounter[4].id]; return;};
				if(encounter[4].type == 'level'){user.party[0].levelUp(); document.getElementById(encounter[4].id).remove(); delete mapCol[encounter[4].id]; return};
				if(encounter[4].type == 'portal'){alert('next floor'); nextFloor(); return};
				if(random(0, 1000) > 800){
					user.dx = 0; user.dy = 0;
					encounter[4].shrink();
					battle(user.party[0], encounter[4])
				};
				
			}
		}
	}
	
	openParty(){
		let swapPannel = document.createElement('div');
		swapPannel.id = 'swapHold';
		document.getElementById('battlefield').appendChild(swapPannel);
		let i = 0;
		for(let monster of this.party){
			console.log(monster);
			
			monster.slot = i;
			let div = document.createElement('div');
			div.id = i;
			div.className = 'playerImage '+  monster.type.shape+monster.type.elem;
			div.onclick = function(){
			
				user.party[parseInt(this.id)].build();
				user.activeMonster = user.party[parseInt(this.id)];
				document.getElementById('swapHold').remove();
			}
			i++;
			document.getElementById('swapHold').appendChild(div);
		}
	}
	
	slotOrg(){
		let i = 0;
		for(let monster of this.party){
			monster.slot = i;
			i++;
		}
		this.activeMonster = this.party[0];
	}
	
	
}

function getTarget(){
if(!user.inbattle){	
	let rect = event.target.getBoundingClientRect();
	
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	x=Math.floor(x/20)*20;
	y=Math.floor(y/20)*20;

	user.locate(x,y);
}}



//encounter creation and addition
class Biome{
	constructor(x,y,elem = elemList[random(0, elemList.length-1)]){
		this.id = random(1000, 9999);
		
		this.w = 1000;
		this.h = 1000;
		
		this.x = x;
		this.y = y;
		
		this.elem = elem;
	}
	
	init(){
		let div = document.createElement('div');
		div.id = this.id;
		div.style.position = 'absolute';
		div.style.width = this.w.toString()+'px';
		div.style.height = this.h.toString()+'px';
		div.style.left = (this.x).toString()+'px';
		div.style.top = (this.y).toString()+'px';
		div.className = this.elem + 'border';
		document.getElementById('map').appendChild(div);
		
		this.makeEncounter();
	}
	
	makeEncounter(){
		let encounter = new Encounter(this.elem, this.x, this.y, this);
		encounter.init();	
	}
}

class Encounter{
	constructor(elem = elemList[random(0, elemList.length-1)], x, y, biome){
		this.id = random(1000, 9999).toString();
		this.parent = biome;
		this.level = user.level;
		
		this.w = random(400, 600);
		this.h = random(400, 600);
		
		this.x = random(x, x+400);
		this.y =random(y, y+400);
		
		this.elem = elem;
	}
	init(){
		let div = document.createElement('div');
		div.id = this.id;
		div.style.position = 'absolute';
		div.style.width = this.w.toString()+'px';
		div.style.height = this.h.toString()+'px';
		div.style.left = (this.x).toString()+'px';
		div.style.top = (this.y).toString()+'px';
		div.className = this.elem;
		document.getElementById('map').appendChild(div);
		
		mapCol[this.id] = [this.x, this.y, this.w, this.h, this];
	}
	
	shrink(){
		this.w = this.w/2;
		this.h = this.h/2;
		this.x+=100;
		this.y+=100;
		
		if(this.w < 100 || this.h < 100){this.finalEncounter(); return}
		
		document.getElementById(this.id).style.width = this.w.toString()+'px'; 
		document.getElementById(this.id).style.height = this.h.toString()+'px';
		document.getElementById(this.id).style.left = this.x.toString()+'px';
		document.getElementById(this.id).style.top = this.y.toString()+'px';
		
		mapCol[this.id] = [this.x, this.y, this.w, this.h, this];
	}
	
	finalEncounter(){
		document.getElementById(this.id).remove();
		delete mapCol[this.id];
		
		let boss = new bossEncounter(this.parent.x, this.parent.y, this.elem);
		boss.init();
	}
	
}

class bossEncounter{
	constructor(x, y, elem){
		this.id = random(1000, 9999).toString()+'boss';
		this.level = user.level+1;
		
		this.w = 180;
		this.h = 180;
		
		this.x = random(x, x+700);
		this.y = random(y, y+700);
		
		this.elem = elem;
	}
		init(){
		let div = document.createElement('div');
		div.id = this.id;
		div.style.position = 'absolute';
		div.style.width = this.w.toString()+'px';
		div.style.height = this.h.toString()+'px';
		div.style.left = (this.x).toString()+'px';
		div.style.top = (this.y).toString()+'px';
		div.className = this.elem;
		document.getElementById('map').appendChild(div);
		
		mapCol[this.id] = [this.x, this.y, this.w, this.h, this];
	}
	
	shrink(){
		this.w = this.w/2;
		this.h = this.h/2;
		this.x+=100;
		this.y+=100;
		
		if(this.w < 100 || this.h < 100){this.end(); return}
		
		document.getElementById(this.id).style.width = this.w.toString()+'px'; 
		document.getElementById(this.id).style.height = this.h.toString()+'px';
		document.getElementById(this.id).style.left = this.x.toString()+'px';
		document.getElementById(this.id).style.top = this.y.toString()+'px';
		
		mapCol[this.id] = [this.x, this.y, this.w, this.h, this];
	}
	
	end(){
		document.getElementById(this.id).remove();
		delete mapCol[this.id];
	}
}

class Interactable{
	constructor(type, starter = true){
		this.id = random(1000, 9999).toString();
		this.type = type;
		
		this.w = 100;
		this.h = 100;
		
		if(starter){
			this.x = random(1000, 2000-this.w);
			this.y = random(1000, 2000-this.h);
		}else{
			this.x = random(0, 2950);
			this.y = random(0, 2950);
		}
		
	}
	
	init(){
		let div = document.createElement('div');
		div.id = this.id;
		div.style.position = 'absolute';
		div.style.width = this.w.toString()+'px';
		div.style.height = this.h.toString()+'px';
		div.style.left = (this.x).toString()+'px';
		div.style.top = (this.y).toString()+'px';
		div.className = this.type;
		document.getElementById('map').appendChild(div);
		
		mapCol[this.id] = [this.x, this.y, this.w, this.h, this];

	}
	
}




//div creation for battle

function battle(player, encounter){
	
	let div = document.createElement('div');
	div.id = 'battlefield';
	div.className = encounter.elem+'border';	
	div.style.left = (user.x-200).toString()+'px';
	div.style.top = (user.y-200).toString()+'px';
	document.body.appendChild(div);
	
	player.build();
	if(encounter.id.includes('boss')){user.enemy = new Monster(encounter.level,encounter.elem,'boss')}
	else{user.enemy = new Monster(encounter.level,encounter.elem,'enemy')}
	user.enemy.build();
	
	
	let txt = document.createElement('div');
	txt.id = 'battleText';
	document.getElementById('battlefield').appendChild(txt);
	user.inbattle = true;
}

function rewards(amt){
	let eat = document.createElement('div');
	eat.id = 'eat';
	eat.innerHTML = 'Eat';
	eat.onclick = function(){user.activeMonster.heal(); removeBattlefield()};
	document.getElementById('battlefield').appendChild(eat);
	
	let absorb = document.createElement('div');
	absorb.className = 'absorb';
	absorb.id = amt;
	absorb.innerHTML = 'Absorb';
	absorb.onclick = function(){user.activeMonster.expUp(parseInt(this.id)); removeBattlefield()};
	document.getElementById('battlefield').appendChild(absorb);
	
	let capture = document.createElement('div');
	user.killedMonster = user.enemy;
	capture.id = 'capture';
	capture.className = 'button';
	capture.innerHTML = 'Capture';
	capture.onclick = function(){
		user.killedMonster.stats.hp = user.killedMonster.stats.maxhp;
		if(user.killedMonster.id == 'boss'){user.killedMonster.stats.lvl=0};
		user.killedMonster.id = 'player';	
		user.killedMonster.slot = user.party.length;
		user.party.push(user.killedMonster); 
		user.killedMonster = undefined; 
		removeBattlefield()};
	document.getElementById('battlefield').appendChild(capture); 
}

function removeBattlefield(){
	document.getElementById('battlefield').remove();
	document.getElementById('user').className = user.party[0].type.shape+user.party[0].type.elem;
	user.inbattle = false;
}

function playerAttack(move){
	write('');
	let enemyMoves = document.getElementById(user.enemy.id+'moves').childNodes;
	if(user.activeMonster.stats.spd < user.enemy.stats.spd){user.enemy.attack(enemyMoves[random(0, enemyMoves.length-1)],user.activeMonster); user.activeMonster.attack(move, user.enemy)}
	else{user.activeMonster.attack(move, user.enemy); user.enemy.attack(enemyMoves[random(0, enemyMoves.length-1)],user.activeMonster)};
}



function showStats(){
	setTimeout(function(){user.dx = 0; user.dy = 0}, 10);
	
	let div = document.createElement('div');
	div.id = 'playerStats';
	div.style.left = (user.x-200).toString()+'px';
	div.style.top = (user.y-200).toString()+'px';
	div.onclick = function(){document.getElementById('playerStats').remove()};
	document.body.appendChild(div);
	
	console.log(user.party);
	for(let monster in user.party){
		let img = document.createElement('div');
		img.className = 'playerImage ';
		img.id = user.party[monster].slot;
		img.className += user.party[monster].type.shape+user.party[monster].type.elem;
		img.onclick = function(){
			user.party.splice(0, 0, user.party[parseInt(this.id)]);
			user.party.splice(parseInt(this.id)+1, 1);
			user.slotOrg();
			document.getElementById('user').className = user.party[0].type.shape+user.party[0].type.elem;
			
		}
		document.getElementById('playerStats').appendChild(img);
		
		let stat = document.createElement('div');
		stat.className = 'statsDisplay';
		stat.innerHTML = user.party[monster].statDisplay();
		document.getElementById('playerStats').appendChild(stat);
	}
}


function playerAnimate(){
	user.move();
}
setInterval(playerAnimate, 100);


function makeMap(){
	user.level++;
	for(let y = 0; y < 2001; y+=1000){
		for(let x = 0; x < 2001; x+=1000){
			if(x == 1000 && y == 1000){continue};
			let biome = new Biome(x,y);
			biome.init();
		}
	}
	let heal = new Interactable('heal');
	heal.init();
	let healb = new Interactable('heal');
	healb.init();
	let portal = new Interactable('portal');
	portal.init();
	
	document.getElementById('user').className = user.party[0].type.shape+user.party[0].type.elem;
	user.party[0].stats.lvl = 1;
}


function nextFloor(){
	let map = document.getElementById('map');
	
	while(map.firstChild){map.firstChild.remove()};
	for(let key in mapCol){delete mapCol[key]};
	
	makeMap();
}



function gameOver(){
	alert('you lose');
}
function win(){
	alert('you win');
}

function chooseStarter(){
	let div = document.createElement('div');
	div.id = 'chooseStarter';
	div.innerHTML = 'CHOOSE ONE ELEMENT TYPE AND ONE ANIMAL SHAPE THEN CLICK THE GREEN BOX';
	document.body.appendChild(div);
	

	for(let type of elemList){
		let elem = document.createElement('div');
		elem.className = 'button '+type;
		elem.innerHTML = type;
		elem.onclick = function(){
			user.elemChoice = this.innerHTML;
			for(let i of document.getElementsByClassName('elemSel')){i.className = i.className.replace('elemSel', '')};
			this.className += ' elemSel';
		}
		document.getElementById('chooseStarter').appendChild(elem);
	
	}
	
	for(let type of shapeList){
		let shape = document.createElement('div');
		shape.className = 'button ';
		shape.innerHTML = type;
		shape.onclick = function(){
			user.shapeChoice = this.innerHTML;
			for(let i of document.getElementsByClassName('shapeSel')){i.className = i.className.replace('shapeSel', '')};
			this.className += ' shapeSel';
		}
		document.getElementById('chooseStarter').appendChild(shape);
	
	}
	
	
	let done = document.createElement('div');
	done.id = 'done';
	done.onclick = function(){
	if(user.elemChoice != undefined && user.shapeChoice != undefined){
		document.getElementById('chooseStarter').remove();
		let monster = new Monster(2, user.elemChoice, 'player', user.shapeChoice);
		monster.slot = 0;
		user.party.push(monster);
		makeMap();
		user.activeMonster = user.party[0];
			
	}}
	
	document.getElementById('chooseStarter').appendChild(done);
}



const user = new User();
chooseStarter();

