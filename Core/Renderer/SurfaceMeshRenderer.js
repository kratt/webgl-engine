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
Pixel.Core.Renderer.SurfaceMeshRenderer = function(openGLContext)
{
    this.filePaths = ['webgl_engine/Data/Objs/gnome/Dwarf_2_Low.obj',
                      'webgl_engine/Data/Objs/head/head.obj'];

    this.gl = openGLContext;

    this.surfaces = [];
    for(var idx in this.filePaths)
    {
        var surface = new SurfaceMesh(openGLContext);
        surface.loadObj(this.filePaths[idx]);
        this.surfaces.push(surface);
    }

    this.cam = new Camera(new vec2(1, 1), 45.0, 0.01, 15.0);
    this.cam.setRotation(new vec3(-10.0, 0.0, 0.0));
    this.cam.setZoom(-0.35)

    this.activeModel = 0;
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

        this.surfaces[this.activeModel].render(this.cam);
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

