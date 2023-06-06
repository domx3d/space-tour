import * as THREE from 'three';
import SceneManager from "./SceneManager.js";
import TextBox from "./TextBox.js";
import { resizeRendererToDisplaySize } from './Utils.js';
import ButtonManager from './ButtonManager.js';

// variables
let previousTime = 0;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


// text box
const textBox = new TextBox();

// buttons manager
const buttonManager = new ButtonManager();

// scene manager
let sm = new SceneManager(textBox, buttonManager);




// renderer
const canvas = document.querySelector('#main-canvas');
const renderer = new THREE.WebGLRenderer({canvas, 
  antialias: true, 
  alpha: true, 
  //outputColorSpace: THREE.SRGBColorSpace,
  //toneMapping: THREE.LinearToneMapping
});
renderer.toneMappingExposure = 0.5;


// return to earth button
const returnButton = document.getElementById( 'returnButton' );
returnButton.addEventListener( 'click', function ( event ) {
  sm.returnToEarth();
}, false );

// left arrow button
const leftArrow = document.getElementById( 'left-arrow' );
leftArrow.addEventListener( 'click', function ( event ) {
  //console.log('at section'+section+' going left')
  sm.moveLeftSection();
}, false );

// right arrow button
const rightArrow = document.getElementById( 'right-arrow' );
rightArrow.addEventListener( 'click', function ( event ) {
  sm.moveRightSection();
}, false );

// night mode button
const nightModeBtn = document.getElementById("nightMode");
nightModeBtn.addEventListener('click', (event) => {
  sm.setNightMode()
})

// remove start screen
document.addEventListener('keydown', function(event) {
  sm.removeStartScreen();
});

// reset rotation x when clicked on div textbox
document.getElementById('textBox').onclick = () => {
  sm.resetRotation();
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
  sm.scrollEvent(event.deltaY);
}

// debounced wheel event handler
document.addEventListener('wheel', debounce(handleWheel, 10));


// mouse, pointer events
document.addEventListener("mousemove", onMouseMove, false);
document.addEventListener('pointerdown', onMouseDown, false);
document.addEventListener('pointerup', onMouseup, false);
document.addEventListener('mouseleave', onMouseup,false);


function onMouseDown(event) {
  sm.removeStartScreen();
  // Calculate mouse position in normalized device coordinates
  const mouse = new THREE.Vector2(
    (event.clientX / window.innerWidth) * 2 - 1,
    -(event.clientY / window.innerHeight) * 2 + 1
  );
  sm.clickPlanet(mouse);
}

function onMouseup(event) {
  if(sm.pressed){
    sm.pressed = false;
    //mouseX_delta = 0;
    //mouseY_delta = 0;
  }
}

let prevMouseX = 0, prevMouseY = 0;
let deltaX = 0, deltaY = 0;

function onMouseMove(event) {
  
  const currentMouseX = (event.clientX / window.innerWidth) * 2 - 1;
  const currentMouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  deltaX = currentMouseX - prevMouseX;
  deltaY = currentMouseY - prevMouseY;
  
  // Update the rotation based on the delta
  sm.rotatePlanet(deltaX, deltaY)
  
  prevMouseX = currentMouseX;
  prevMouseY = currentMouseY;
}


/*                                    render                                                */

function render(time) {

  time *= 0.001;
  const deltaTime = time - previousTime;
  previousTime = time;
  
 
  if (resizeRendererToDisplaySize(renderer, sizes)) {
      const canvas = renderer.domElement;
      sm.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      sm.camera.updateProjectionMatrix();
  }

  sm.renderScene(deltaTime, prevMouseX, prevMouseY);

  // render call
  renderer.render(sm.scene, sm.camera);
  
  requestAnimationFrame(render);
}

requestAnimationFrame(render);