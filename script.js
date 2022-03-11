// Import libraries
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.126.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.126.0/examples/jsm/controls/OrbitControls.js";
import rhino3dm from "https://cdn.jsdelivr.net/npm/rhino3dm@7.11.1/rhino3dm.module.js";
// import { RhinoCompute } from "https://cdn.jsdelivr.net/npm/compute-rhino3d@0.13.0-beta/compute.rhino3d.module.js";
import { Rhino3dmLoader } from "https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/loaders/3DMLoader.js";

import {GUI} from 'https://cdn.jsdelivr.net/npm/three@0.124.0/examples/jsm/libs/dat.gui.module.js'

const loader = new Rhino3dmLoader();
loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/");


//web_app studio project

const definition = "web_app_main_Neil.gh";

// Set up sliders
const population_slider = document.getElementById("RH_IN:Population");
population_slider.addEventListener("mouseup", onSliderChange, false);
population_slider.addEventListener("touchend", onSliderChange, false);

const recompute_button = document.getElementById( 'RH_IN:Recompute' )
recompute_button.addEventListener( 'change', onSliderChange, false )

//////////

const living1_slider = document.getElementById("RH_IN:Living Octa 1");
living1_slider.addEventListener("mouseup", onSliderChange, false);
living1_slider.addEventListener("touchend", onSliderChange, false);

const living2_slider = document.getElementById("RH_IN:Living Octa 2");
living2_slider.addEventListener("mouseup", onSliderChange, false);
living2_slider.addEventListener("touchend", onSliderChange, false);

const living3_slider = document.getElementById("RH_IN:Living Octa 3");
living3_slider.addEventListener("mouseup", onSliderChange, false);
living3_slider.addEventListener("touchend", onSliderChange, false);

//////////

const sportrec_slider = document.getElementById("RH_IN:Sport Rec");
sportrec_slider.addEventListener("mouseup", onSliderChange, false);
sportrec_slider.addEventListener("touchend", onSliderChange, false);

const greenhouse_slider = document.getElementById("RH_IN:Greenhouse");
greenhouse_slider.addEventListener("mouseup", onSliderChange, false);
greenhouse_slider.addEventListener("touchend", onSliderChange, false);

const working_slider = document.getElementById("RH_IN:Working");
working_slider.addEventListener("mouseup", onSliderChange, false);
working_slider.addEventListener("touchend", onSliderChange, false);

const antennae_slider = document.getElementById("RH_IN:Antennae");
antennae_slider.addEventListener("mouseup", onSliderChange, false);
antennae_slider.addEventListener("touchend", onSliderChange, false);

const connector_slider = document.getElementById("RH_IN:Connectors");
connector_slider.addEventListener("mouseup", onSliderChange, false);
connector_slider.addEventListener("touchend", onSliderChange, false);

///////////

let rhino, definition, doc;
rhino3dm().then(async (m) => {
  console.log("Loaded rhino3dm.");
  rhino = m; // global

  //RhinoCompute.url = getAuth( 'RHINO_COMPUTE_URL' ) // RhinoCompute server url. Use http://localhost:8081 if debugging locally.
  //RhinoCompute.apiKey = getAuth( 'RHINO_COMPUTE_KEY' )  // RhinoCompute server api key. Leave blank if debugging locally.

  // RhinoCompute.url = "http://localhost:8081/"; //if debugging locally.

  // load a grasshopper file!

  // const url = definitionName;
  // const res = await fetch(url);
  // const buffer = await res.arrayBuffer();
  // const arr = new Uint8Array(buffer);
  // definition = arr;




  init();
  compute();
});

async function compute() {
  // const param1 = new RhinoCompute.Grasshopper.DataTree("X_X");
  // param1.append([0], [radius_slider.valueAsNumber]);

  // const param2 = new RhinoCompute.Grasshopper.DataTree("Y_Y");
  // param2.append([0], [count_slider.valueAsNumber]);

  // // clear values
  // const trees = [];
  // trees.push(param1);
  // trees.push(param2);

  // const res = await RhinoCompute.Grasshopper.evaluateDefinition(
  //   definition,
  //   trees
  // );
const data = {
    definition: definition,
    inputs: {
      //'dimension': dimension_slider.valueAsNumber,
     // 'height': height_slider.valueAsNumber,
     'RH_IN:Population': population_slider.valueAsNumber,
     'RH_IN:Recompute': recompute_button.checked,


     'RH_IN:Living Octa 1': living1_slider.valueAsNumber,
     'RH_IN:Living Octa 2': living2_slider.valueAsNumber,
     'RH_IN:Living Octa 3': living3_slider.valueAsNumber,

     //
     'RH_IN:Sport Rec': sportrec_slider.valueAsNumber,
     'RH_IN:Greenhouse': greenhouse_slider.valueAsNumber,
     'RH_IN:Working': working_slider.valueAsNumber,
     'RH_IN:Antennae': antennae_slider.valueAsNumber,
     'RH_IN:Connectors': connector_slider.valueAsNumber,
     //
  
     'points': points

  }
 }

 showSpinner(true)

 console.log(data.inputs)

 const request = {
  'method':'POST',
  'body': JSON.stringify(data),
  'headers': {'Content-Type': 'application/json'}
}

try {
  const response = await fetch('/solve', request);

  if (!response.ok) {
    // TODO: check for errors in response json
    throw new Error(response.statusText);
  }

  const responseJson = await response.json();

  collectResults(responseJson);
} catch (error) {
  console.error(error);
}
}


