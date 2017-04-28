/**
 * Responsible for rendering. Creates the actual context.
 *
 * @author Julian Kratt
 */

Pixel.Core.Renderer.renderParams = function()
{
    var fps;
};


/**
 * Constructor.
 * @param width Width of the canvas.
 * @param height Height of the canvas.
 * @param renderParams Parameters for the rendering.
 * @constructor
 */
Pixel.Core.Renderer.Renderer = function(width, height, renderParams)
{
    this.width = width;
    this.height = height;
    this.renderParams = renderParams || {};
    this.renderParams.fps = 0.0;
    this.gameOfLife = null;
    /**
     * @description The WebGL canvas DOM Element
     * @type DOMNode
     */
    this.canvas = null;

    /**
     * @description The WebGL context
     * @type WebGLContext
     */
    this.gl = null;

    this.fpsTimeLast = Date.now() / 1000;
    this.init();
}

// Shortcut
Pixel.Renderer = Pixel.Core.Renderer.Renderer;

/**
 * Initializes the rendering context.
 */
 Pixel.Core.Renderer.Renderer.prototype =
 {
    init : function()
    {

     this.renderParams = new Pixel.Core.Renderer.renderParams();

     this.canvas = document.getElementById("canvas");

     try {

         this.gl = this.canvas.getContext('experimental-webgl');

         this.canvas.width = this.width;
         this.canvas.height = this.height;
         this.gl.viewport(0, 0, this.width, this.height);

         var size = this.gl.getParameter(this.gl.SAMPLES);
         console.log("webGL Context Antialiaing: " + size + " samples.");

         this.gl.enable(this.gl.DEPTH_TEST);
         this.gl.clearDepth(1.0);
         this.gl.depthFunc(this.gl.LEQUAL);

         this.gl.enable(this.gl.BLEND);
         this.gl.enable(this.gl.DEPTH_TEST);
         this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);// this.gl.ONE_MINUS_SRC_ALPHA);//this.gl.ONE);

         this.camera = null;

     } catch (exception) {
         console.error("WebGL Context Creation Failed");
     }

        this.surface = new SurfaceMesh(this.gl);
        this.surface.loadObj("webgl_engine/Data/Objs/head/head.obj")

        //this.gameOfLife = new GameOfLife(this.gl, this.width, this.height);
    }  ,


    render : function(camera)
    {
        /*this.camera = camera;

        this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0.0, 0.0, camera.viewPort.x, camera.viewPort.y);

        this.surface.render(this.camera);
       // this.particleSystem.render(camera, this.renderParams);
       // this.fractal.render(camera);
       */

        var fpsTimeCurrent = Date.now() / 1000;
        var elapsedTime = fpsTimeCurrent - this.fpsTimeLast;

        this.gameOfLife.render(this.renderParams);

        this.fpsTimeLast = fpsTimeCurrent;

        this.renderParams.fps = 1 / elapsedTime;

        document.title =  this.renderParams.fps;
    },

    getCanvas : function()
     {
         return this.canvas;
     }

} ;

