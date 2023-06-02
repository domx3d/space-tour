import * as THREE from 'three';
import { gsap } from 'gsap';
import { planetsInfo } from './TextBox';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
console.log(sizes)

const planets = [];
let material;
let objectsDistance = 20;

let scrollCount = 0;  // where in the section we are
const toSectionSteps = 10; // number of scrolls to get to the next object
let nextSection = false;
let section = 0;
let startScreen = true;
let changingSection = true;
let nightMode = false;
let noScroll = false;
let loading;

// for moving the text box
const element = document.querySelector('.element');
let elementPosition ={x: 0, y:0, opacity:0};


// return to earth button
const returnButton = document.getElementById( 'returnButton' );
returnButton.addEventListener( 'click', function ( event ) {
	// return to section 0 earth
  gsap.to(elementPosition, {opacity: 0, duration: 0.5, ease: "power2.out", onComplete:(()=>{
    gotoSection(0);
  })})
}, false );

const leftArrow = document.getElementById( 'left-arrow' );
leftArrow.addEventListener( 'click', function ( event ) {
  //console.log('at section'+section+' going left')
  if(section > -4) {
    gsap.to(elementPosition, {opacity: 0, duration: 0.5, ease: "power2.out", onComplete:(()=>{
      gotoSection(section - 1);
    })})
  }  
}, false );

const rightArrow = document.getElementById( 'right-arrow' );
rightArrow.addEventListener( 'click', function ( event ) {
  if(section < 5) {
    gsap.to(elementPosition, {opacity: 0, duration: 0.5, ease: "power2.out", onComplete:(()=>{
      gotoSection(section + 1);
    })})
  }  
}, false );


// start screen remove
function removeStartScreen() {
  if(startScreen && !loading) {
    //gsap.to(elementPosition, {opacity: 1, duration: 2, ease: "power2.out", onComplete:()=>{changingSection=false;}})
    document.querySelector('.startScreen').remove();
    startScreen = false;
    gotoSection(0);
    gsap.from(planets[4].scale, {z: 0.5, x: 0.5, y: 0.5, duration: 1.75, ease: "power2.out",})
  }
  
}

document.addEventListener('keydown', function(event) {
  removeStartScreen();
});

// scene
const scene = new THREE.Scene();

// loaders
const manager = new THREE.LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	//console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  loading = true;
};

manager.onLoad = function ( ) {
	//console.log( 'Loading complete!');
  const loadingScreen = document.getElementById( 'loader' );	
  loadingScreen.remove();
  const anyKeyMsg = document.getElementById('anyKey');
  anyKeyMsg.style.visibility = 'visible'
  loading = false;
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	//console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};

manager.onError = function ( url ) {
	console.log( 'There was an error loading ' + url );
};
const texLoader = new THREE.TextureLoader(manager);

// renderer
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas, 
  antialias: true, 
  alpha: true, 
  //outputColorSpace: THREE.SRGBColorSpace,
  //toneMapping: THREE.LinearToneMapping
});
renderer.toneMappingExposure = 0.5;
//console.log(renderer)
document.body.appendChild(renderer.domElement);

// camera
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 1000);
camera.position.z = 5;
cameraGroup.add(camera);

// lights
/* const light1 = new THREE.DirectionalLight('white', 0.5);
light1.position.set(0,0,10)
scene.add(light1); */

