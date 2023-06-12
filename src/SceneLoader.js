import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function loadScene(sceneManager) {

  // loading manager
  const manager = new THREE.LoadingManager();

  manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    //console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    sceneManager.loading = true;
  };

  manager.onLoad = function ( ) {
    //console.log( 'Loading complete!');
    const loadingGif = document.getElementById( 'loader' );	
    loadingGif.remove();
    const anyKeyMsg = document.getElementById('anyKey');
    anyKeyMsg.style.visibility = 'visible'
    sceneManager.loading = false;
  };

  manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    //console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  };

  manager.onError = function ( url ) {
    console.log( 'There was an error loading ' + url );
  };


  // texture loader
  const texLoader = new THREE.TextureLoader(manager);
  
  sceneManager.earthDayTex = texLoader.load('planets/2k_Earth.jpg');
  sceneManager.earthNightTex = texLoader.load('planets/2k_earth_nightmap.jpg');
  
  // planets geometry
  const sphereGeometry = new THREE.SphereGeometry(1,128,128);

  // create planets
  for(let i = 0; i < sceneManager.planetNames.length; i++) {
    const map = texLoader.load('planets/2k_'+sceneManager.planetNames[i]+'.jpg');
    //map.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({
      map: (sceneManager.planetNames[i] == 'Earth') ? 
        sceneManager.earthDayTex : map,
      //color: '#aaa',
      //encoding: THREE.SRGBColorSpace
    });

    const mesh = new THREE.Mesh(sphereGeometry, material);
    
    mesh.position.set(-4 * sceneManager.objectsDistance + i * sceneManager.objectsDistance , 0, 0) // need change for mobile -> move to sm
    sceneManager.scene.add(mesh);
    sceneManager.planets.push(mesh);  
  
    // satrun ring
    if(sceneManager.planetNames[i] == "Saturn") {
      const ringGeo = new THREE.RingGeometry(1, 2, 64);
      let pos = ringGeo.attributes.position;
      let v3 = new THREE.Vector3();
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

  // particles
  const particlesCount = 600;
  const positions = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount; i++)
  {
    positions[i * 3 + 0] = (Math.random() - 0.5) * sceneManager.objectsDistance*(sceneManager.planets.length+1);  // x
    positions[i * 3 + 1] = (Math.random() - 0.5) * 15;  // y
    positions[i * 3 + 2] = (Math.random() - 1) * 20;  // z
  }
  
  const particleSize =0.05;

  const particlesGeometry = new THREE.BufferGeometry();
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    map: texLoader.load('background/star.png'), 
    sizeAttenuation: true, 
    size: particleSize
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  sceneManager.scene.add(particles);

}



export default loadScene;


                  




