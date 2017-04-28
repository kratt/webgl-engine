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

Pixel.Core.Renderer.Camera = function(viewPort, fov)
{
    this.viewPort = viewPort;
    this.fov = fov;
    this.aspect = viewPort.x / viewPort.y;
    this.zoom = -55.0;   // lorenz: zoom = -55
    //this.rotate = new vec3(-24.4, -83.9, 0.0);

    // lorenz
    this.rotate = new vec3(-17.0, -83.0, 0.0);
}

// Shortcut
Pixel.Camera = Pixel.Core.Renderer.Camera;
Camera = Pixel.Core.Renderer.Camera;

Pixel.Core.Renderer.Camera.prototype = {

    currentPerspective : function()
    {
        var projection =  new mat4().perspective(this.fov, this.aspect, 1.0, 1000);
        var translate = new mat4().translateByVector(new vec3(0.0, 0.0, this.zoom));
        var rot_x = new mat4().rotateX(this.rotate.x);
        var rot_y = new mat4().rotateY(this.rotate.y);

        var view =  rot_y.multiply(rot_x.multiply(translate));
        //var view = translate.multiply(rot_y).multiply(rot_x);

      //  var view = (translate.multiply(rot_x)).multiply(rot_y);

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
