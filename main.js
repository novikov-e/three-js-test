import { SUBTRACTION, Brush, Evaluator, Operation } from "three-bvh-csg";
import * as THREE from "three";
import { MapControls } from "three/examples/jsm/controls/MapControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";

const degToRad = (degrees) => degrees * (Math.PI / 180);
let params = { width: 800, height: 2000 };

const evaluator = new Evaluator();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function handleChange(event) {
  const { name, value } = event.target;
  params[name] = value;
  draw();
  moveHandles();
}

document.getElementById("width").addEventListener("change", handleChange);
document.getElementById("height").addEventListener("change", handleChange);
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const loader = new GLTFLoader();

let outerHandle, innerHandle;
loader.load(
  "models/handle.glb",
  function (gltf) {
    outerHandle = gltf.scene;
    outerHandle.position.x = -params.width / 1000 / 2 + 0.075;
    outerHandle.position.y = 1.2;
    outerHandle.position.z = 0.095;
    outerHandle.rotateX(degToRad(90));
    outerHandle.rotateY(degToRad(270));
    scene.add(outerHandle);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
loader.load(
  "models/handle.glb",
  function (gltf) {
    innerHandle = gltf.scene;
    innerHandle.position.x = -params.width / 1000 / 2 + 0.075;
    innerHandle.position.y = 1.2;
    innerHandle.position.z = 0.055;
    innerHandle.rotateX(degToRad(270));
    innerHandle.rotateY(degToRad(270));
    scene.add(innerHandle);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function moveHandles() {
  scene.remove(innerHandle);
  innerHandle.position.x = -params.width / 1000 / 2 + 0.075;
  scene.remove(outerHandle);
  outerHandle.position.x = -params.width / 1000 / 2 + 0.075;
  scene.add(innerHandle);
  scene.add(outerHandle);
}

const controls = new MapControls(camera, renderer.domElement);
camera.position.set(0.5, 2.2, 3);
controls.update();

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x404040, 60);
directionalLight.position.set(-10, 20, 20);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Текстуры и материалы
const hdriTexture = new URL("./textures/kloofendal_misty_morning_puresky_1k.hdr", import.meta.url);
const rgbeLoader = new RGBELoader();
rgbeLoader.load(hdriTexture, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xb1ccb9 });
// wallMaterial.castShadow = true;
wallMaterial.reciveShadow = true;

const kendalTexture = new THREE.TextureLoader().load("textures/kendal.jpg");
kendalTexture.wrapS = THREE.RepeatWrapping;
kendalTexture.wrapT = THREE.RepeatWrapping;
kendalTexture.repeat.set(1, 1);
const kendalMaterial = new THREE.MeshStandardMaterial({ map: kendalTexture });
// kendalMaterial.castShadow = true;
kendalMaterial.receiveShadow = true;

const navarraTexture = new THREE.TextureLoader().load("textures/navarra.jpg");
navarraTexture.wrapS = THREE.RepeatWrapping;
navarraTexture.wrapT = THREE.RepeatWrapping;
navarraTexture.repeat.set(1, 1);
const navarraMaterial = new THREE.MeshStandardMaterial({ map: navarraTexture });
navarraMaterial.castShadow = true;
navarraMaterial.receiveShadow = true;

const pacificTexture = new THREE.TextureLoader().load("textures/pacific.jpg");
pacificTexture.wrapS = THREE.RepeatWrapping;
pacificTexture.wrapT = THREE.RepeatWrapping;
pacificTexture.repeat.set(1, 1);
const pacificMaterial = new THREE.MeshStandardMaterial({ map: pacificTexture });
pacificMaterial.castShadow = true;
pacificMaterial.receiveShadow = true;

const tileTexture = new THREE.TextureLoader().load("textures/plitka.jpg");
tileTexture.wrapS = THREE.RepeatWrapping;
tileTexture.wrapT = THREE.RepeatWrapping;
tileTexture.repeat.set(5, 5);
const tileMaterial = new THREE.MeshStandardMaterial({ map: tileTexture });

const metalRoughness = new THREE.TextureLoader().load("textures/metal-roughness.png");

//Две геометрических фигуры
const sphereGeometry = new THREE.SphereGeometry(0.5, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
sphereMaterial.emissiveIntensity = 1;
sphereMaterial.roughness = 0.2;
sphereMaterial.metalness = 0.6;
sphereMaterial.metalnessMap = metalRoughness;
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphereMesh.geometry.computeVertexNormals();
sphereMesh.position.set(-2, 0.6, 1);
sphereMesh.castShadow = true;
scene.add(sphereMesh);

const cubeGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xf44336 });
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.position.set(2, 0.5, 1);
cubeMesh.rotateY(degToRad(20));
cubeMesh.castShadow = true;
scene.add(cubeMesh);

//Пол
const floorGeometry = new THREE.BoxGeometry(10, 0.2, 10);
const floorMesh = new THREE.Mesh(floorGeometry, tileMaterial);
floorMesh.receiveShadow = true;
scene.add(floorMesh);

//Профиль дверной коробки
const doorFrameShape = new THREE.Shape();
doorFrameShape.moveTo(0, 0);
doorFrameShape.lineTo(0, 0.01);
doorFrameShape.lineTo(0.05, 0.01);
doorFrameShape.lineTo(0.05, 0.02);
doorFrameShape.lineTo(0.1, 0.02);
doorFrameShape.lineTo(0.1, 0);
doorFrameShape.lineTo(0, 0);

//Профиль наличника
const jambShape = new THREE.Shape();
jambShape.moveTo(0, 0);
jambShape.lineTo(0, 0.005);
jambShape.arc(0.005, 0, 0.005, degToRad(180), degToRad(90), true);
jambShape.lineTo(0.075, 0.02);
jambShape.arc(0, -0.005, 0.005, degToRad(90), degToRad(0), true);
jambShape.lineTo(0.08, 0);
jambShape.lineTo(0, 0);

let wallWithDoorMesh,
  upDoorFrameResultSubtraction,
  leftDoorFrameMesh,
  rightDoorFrameMesh,
  upOuterJambResultSubtraction,
  leftOuterJambMesh,
  rightOuterJambMesh,
  upInnerJambResultSubtraction,
  leftInnerJambMesh,
  rightInnerJambMesh,
  doorMesh,
  upperHinge,
  downHinge;
function draw() {
  scene.remove(wallWithDoorMesh);
  const wallWithDoorShape = new THREE.Shape();
  wallWithDoorShape.moveTo(-5, 0.1);
  wallWithDoorShape.lineTo(-5, 2.7 + 0.1);
  wallWithDoorShape.lineTo(5, 2.7 + 0.1);
  wallWithDoorShape.lineTo(5, 0.1);
  wallWithDoorShape.lineTo(0 + params.width / 1000 / 2, 0.1);
  wallWithDoorShape.lineTo(0 + params.width / 1000 / 2, params.height / 1000 + 0.1);
  wallWithDoorShape.lineTo(0 - params.width / 1000 / 2, params.height / 1000 + 0.1);
  wallWithDoorShape.lineTo(0 - params.width / 1000 / 2, 0.1);
  wallWithDoorShape.lineTo(-5, 0.1);
  const wallWithDoorExtrudeSettings = { depth: 0.1, bevelEnabled: false };
  const wallWithDoorGeometry = new THREE.ExtrudeGeometry(wallWithDoorShape, wallWithDoorExtrudeSettings);
  wallWithDoorMesh = new THREE.Mesh(wallWithDoorGeometry, wallMaterial);
  wallWithDoorMesh.castShadow = true;
  wallWithDoorMesh.receiveShadow = true;
  scene.add(wallWithDoorMesh);

  //Геометрия для вычетания под скос 45 град.
  let topSubtractionShape = new THREE.Shape();
  topSubtractionShape.moveTo(-params.width / 1000 / 2 - 0.1, params.height / 1000 + 0.2);
  topSubtractionShape.lineTo(params.width / 1000 / 2 + 0.1, params.height / 1000 + 0.2);
  topSubtractionShape.lineTo(params.width / 1000 / 2 - 0.1, params.height / 1000);
  topSubtractionShape.lineTo(-params.width / 1000 / 2 + 0.1, params.height / 1000);
  topSubtractionShape.lineTo(-params.width / 1000 / 2 - 0.1, params.height / 1000 + 0.2);
  let topSubtractionExtrudeSettings = { depth: 0.3, bevelEnabled: false };
  let topSubtractionGeometry = new THREE.ExtrudeGeometry(topSubtractionShape, topSubtractionExtrudeSettings);
  topSubtractionGeometry.translate(0, 0, -0.1);
  const topSubstractionBrush = new Brush(topSubtractionGeometry);
  topSubstractionBrush.updateMatrixWorld();

  let leftSubtractionShape = new THREE.Shape();
  leftSubtractionShape.moveTo(-params.width / 1000 / 2 - 0.1, 0.1);
  leftSubtractionShape.lineTo(-params.width / 1000 / 2 - 0.1, params.height / 1000 + 0.2);
  leftSubtractionShape.lineTo(-params.width / 1000 / 2 + 0.1, params.height / 1000);
  leftSubtractionShape.lineTo(-params.width / 1000 / 2 + 0.1, 0.1);
  leftSubtractionShape.lineTo(-params.width / 1000 / 2 - 0.1, 0.1);
  let leftSubtractionExtrudeSettings = { depth: 0.3, bevelEnabled: false };
  let leftSubtractionGeometry = new THREE.ExtrudeGeometry(leftSubtractionShape, leftSubtractionExtrudeSettings);
  leftSubtractionGeometry.translate(0, 0, -0.1);

  let rightSubtractionShape = new THREE.Shape();
  rightSubtractionShape.moveTo(params.width / 1000 / 2 + 0.1, 0.1);
  rightSubtractionShape.lineTo(params.width / 1000 / 2 + 0.1, params.height / 1000 + 0.2);
  rightSubtractionShape.lineTo(params.width / 1000 / 2 - 0.1, params.height / 1000);
  rightSubtractionShape.lineTo(params.width / 1000 / 2 - 0.1, 0.1);
  rightSubtractionShape.lineTo(params.width / 1000 / 2 + 0.1, 0.1);
  let rightSubtractionExtrudeSettings = { depth: 0.3, bevelEnabled: false };
  let rightSubtractionGeometry = new THREE.ExtrudeGeometry(rightSubtractionShape, rightSubtractionExtrudeSettings);
  rightSubtractionGeometry.translate(0, 0, -0.1);

  //Дверная коробка
  scene.remove(upDoorFrameResultSubtraction);
  let upDoorFrameExtrudeSettings = { depth: params.width / 1000, bevelEnabled: false };
  let upDoorFrameGeometry = new THREE.ExtrudeGeometry(doorFrameShape, upDoorFrameExtrudeSettings);
  upDoorFrameGeometry.translate(-0.1, -params.height / 1000 - 0.1, -params.width / 1000 / 2);
  upDoorFrameGeometry.rotateY(degToRad(90));
  upDoorFrameGeometry.rotateZ(degToRad(180));
  const upDoorFrameOperation = new Operation(upDoorFrameGeometry);
  const upDoorFrameFirstSubtraction = new Operation(leftSubtractionGeometry);
  upDoorFrameFirstSubtraction.operation = SUBTRACTION;
  upDoorFrameOperation.add(upDoorFrameFirstSubtraction);
  const upDoorFrameSecondSubtraction = new Operation(rightSubtractionGeometry);
  upDoorFrameSecondSubtraction.operation = SUBTRACTION;
  upDoorFrameOperation.add(upDoorFrameSecondSubtraction);
  upDoorFrameResultSubtraction = evaluator.evaluateHierarchy(upDoorFrameOperation);
  upDoorFrameResultSubtraction.material = kendalMaterial;
  scene.add(upDoorFrameResultSubtraction);

  scene.remove(leftDoorFrameMesh);
  let leftDoorFrameExtrudeSettings = { depth: params.height / 1000, bevelEnabled: false };
  let leftDoorFrameGeometry = new THREE.ExtrudeGeometry(doorFrameShape, leftDoorFrameExtrudeSettings);
  leftDoorFrameGeometry.translate(-0.1, -params.width / 1000 / 2, -params.height / 1000 - 0.1);
  leftDoorFrameGeometry.rotateX(degToRad(90));
  leftDoorFrameGeometry.rotateY(degToRad(90));
  const leftDoorFrameBrush = new Brush(leftDoorFrameGeometry);
  leftDoorFrameBrush.updateMatrixWorld();
  leftDoorFrameMesh = evaluator.evaluate(leftDoorFrameBrush, topSubstractionBrush, SUBTRACTION);
  leftDoorFrameMesh.material = kendalMaterial;
  scene.add(leftDoorFrameMesh);

  scene.remove(rightDoorFrameMesh);
  let rightDoorFrameExtrudeSettings = { depth: params.height / 1000, bevelEnabled: false };
  let rightDoorFrameGeometry = new THREE.ExtrudeGeometry(doorFrameShape, rightDoorFrameExtrudeSettings);
  rightDoorFrameGeometry.translate(-0.1, -params.width / 1000 / 2, 0.1);
  rightDoorFrameGeometry.rotateX(degToRad(270));
  rightDoorFrameGeometry.rotateY(degToRad(90));
  const rightDoorFrameBrush = new Brush(rightDoorFrameGeometry);
  rightDoorFrameBrush.updateMatrixWorld();
  rightDoorFrameMesh = evaluator.evaluate(rightDoorFrameBrush, topSubstractionBrush, SUBTRACTION);
  rightDoorFrameMesh.material = kendalMaterial;
  scene.add(rightDoorFrameMesh);

  const verticalJambExtrudeSettings = { depth: params.width / 1000 + 0.08 * 2, bevelEnabled: false };
  const horizontalJambExtrudeSettings = { depth: params.height / 1000 + 0.08, bevelEnabled: false };

  scene.remove(upOuterJambResultSubtraction);
  const upOuterJambGeometry = new THREE.ExtrudeGeometry(jambShape, verticalJambExtrudeSettings);
  upOuterJambGeometry.translate(params.height / 1000 + 0.1 - 0.01, 0.1, -params.width / 1000 / 2 - 0.08);
  upOuterJambGeometry.rotateY(degToRad(90));
  upOuterJambGeometry.rotateX(degToRad(90));
  const upOuterJumbOperation = new Operation(upOuterJambGeometry);
  const upOuterJambFirstSubtraction = new Operation(leftSubtractionGeometry);
  upOuterJambFirstSubtraction.operation = SUBTRACTION;
  upOuterJumbOperation.add(upOuterJambFirstSubtraction);
  const upOuterJambSecondSubtraction = new Operation(rightSubtractionGeometry);
  upOuterJambSecondSubtraction.operation = SUBTRACTION;
  upOuterJumbOperation.add(upOuterJambSecondSubtraction);
  upOuterJambResultSubtraction = evaluator.evaluateHierarchy(upOuterJumbOperation);
  upOuterJambResultSubtraction.material = kendalMaterial;
  scene.add(upOuterJambResultSubtraction);

  scene.remove(leftOuterJambMesh);
  const leftOuterJambGeometry = new THREE.ExtrudeGeometry(jambShape, horizontalJambExtrudeSettings);
  leftOuterJambGeometry.translate(params.width / 1000 / 2 - 0.01, 0.1, 0.1);
  leftOuterJambGeometry.rotateX(degToRad(270));
  leftOuterJambGeometry.rotateY(degToRad(180));
  const leftOuterJambBrush = new Brush(leftOuterJambGeometry);
  leftOuterJambBrush.updateMatrixWorld();
  leftOuterJambMesh = evaluator.evaluate(leftOuterJambBrush, topSubstractionBrush, SUBTRACTION);
  leftOuterJambMesh.material = kendalMaterial;
  scene.add(leftOuterJambMesh);

  scene.remove(rightOuterJambMesh);
  const rightOuterJambGeometry = new THREE.ExtrudeGeometry(jambShape, horizontalJambExtrudeSettings);
  rightOuterJambGeometry.translate(params.width / 1000 / 2 - 0.01, 0.1, -params.height / 1000 - 0.1 - 0.08);
  rightOuterJambGeometry.rotateX(degToRad(90));
  const rightOuterJambBrush = new Brush(rightOuterJambGeometry);
  rightOuterJambBrush.updateMatrixWorld();
  rightOuterJambMesh = evaluator.evaluate(rightOuterJambBrush, topSubstractionBrush, SUBTRACTION);
  rightOuterJambMesh.material = kendalMaterial;
  scene.add(rightOuterJambMesh);

  scene.remove(upInnerJambResultSubtraction);
  const upInnerJambGeometry = new THREE.ExtrudeGeometry(jambShape, verticalJambExtrudeSettings);
  upInnerJambGeometry.translate(params.height / 1000 + 0.1 - 0.02, 0, -params.width / 1000 / 2 - 0.08);
  upInnerJambGeometry.rotateX(degToRad(270));
  upInnerJambGeometry.rotateZ(degToRad(90));
  const upInnerJumbOperation = new Operation(upInnerJambGeometry);
  const upInnerJambFirstSubtraction = new Operation(leftSubtractionGeometry);
  upInnerJambFirstSubtraction.operation = SUBTRACTION;
  upInnerJumbOperation.add(upInnerJambFirstSubtraction);
  const upInnerJambSecondSubtraction = new Operation(rightSubtractionGeometry);
  upInnerJambSecondSubtraction.operation = SUBTRACTION;
  upInnerJumbOperation.add(upInnerJambSecondSubtraction);
  upInnerJambResultSubtraction = evaluator.evaluateHierarchy(upInnerJumbOperation);
  upInnerJambResultSubtraction.material = kendalMaterial;
  scene.add(upInnerJambResultSubtraction);

  scene.remove(leftInnerJambMesh);
  const leftInnerJambGeometry = new THREE.ExtrudeGeometry(jambShape, horizontalJambExtrudeSettings);
  leftInnerJambGeometry.translate(params.width / 1000 / 2 - 0.02, 0, 0.1);
  leftInnerJambGeometry.rotateX(degToRad(270));
  const leftInnerJambBrush = new Brush(leftInnerJambGeometry);
  leftInnerJambBrush.updateMatrixWorld();
  leftInnerJambMesh = evaluator.evaluate(leftInnerJambBrush, topSubstractionBrush, SUBTRACTION);
  leftInnerJambMesh.material = kendalMaterial;
  scene.add(leftInnerJambMesh);

  scene.remove(rightInnerJambMesh);
  const rightInnerJambGeometry = new THREE.ExtrudeGeometry(jambShape, horizontalJambExtrudeSettings);
  rightInnerJambGeometry.translate(params.width / 1000 / 2 - 0.02, 0, -params.height / 1000 - 0.1 - 0.08);
  rightInnerJambGeometry.rotateX(degToRad(90));
  rightInnerJambGeometry.rotateY(degToRad(180));
  const rightInnerJambBrush = new Brush(rightInnerJambGeometry);
  rightInnerJambBrush.updateMatrixWorld();
  rightInnerJambMesh = evaluator.evaluate(rightInnerJambBrush, topSubstractionBrush, SUBTRACTION);
  rightInnerJambMesh.material = kendalMaterial;
  scene.add(rightInnerJambMesh);

  scene.remove(doorMesh);
  const doorGeometry = new THREE.BoxGeometry(params.width / 1000 - 0.03, params.height / 1000 - 0.02, 0.04);
  doorGeometry.translate(0, params.height / 1000 / 2 + 0.1 - 0.005, 0.075);
  doorMesh = new THREE.Mesh(doorGeometry, kendalMaterial);
  doorMesh.castShadow = true;
  scene.add(doorMesh);

  scene.remove(upperHinge);
  scene.remove(downHinge);
  const hingeGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.1, 16);
  const hingeMaterial = new THREE.MeshBasicMaterial({ color: "gray" });
  upperHinge = new THREE.Mesh(hingeGeometry, hingeMaterial);
  upperHinge.position.set(params.width / 1000 / 2 - 0.02, params.height / 1000 + 0.1 - 0.3 + 0.05, 0.104);
  downHinge = new THREE.Mesh(hingeGeometry, hingeMaterial);
  downHinge.position.set(params.width / 1000 / 2 - 0.02, 0.1 + 0.3 + 0.05, 0.104);
  scene.add(upperHinge);
  scene.add(downHinge);
}

function run() {
  requestAnimationFrame(run);
  controls.update();
  renderer.render(scene, camera);
}

draw();
run();