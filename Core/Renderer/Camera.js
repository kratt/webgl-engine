/**
 * Camera implementation.
 *
 * @author Julian Kratt
 */

/**
 * Constructor.
 * @constructor
 */

Transformation = function()
{
    this.view           = new mat4().setToIdentity();
    this.projection     = new mat4().setToIdentity();
    this.viewProjection = new mat4().setToIdentity();
}

Pixel.Core.Renderer.Camera = function(viewPort, fov, ncp, fcp)
{
    this.viewPort = viewPort;
    this.fov = fov;
    this.aspect = viewPort.x / viewPort.y;
    this.zoom = 0.0;
    this.rotate = new vec3(0.0, 0.0, 0.0);
    this.ncp = ncp;
    this.fcp = fcp;
}

// Shortcut
Pixel.Camera = Pixel.Core.Renderer.Camera;
Camera = Pixel.Core.Renderer.Camera;

Pixel.Core.Renderer.Camera.prototype = {

    currentPerspective : function()
    {
        var projection =  new mat4().perspective(this.fov, this.aspect, this.ncp, this.fcp);
        var translate = new mat4().translateByVector(new vec3(0.0, 0.0, this.zoom));
        var rot_x = new mat4().rotateX(this.rotate.x);
        var rot_y = new mat4().rotateY(this.rotate.y);

       // var view =  rot_y.multiply(rot_x.multiply(translate));
        //var view = translate.multiply(rot_y).multiply(rot_x);

        var view = (translate.multiply(rot_x)).multiply(rot_y);2015

        var trans = new Transformation();
        trans.view = view;
        trans.projection = projection;
        trans.viewProjection = projection.multiply(view);

        return trans;
    },

    update : function(width, height)
    {
      this.viewPort.x = width;
      this.viewPort.y = height;
      this.aspect = width / height;
    },

    setZoom : function(z)
    {
        this.zoom = z;
    },

    setRotation : function(rot)
    {
        this.rotate = rot;
    },

    onMouseMove : function(dx, dy, button)
    {
        this.rotate.x -= (0.1 * dy);
        this.rotate.y -= (0.1 * dx);
    },

    onMouseWheel : function(delta)
    {
        if(delta == 0)
            return;

        var tmp = this.zoom * 0.1;

        if (delta > 0)
            this.zoom += tmp;
        else
            this.zoom -= tmp;
    }
};
