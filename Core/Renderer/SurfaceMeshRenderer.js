/**
 * Responsible for rendering. Creates the actual context.
 *
 * @author Julian Kratt
 */


/**
 *
 * @param openGLContext gl context
 * @param file Obj file name
 * @constructor
 */
Pixel.Core.Renderer.SurfaceMeshRenderer = function(openGLContext, file)
{
   this.gl = openGLContext;
   this.surface = new SurfaceMesh(openGLContext);
   this.surface.loadObj(file)

    this.cam = new Camera(new vec2(1, 1), 45.0, 0.1, 15.0);
    this.cam.setRotation(new vec3(-17.0, -83.0, 0.0));
    this.cam.setZoom(-1);

}

// Shortcut
Pixel.SurfaceMeshRenderer = Pixel.Core.Renderer.SurfaceMeshRenderer;
SurfaceMeshRenderer = Pixel.Core.Renderer.SurfaceMeshRenderer;

 Pixel.Core.Renderer.SurfaceMeshRenderer.prototype =
 {

    render : function(camera)
    {
        this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0.0, 0.0, this.cam.viewPort.x, this.cam.viewPort.y);

        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.surface.render(this.cam);
    },

     resize : function(width, height)
     {
         this.cam.update(width, height);
     },

     onMouseWheel : function(delta)
     {
         this.cam.onMouseWheel(delta);
     },

     onMouseMove : function(dx, dy)
     {
         this.cam.onMouseMove(dx, dy, 0);
     }

} ;

