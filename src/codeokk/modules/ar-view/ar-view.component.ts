import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

@Component({
  selector: "app-ar-view",
  templateUrl: "./ar-view.component.html",
  styleUrls: ["./ar-view.component.css"],
})
export class ArViewComponent implements OnInit {
  @ViewChild("rendererCanvas", { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;
  roomImage: string = "";
  carpetImage: string = "";
  rotationAngle: number = 0;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private carpet?: THREE.Object3D; // Use Object3D for FBX model
  private raycaster!: THREE.Raycaster;
  private mouse!: THREE.Vector2;
  private isDragging: boolean = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.roomImage = decodeURIComponent(params["roomImage"]);
      this.carpetImage = decodeURIComponent(params["carpetImage"]);
      this.initThreeJS();
    });
  }

  private initThreeJS() {
    this.scene = new THREE.Scene();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    const roomTexture = new THREE.TextureLoader().load(this.roomImage);
    const roomPlane = new THREE.PlaneGeometry(16, 9);
    const roomMaterial = new THREE.MeshBasicMaterial({
      map: roomTexture,
      side: THREE.DoubleSide,
    });
    const roomMesh = new THREE.Mesh(roomPlane, roomMaterial);
    this.scene.add(roomMesh);

    // Load FBX model
    const loader = new FBXLoader();
    loader.load("assets/Doormat.fbx", (fbx) => {
      console.log(fbx);
      this.carpet = fbx;
      this.carpet.position.set(0, 0, 0.01); // Set initial position
      this.scene.add(this.carpet);

      // Optionally, scale or rotate the model as needed
      // this.carpet.scale.set(0.1, 0.1, 0.1);
      // this.carpet.rotation.y = Math.PI / 2;
    });

    console.log(this.carpet);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.rendererCanvas.nativeElement,
      alpha: true, // Enable transparency
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0); // Set clear color to black with 0 opacity

    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
      this.update();
    });

    // Event listeners for mouse interaction
    this.rendererCanvas.nativeElement.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this),
      false
    );
    this.rendererCanvas.nativeElement.addEventListener(
      "mouseup",
      this.onMouseUp.bind(this),
      false
    );
    this.rendererCanvas.nativeElement.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
  }

  update() {
    if (this.isDragging && this.carpet) {
      // Update carpet position based on mouse movement
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.carpet);
      if (intersects.length > 0) {
        const intersection = intersects[0];
        this.carpet.position.copy(intersection.point);
      }
    }

    // Update carpet rotation based on slider value
    if (this.carpet) {
      this.carpet.rotation.z = THREE.MathUtils.degToRad(this.rotationAngle);
    }
  }

  onMouseDown(event: MouseEvent) {
    event.preventDefault();
    this.isDragging = true;
    this.mouse.x =
      (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
    this.mouse.y =
      -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
  }

  onMouseUp(event: MouseEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent) {
    event.preventDefault();
    if (this.isDragging) {
      this.mouse.x =
        (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
      this.mouse.y =
        -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
    }
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  rotateCarpet() {
    // This method is called when the slider value changes
    // No need to implement the rotation logic here, it's handled in the update method
  }
}