/**
 * Parse response
 */
 function collectResults(responseJson) {
  const values = responseJson.values;

  console.log(values);
  //GET VALUES
  // // let RH_IN: zHeight =  
  // let area = "Slide to see area"
  // let roofarea = "Slide to see roofarea"
  // let plants = "Slide to see No. plants"


  // clear doc
  try {
    if( doc !== undefined)
        doc.delete()
  } catch {}


  //console.log(res);

  doc = new rhino.File3dm();

  // hide spinner
  // document.getElementById("loader").style.display = "none";

  //decode grasshopper objects and put them into a rhino document
  // for (let i = 0; i < res.values.length; i++) {
  //   for (const [key, value] of Object.entries(res.values[i].InnerTree)) {
  //     for (const d of value) {
  //       const data = JSON.parse(d.data);
  //       const rhinoObject = rhino.CommonObject.decode(data);
  //       doc.objects().add(rhinoObject, null);
  //     }
  //   }
  // }

  for (let i = 0; i < values.length; i++) {
    // ...iterate through data tree structure...
    for (const path in values[i].InnerTree) {
      const branch = values[i].InnerTree[path];
      // ...and for each branch...
      for (let j = 0; j < branch.length; j++) {
        // ...load rhino geometry into doc
        const rhinoObject = decodeItem(branch[j]);

        // if (values[i].ParamName == "RH_OUT:maxext") {
        //   mshifting = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
        // }
        // if (values[i].ParamName == "RH_OUT:cropsspacing") {
        //   crops = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
        // }
        // if (values[i].ParamName == "RH_OUT:lanewidth") {
        //   lwidth = JSON.parse(responseJson.values[i].InnerTree['{ 0; }'][0].data)
        // }

        // console.log(values[i].ParamName)


        if (rhinoObject !== null) {
          doc.objects().add(rhinoObject, null);
        }
      }
    }
  }


  // go through the objects in the Rhino document

  // let objects = doc.objects();
  // for ( let i = 0; i < objects.count; i++ ) {
  
  //   const rhinoObject = objects.get( i );


  //    // asign geometry userstrings to object attributes
  //   if ( rhinoObject.geometry().userStringCount > 0 ) {
  //     const g_userStrings = rhinoObject.geometry().getUserStrings()
  //     //console.log(g_userStrings)
  //     rhinoObject.attributes().setUserString(g_userStrings[0][0], g_userStrings[0][1])
      
  //   }
  // }


  // clear objects from scene
  // scene.traverse((child) => {
  //   if (!child.isLight) {
  //     scene.remove(child);
  //   }
  // });
  if (doc.objects().count < 1) {
    console.error("No rhino objects to load!");
    showSpinner(false);
    return;
  }


  const buffer = new Uint8Array(doc.toByteArray()).buffer;
  loader.parse(buffer, function (object) {

    // go through all objects, check for userstrings and assing colors

    // object.traverse((child) => {
    //   if (child.isMesh) {
    //     const mat = new THREE.MeshStandardMaterial( {color: 'white',roughness: 0.01 ,transparent: true, opacity: 0.95 } )
    //     child.material = mat;
        //if (child.userData.attributes.geometry.userStringCount > 0) {
          
          //get color from userStrings
          //const colorData = child.userData.attributes.userStrings[0]
          //const col = colorData[1];

          //convert color from userstring to THREE color and assign it
          //const threeColor = new THREE.Color("rgb(" + col + ")");
          //const mat = new THREE.LineBasicMaterial({ color: threeColor });
          //child.material = mat;
        //}
        scene.traverse((child) => {
          if ( child.userData.hasOwnProperty( 'objectType' ) && child.userData.objectType === 'File3dm') {
            scene.remove(child);
          }
        });
  
      // color crvs
      object.traverse(child => {
        if (child.isLine) {
          if (child.userData.attributes.geometry.userStringCount > 0) {
            //console.log(child.userData.attributes.geometry.userStrings[0][1])
            const col = child.userData.attributes.geometry.userStrings[0][1]
            const threeColor = new THREE.Color( "rgb(" + col + ")")
            const mat = new THREE.LineBasicMaterial({color:threeColor})
            child.material = mat
          }
        }
      })

      
      // add object graph from rhino model to three.js scene
      scene.add(object);

      // hide spinner and enable download button
      showSpinner(false);
      downloadButton.disabled = false;

      // zoom to extents
      zoomCameraToSelection(camera, controls, scene.children);


      }
    );

    ///////////////////////////////////////////////////////////////////////
    // add object graph from rhino model to three.js scene
    scene.add(object);

  });
}

