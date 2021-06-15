var sc = document.querySelector('canvas'),
    txt = document.querySelector('input'),
    lsp = document.getElementById('lsp'),
    gl = sc.getContext('webgl');
sc.width = sc.height = window.innerWidth;

// init classes
let glh = new GLScriptHandler(gl),
    global = new GlobalGL(gl);

// make program
let program = glh.makeProgramFromPair(glh.pairShaders());
gl.useProgram(program);

// setup window
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.viewport(0, 0, sc.width, sc.height);
gl.clearColor(0, 0, 0, 1);

// define object
let obj = new GlObj(gl, program, sphere, {
  list:{
    vertices:{
      size: 3,
      name: 'coordinates'
    },
    texCoord:{
      size: 2,
      name: 'texpos'
    },
    normals:{
      size: 3,
      name: 'normals'
    },
    indexes:{
      size: 3,
      index: true
    }
  }
});
obj.init();

// set Textures
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
global.setSamplersWithImages([
  {
    url: './earthDay.png',
    number: 0,
    location: 'imageDay'
  },
  {
    url: './earthNight.png',
    number: 1,
    location: 'imageNight'
  }
  ], program);

// print fps
let fps = 0;
setInterval(()=>
{
  txt.value = fps;
  fps = 0;
}, 1000);

// get locations
let langLoc = gl.getUniformLocation(program, 'lAngle'),
    eangLoc = gl.getUniformLocation(program, 'eAngle'),
    lightLoc = gl.getUniformLocation(program, 'lightPos');

// controls
var px = 0, py = 0, vx = 0, vy = 0, angleX = 0, angleY = 0, langleY = 0, lchange = 0.05;
document.addEventListener('touchstart',(event)=>
{
  px = event.touches[0].clientX;
  py = event.touches[0].clientY;
});
document.addEventListener('touchmove',(event)=>
{
  vx = px - event.touches[0].clientX;
  vy = py - event.touches[0].clientY;
  let hyp = (vx**2 + vy**2)**0.5;
  vx /= hyp;
  vy /= hyp;
});
document.addEventListener('touchend',()=>
{
  vx = vy = 0;
});

// set sun
gl.uniform3f(lightLoc, 9, 5, 1);

// animation loop
function animate()
{
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(langLoc, langleY);
  gl.uniform2f(eangLoc, angleX, angleY);
  obj.draw();
  fps++;
  angleY += vx;
  angleX += vy;
  langleY -= lchange;
  requestAnimationFrame(animate);
}
animate();