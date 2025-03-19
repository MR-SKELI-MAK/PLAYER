// Set up scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.5, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a loading manager
const loadingManager = new THREE.LoadingManager();

let model; // Declare the model variable

// Load background texture (1231.jpg)
const textureLoader = new THREE.TextureLoader(loadingManager); // Use loading manager
textureLoader.load('1231.jpg', function (texture) {
    scene.background = texture;
    console.log("Background Loaded", texture); // Debugging
});

// Load the glTF model (adjust the path if necessary)
const loader = new THREE.GLTFLoader(loadingManager); // Use loading manager
loader.load('model/scene.gltf', function (gltf) {
    model = gltf.scene; // Assign the loaded scene to the model variable
    console.log("Model Loaded", gltf); // Debugging
    gltf.scene.rotation.y = Math.PI; // Rotate 180 degrees around Y-axis
    scene.add(gltf.scene);

    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());

    // Adjust model position to center
    gltf.scene.position.x += (gltf.scene.position.x - center.x);
    gltf.scene.position.y += (gltf.scene.position.y - center.y);
    gltf.scene.position.z += (gltf.scene.position.z - center.z);

    // Scale the model
    gltf.scene.scale.set(1.5, 1.5, 1.5); // Increase size by 50%

}, undefined, function (error) {
    console.error(error);
});

// Add lights
const ambientLight = new THREE.AmbientLight(0xCC99FF); // Lighter Purple Ambient Light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // White light
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Set camera position
camera.position.z = 5;

// Mouse tracking variables
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// Invisible plane for raycasting (ADJUSTED HERE!)
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -4.5); // Adjust the -3 to -4.5.
const intersectPoint = new THREE.Vector3();

// Function to handle mouse movement
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 4 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 4 + 1;
  
   
window.addEventListener('mousemove', onMouseMove, false);

// Smoothing factor (INCREASED EVEN MORE!)
const rotationSpeed = 5; // Increased from 0.1 to 0.15

// Add Simple Heading
const heading = document.createElement('h1');
heading.textContent = "ITZ_ME_SZANluvSWK!";
heading.style.position = 'absolute';
heading.style.top = '20px'; // Adjust position as needed
heading.style.left = '50%';
heading.style.transform = 'translateX(-50%)'; // Center horizontally
heading.style.zIndex = '2'; // Ensure it's above the canvas
heading.style.fontSize = '5em'; // Increase font size (adjust as needed)
document.body.appendChild(heading);



// Animation loop
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        // Update the raycaster with the mouse position
        raycaster.setFromCamera(mouse, camera);

        // Intersect the ray with the plane
        raycaster.ray.intersectPlane(plane, intersectPoint);

        // Calculate the target angle
        const targetAngle = Math.atan2(intersectPoint.x - model.position.x, intersectPoint.z - model.position.z) + Math.PI;

        // Smoothly interpolate between the current rotation and the target angle
        model.rotation.y += (targetAngle - model.rotation.y) * rotationSpeed;
    }

    renderer.render(scene, camera);
   
}
animate();