function decodeItem(item) {
  const data = JSON.parse(item.data)
  if (item.type === 'System.String') {
    // hack for draco meshes
    try {
        return rhino.DracoCompression.decompressBase64String(data)
    } catch {} // ignore errors (maybe the string was just a string...)
  } else if (typeof data === 'object') {
    return rhino.CommonObject.decode(data)
  }
  return null
  }
  





function onSliderChange() {
  // show spinner
  document.getElementById("loader").style.display = "block";
  compute();
}


// THREE BOILERPLATE //
let scene, camera, raycaster, renderer, controls, container;

const mouse = new THREE.Vector2()


function init() {
  // create a scene and a camera
  
  THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1)


  scene = new THREE.Scene();

  scene.background = new THREE.Color(200, 1, 1);
  // let material, cubeMap;
  // cubeMap = new THREE.CubeTextureLoader()
  //   .setPath("./assets/")
  //   .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
  // scene.background = cubeMap;


  camera = new THREE.PerspectiveCamera(
    15,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );


  camera.position.set(25, 55, 50);
  camera.lookAt( scene.position)
  
  //camera.position.z = -30;

  // container = document.getElementById('main_Container')
  // var contWidth = container.offsetWidth;
  // var contHeight = container.offsetHeight

  // create the renderer and add it to the html
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // container.appendChild(renderer.domElement);
  document.body.appendChild(renderer.domElement);

  // add some controls to orbit the camera
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // add a directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set( 20, 0, 100 )
  directionalLight.castShadow = true
  directionalLight.intensity = 0.95;
  scene.add(directionalLight);

  //const ambientLight = new THREE.AmbientLight();
  //scene.add(ambientLight);

  const hemisphereLight = new THREE.HemisphereLight(0x000000, 0xFFFFFF, 0.10)
  scene.add(hemisphereLight)

  raycaster = new THREE.Raycaster()


  animate();
}

let container_att; 


function onClick( event ) {

  console.log( `click! (${event.clientX}, ${event.clientY})`)

// calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1
  
  raycaster.setFromCamera( mouse, camera )

// calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects( scene.children, true )

  let container_clck = document.getElementById( 'container_clck' )
  if (container_clck) container_clck.remove()

  // reset object colours
  scene.traverse((child, i) => {
      if (child.userData.hasOwnProperty( 'material' )) {
          child.material = child.userData.material
          child.material = selectedMaterial_b
      }
  })

  if (intersects.length > 0) {

      // get closest object
      const object = intersects[0].object
      console.log(object) // debug

      object.traverse( (child) => {
          if (child.parent.userData.objectType === 'Brep') {
              child.parent.traverse( (c) => {
                  if (c.userData.hasOwnProperty( 'material' )) {
                      c.material = selectedMaterial
                  }
              })
          } else {
              if (child.userData.hasOwnProperty( 'material' )) {
                  child.material = selectedMaterial
              }
          
          
          }
      })

      // get user strings
      let data, count
      if (object.userData.attributes !== undefined) {
          data = object.userData.attributes.userStrings
      } else {
          // breps store user strings differently...
          data = object.parent.userData.attributes.userStrings
      }

      // do nothing if no user strings
      if ( data === undefined ) return

      console.log( data )
      
      // create container div with table inside
      container_clck = document.createElement( 'div' )
      container_clck.id = 'container_clck'
      
      const table = document.createElement( 'table' )
      container_clck.appendChild( table )

      for ( let i = 0; i < data.length; i ++ ) {

          const row = document.createElement( 'tr' )
          row.innerHTML = `<td>${data[ i ][ 0 ]}</td><td>${data[ i ][ 1 ]}</td>`
          table.appendChild( row )
      }

      container_att = document.getElementById('sidebar')
      container_att.appendChild( container_clck )
  }


}

window.addEventListener('click', onClick, false)

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  animate();
}

function meshToThreejs(mesh, material) {
  const loader = new THREE.BufferGeometryLoader();
  const geometry = loader.parse(mesh.toThreejsJSON());
  return new THREE.Mesh(geometry, material);
}