// planets
const planetNames = [
  'Sun', 'Mercury', 'Venus', 'Moon', 'Earth', 'Mars', 
  'Jupiter', 'Saturn', 'Uranus', 'Neptune'
];                  
const earthDayTex = texLoader.load('planets/2k_Earth.jpg')
const earthNightTex = texLoader.load('planets/2k_earth_nightmap.jpg')
const sphereGeometry = new THREE.SphereGeometry(1,128,128);
for(let i = 0; i < planetNames.length; i++) {
  
  material = new THREE.MeshBasicMaterial({
    map: (planetNames[i] == 'Earth') ? 
      earthDayTex :
      texLoader.load('planets/2k_'+planetNames[i]+'.jpg'),
    color: '#aaa',
    //encoding: THREE.SRGBColorSpace
  });
  const mesh = new THREE.Mesh(sphereGeometry, material);
  mesh.position.set(-4 * objectsDistance + i * objectsDistance - 1.5, 0, 0)
  scene.add(mesh);
  planets.push(mesh);  

  // satrun ring
  if(planetNames[i] == "Saturn") {
    const ringGeo = new THREE.RingGeometry(1, 2, 64);
    var pos = ringGeo.attributes.position;
    var v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++){
        v3.fromBufferAttribute(pos, i);
        ringGeo.attributes.uv.setXY(i, v3.length() < 1.5 ? 0 : 1, 1);
    }
    const ringMat = new THREE.MeshBasicMaterial({
      map: texLoader.load('planets/2k_saturn_ring_alpha.png'),
      transparent: true,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = 1.8;
    mesh.add(ring);
  }
}
// night mode button
const nightModeBtn = document.getElementById("nightMode");
nightModeBtn.addEventListener('click', (event) => {
  nightMode = (nightMode) ? false : true;
  if(nightMode){
    planets[4].material.map = earthNightTex;
  }else{
    planets[4].material.map = earthDayTex;
  }  
})
//gsap.from(planets[4].scale, {z: 0.5, x: 0.5, y: 0.5, duration: 1.5, ease: "power2.out",})
gotoSection(0);

// particles
const particlesCount = 400;
const positions = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount; i++)
{
  positions[i * 3 + 0] = (Math.random() - 0.5) * objectsDistance*(planets.length+1);  // x
  positions[i * 3 + 1] = (Math.random() - 0.5) * 15;  // y
  positions[i * 3 + 2] = (Math.random() - 1) * 20;  // z
}
const particleSize = 0.08;
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
  map: texLoader.load('background/star.png'), 
  sizeAttenuation: true, 
  size: particleSize
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

function setTextBox(section) {


  document.getElementById('planetName').innerText = planetNames[section+4];
  //console.log(planetsInfo[planetNames[section+4]].facts[0])
  document.getElementById('fact1').innerText =
    planetsInfo[planetNames[section+4]].facts[0];
  document.getElementById('fact2').innerText =
    planetsInfo[planetNames[section+4]].facts[1];
  document.getElementById('fact3').innerText =
    planetsInfo[planetNames[section+4]].facts[2];
}

// scroll through the canvas
//let scrollY = 0; // how deep on have we scrolled
function gotoSection(newSec) {

  returnButton.style.visibility = (newSec == 0) ? "hidden" : 'visible';
  nightModeBtn.style.visibility = (newSec != 0) ? "hidden" : 'visible';
  leftArrow.style.visibility = (newSec == -4) ? "hidden" : 'visible';
  rightArrow.style.visibility = (newSec == 5) ? "hidden" : 'visible';
  elementPosition.x = 0;
  section = newSec;
  nextSection = true;
  scrollCount = 0;
  setTextBox(newSec, planetNames[newSec+4]);
  planets[newSec+4].rotation.x = 0;
  //gsap.from(planets[section+4].scale, {z: 0.5, x: 0.5, y: 0.5, duration: 1.5, ease: "power2.out",})
}

// reset rotation x when clicked on div textbox
document.getElementById('textBox').onclick = () => {
  gsap.to(planets[section+4].rotation, {x: 0, duration: 2, ease: "power1.out"})
}




// Debounce function
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function handleWheel (event) {
    //scrollY += event.deltaY;
    if(noScroll || changingSection || startScreen) {
      return;
    }
    let scrollDirection = (event.deltaY > 0) ? 1 : -1;
    if(!nextSection) {  // disable during transition to new section
      //scrollY += scrollDirection;
      if(section > -4 && section < 5) {
        scrollCount += scrollDirection;
      }else if(section == -4 && (scrollDirection < 0 || scrollCount < toSectionSteps - 2 )) {  // limit to the left
        scrollCount += scrollDirection;
      }else if(section == 5 && (scrollDirection > 0 || scrollCount > -toSectionSteps +2)) {   // limit to the right
        scrollCount += scrollDirection;
      }
      
    }
    // move to new section after a few scrolls
    if( (scrollCount >= toSectionSteps || scrollCount <= -toSectionSteps)) {
      // change section 
      const newSection = (scrollCount > 0) ? section-1 : section + 1;
      changingSection = true;
      gotoSection(newSection);      
    }

    // hide textbox after 3 steps
    if(!changingSection && scrollCount <= 3 && scrollCount >= -3) {
      const opc = (scrollCount==0) ? 1 : (scrollCount %2==0) ? 0.6 : (scrollCount%3==0) ? 0 : 0.85;
      gsap.to(elementPosition, {opacity: opc, duration: 0.5, ease: "power2.out",})
    }
}

