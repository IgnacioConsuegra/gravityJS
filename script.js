const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;
const G = 6.67430e-11
const particlesArr = [];
const mouse = {
  x: undefined,
  y: undefined,
}
function addParticle(){
  particlesArr.push(new Particle());
}
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
canvas.addEventListener('click', (event) => {
  mouse.x = event.offsetX;
  mouse.y = event.offsetY;
  addParticle();
})
class Particle{
  constructor(){
    this.x = mouse.x;
    this.y = mouse.y;
    this.mass = 100000000000;
    this.speedX = 0;
    this.speedY = 0;
    this.color = 'white';
    this.size = 10;
  }
  draw(){
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
  update(){
    for (let i = 0; i < particlesArr.length; i++) {
      const otherParticle = particlesArr[i];
      if (otherParticle !== this) {
        const dx = otherParticle.x - this.x;
        const dy = otherParticle.y - this.y;
        const distanceSquared = dx * dx + dy * dy;
        const distance = Math.sqrt(distanceSquared);
        if(distance <= (this.size + otherParticle.size)){
          this.size += otherParticle.size;
          this.mass += otherParticle.mass;
          particlesArr.splice(i, 1);
        }
        const forceMagnitude = (G * this.mass * otherParticle.mass) / distanceSquared;
        const forceX = forceMagnitude * dx / distance;
        const forceY = forceMagnitude * dy / distance;    
        this.speedX += forceX / this.mass;
        this.speedY += forceY / this.mass;
      }
    }
    
    this.x += this.speedX;
    this.y += this.speedY;
    
    if(this.x <= 0 + this.size || this.x >= canvas.width - this.size) {
      this.speedX = this.speedX * -1;
    }
    if(this.y <= 0 + this.size || this.y >= canvas.height - this.size) {
      this.speedY = this.speedY * -1;
    }
  }
}
function handleParticle() {
  for (let i = 0; i < particlesArr.length; i++) {
    particlesArr[i].draw();
    particlesArr[i].update();
  }
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticle();
}
setInterval(() => {
  animate();
}, 1000 / 100);