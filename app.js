import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import * as dat from "dat.gui";
import { gsap } from "gsap";

 
export default class sketch {
    constructor(options)
    {   

        this.scene = new THREE.Scene();
	    //this.camera.position.z = 1;
	    //this.scene = new THREE.Scene();
        //this.addMesh();
        //this.time = 0;
        //this.render();
        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer = new THREE.WebGL1Renderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xeeeeee, 1);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        this.container.appendChild( this.renderer.domElement );


        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth/ window.innerHeight,
            0.001,
            1000
        );

        this.camera.position.set(0, 0, 2);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.time = 0;

        this.isPlaying = true;
        //this.addObjects();

        this.addObjects();
        this.resize();
        this.render();
        this.setupResize();
        //this.settings();

    }

    settings(){
        let that = this;
        this.settings = {
            progress: 0,
        };
        this.gui = new dat.GUI();
        this.gui.add(this.settings, "progress", 0,1,0.01);
    }

    setupResize(){
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize(){
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;



        // image cover
        this.imageAspect = 853/1280;
        let a1; let a2;
        if(this.height/this.width>this.imageAspect){
            a1 = (this.width/this.height) * this.imageAspect;
            a2 = 1;
        } else {
            a1 = 1;
            a2 = (this.height/this.width) / this.imageAspect;
        }


        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        this.camera.updateProjectionMatrix();
    }

    addObjects() {
        let that = this;
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: "#extension GL_OES_standard_derivatives : enable"
            },
            side: THREE.DoubleSide,
            uniforms: {
                time:{ type: "f", value: 0 },
                resolution: {type: "v4", value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                }
            },

            //wireframe: true,
            //transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment
        });

        this.geometry = new THREE.IcosahedronBufferGeometry(1, 1);

        this.ico = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.ico );

    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        if(! this.isPlaying){
            this.render()
            this.isPlaying = true; 
        }
    }

    render() {
        if(! this.isPlaying) return;
        this.time += 0.001;
        this.scene.rotation.x = this.time;
        this.scene.rotation.y = this.time;
        this.material.uniforms.time.value = this.time;
        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

}
    new sketch({
        dom: document.getElementById("container")
    });




    

 
 	

	

 