// Debounced version of the event handler
const debouncedHandleWheel = debounce(handleWheel, 10); // Adjust the delay as needed

// Add event listener with the debounced function
window.addEventListener('wheel', debouncedHandleWheel);


// mouse move
const cursor = {x:0, y:0}
/* let mousePressed = false;
window.addEventListener('mousedown', (event) => {
  mousePressed = true;
  console.log('mousedown')
})
window.addEventListener('mouseup', (event) => {
  mousePressed = false;
}) */

//raytracer - sphere rotation
// raycaster
const raycaster = new THREE.Raycaster();
let pressed = false;
let rotatePlanet;

window.addEventListener('pointerdown', onMouseDown, false);
window.addEventListener('pointerup', onMouseup, false);
window.addEventListener('mouseleave', onMouseup,false);

function onMouseDown(event) {
  removeStartScreen();
  // Calculate mouse position in normalized device coordinates
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if(intersects.length > 0) {
    //console.log(intersects[0].object)
    if (intersects[0].object.type === 'Mesh') {
      pressed = true;
      rotatePlanet = intersects[0].object;
    } 
  }
}
function onMouseup(event) {
  if(pressed){
    pressed = false;
    //mouseX_delta = 0;
    //mouseY_delta = 0;
  }
}

let prevMouseX = 0, prevMouseY = 0;
let deltaX = 0, deltaY = 0;

function onMouseMove(event) {
  
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
  
  
  const currentMouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const currentMouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // Calculate the delta (difference) between the current and previous mouse positions
  deltaX = currentMouseX - prevMouseX;
  deltaY = currentMouseY - prevMouseY;
  
  // Update the rotation based on the delta
  if(pressed) {
    rotatePlanet.rotation.x += deltaY * 2;
    rotatePlanet.rotation.y += deltaX * 4;
  }
  
  // Store the current mouse position as the previous mouse position for the next frame
  prevMouseX = currentMouseX;
  prevMouseY = currentMouseY;
}
document.addEventListener("mousemove", onMouseMove, false);

//--------------------------------------render---------------------------------------------//
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  sizes.width = canvas.clientWidth;
  sizes.height = canvas.clientHeight;
  const needResize = canvas.width !== sizes.width || canvas.height !== sizes.height;
  if (needResize) {
      renderer.setSize(sizes.width, sizes.height, false);
  }
  return needResize;
}
const clock = new THREE.Clock();
let previousTime = 0;

function render(time) {

  time *= 0.001;
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  
  if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
  }
  if(planets.length > 0 && !pressed) {
    planets.forEach((planet) => {
      planet.rotation.y += 0.002;
    })
  }
  // set camera with scroll
  //camera.position.x = - scrollY * objectsDistance / 6;
  
  if(nextSection) {   // large leap to the next section
    gsap.to(camera.position, {
      x: (section * objectsDistance),
      duration: 1,
      ease: 'slow(0.1, 0.1, false)', // Easing function
      onComplete: ()=>{
        nextSection = false;
        elementPosition.opacity = (startScreen) ? 0 : 1;
        //changingSection = false;
        noScroll = true;
        setTimeout(function(){
          changingSection = false;
          noScroll = false;
      }, 500);
      }
    });
  } else {  // small leap or stay in place on every other tick
    gsap.to(camera.position, {
      x: (section * objectsDistance - objectsDistance * scrollCount / 8 / toSectionSteps),
      duration: 1,
      ease: 'slow(0.1, 0.1, false)', // Easing function
    });
    // hide textbox when scrolled
    element.style.opacity = elementPosition.opacity;
  
  }
  // rotate planet
 /*  if(pressed) {
    rotatePlanet.rotation.x += deltaY * 31.4; // Adjust the rotation speed as needed
    rotatePlanet.rotation.y += deltaX * 31.4;
  } */
  
  // parallax effect
  if(!pressed && document.hasFocus()) {
    const amplitude = 0.3;
    const parallaxX = cursor.x * amplitude;
    const parallaxY = - cursor.y * amplitude;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.5 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.5 * deltaTime;
  }
  
  //----------------------render------------------
  renderer.render(scene, camera);
  
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
  
