/**
 * @author Julian Kratt
 *
 * Visualization of the Mandelbrot set.
 *
 */

Pixel.Core.Renderer.Mandelbrot = function(openGLContext)
{
   this.gl = openGLContext;

   this.shader  = null;
   this.vboQuad = null;

   this.width  = window.innerWidth;
   this.height = window.innerHeight;
   this.aspect = this.width / this.height;

   this.mouseX = -1;
   this.mouseY = -1;

   this.minRe = -1.5;
   this.maxRe =  0.7;

   this.minIm = -1.0;
   this.maxIm =  1.0;

    this.center = new vec2( (this.maxRe + this.minRe) / 2.0, (this.maxIm + this.minIm) / 2.0);

    this.init();
}

// Shortcut
Pixel.Mandelbrot = Pixel.Core.Renderer.Mandelbrot;
Mandelbrot =  Pixel.Core.Renderer.Mandelbrot;


Pixel.Core.Renderer.Mandelbrot.prototype =
{
    init : function()
    {
        this.createShaders();
        this.createVBOScreenSizeQuad();
    },

    createShaders : function()
    {
        this.shader  = new Pixel.Core.OpenGL.Shader(this.gl, "webgl_engine/Data/Shader/Fractals/Mandelbrot.vert.glsl", "webgl_engine/Data/Shader/Fractals/Mandelbrot.frag.glsl");
    },

    createVBOScreenSizeQuad : function()
    {
        var mi = new vec3(0.0, 0.0, 0.0);
        var ma = new vec3(this.width, this.height, 0.0);

        var d = 0.1;

        var vertices   = new Array();
        var normals    = new Array();
        var texCoords  = new Array();

        vertices.push(new vec3(mi.x, mi.y, d));
        vertices.push(new vec3(ma.x, mi.y, d));
        vertices.push(new vec3(mi.x, ma.y, d));
        vertices.push(new vec3(ma.x, ma.y, d));

        normals.push(new vec3(0.0, 1.0, 0.0));
        normals.push(new vec3(0.0, 1.0, 0.0));
        normals.push(new vec3(0.0, 1.0, 0.0));
        normals.push(new vec3(0.0, 1.0, 0.0));

        texCoords.push(new vec3(0.0, 0.0, 0.0));
        texCoords.push(new vec3(1.0, 0.0, 0.0));
        texCoords.push(new vec3(0.0, 1.0, 0.0));
        texCoords.push(new vec3(1.0, 1.0, 0.0));

        var nrVertices = vertices.length;
        var attrData = new Array();

        for(var i=0; i<nrVertices; ++i)
        {
            var v = vertices[i];
            var n = normals[i];
            var t = texCoords[i];

            attrData.push(v.x);
            attrData.push(v.y);
            attrData.push(v.z);
            attrData.push(1.0);

            attrData.push(n.x);
            attrData.push(n.y);
            attrData.push(n.z);
            attrData.push(1.0);

            attrData.push(0.0); // cx
            attrData.push(0.0); // cy
            attrData.push(0.0); // cz
            attrData.push(0.0); // cw

            attrData.push(t.x); // tx
            attrData.push(t.y); // ty
            attrData.push(0.0); // tz
            attrData.push(0.0); // tw
        }

        this.vboQuad = new Pixel.Core.OpenGL.VertexBufferObject(this.gl);

        this.vboQuad.setData(attrData, this.gl.STATIC_DRAW,  nrVertices, this.gl.TRIANGLE_STRIP);
        this.vboQuad.addAttrib(VERTEX_POSITION);
        this.vboQuad.addAttrib(VERTEX_NORMAL);
        this.vboQuad.addAttrib(VERTEX_COLOR);
        this.vboQuad.addAttrib(VERTEX_TEXTURE);
        this.vboQuad.bindAttribs();
    },

    render : function(renderParams)
    {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.viewport(0, 0, this.width, this.height);

        this.gl.disable(this.gl.BLEND);


        var model      = new mat4().translateByVector(new vec3(0, 0, 0));
        var view       = new mat4().translateByVector(new vec3 (0, 0, -1));
        var projection = new mat4().orthographic(0, this.width, this.height, 0, -1, 1);

        this.shader.bind();

        this.shader.setMatrix("matProjection", projection, false);
        this.shader.setMatrix("matView", view, false);
        this.shader.setMatrix("matModel", model, false);


        this.shader.setf("windowWidth",  this.width);
        this.shader.setf("windowHeight", this.height);

        this.shader.setf("minRe", this.minRe);
        this.shader.setf("maxRe", this.maxRe);
        this.shader.setf("minIm", this.minIm);
        this.shader.setf("maxIm", this.maxIm);

        this.shader.setf("scaleX", this.aspect);
        this.shader.setf("scaleY", (this.maxRe - this.minRe) / (this.maxIm - this.minIm));

            this.vboQuad.render();

        this.shader.release();
    },


    resize : function(width, height)
    {
        this.width  = width;
        this.height = height;
        this.aspect = width / height;

        this.createVBOScreenSizeQuad();
    },

    onMouseWheel : function(mouseX, mouseY, delta)
    {
       if(delta == 0)
            return;

       /* mouseX /= window.innerWidth;
        mouseY /= window.innerHeight;

        mouseY = (1.0 - mouseY);   // invert y coord.

        var targetCenterMovement = 0.05;

        // determine new center doing linear interpolation of intervals
        var distRe = (this.maxRe - this.minRe);
        var distIm = (this.maxIm - this.minIm);


        var relAmount = 0.1;
        var amountRe = distRe * relAmount;
        var amountIm = distIm * relAmount;

        if (delta < 0)
        {
            var targetCenterX = this.minRe + mouseX*distRe;
            var targetCenterY = this.minIm + mouseY*distIm;

            var targetDir = new vec2(targetCenterX - this.center.x, targetCenterY - this.center.y);
            var len = targetDir.length();
            targetDir.normalize();

            var newCenterX = this.center.x + targetCenterMovement * targetDir.x;
            var newCenterY = this.center.y + targetCenterMovement * targetDir.y;

            this.minRe = newCenterX - distRe/2.0;
            this.maxRe = newCenterX + distRe/2.0;

            this.minIm = newCenterY - distIm/2.0;
            this.maxIm = newCenterY + distIm/2.0;

            this.center.x = newCenterX;
            this.center.y = newCenterY;

            this.minRe += amountRe;
            this.maxRe -= amountRe;

            this.minIm += amountIm;
            this.maxIm = this.minIm + (this.maxRe - this.minRe) * window.innerWidth / window.innerHeight;
        }
        else
        {
            this.minRe -= amountRe;
            this.maxRe += amountRe;

            this.minIm -= amountIm;
            this.maxIm = this.minIm + (this.maxRe - this.minRe) * window.innerWidth / window.innerHeight;
        }

        */


        var distRe = (this.maxRe - this.minRe);
        var distIm = (this.maxIm - this.minIm);

        var relAmount = 0.1;
        var amountRe = distRe * relAmount;
        var amountIm = distIm * relAmount;

        if (delta < 0)
        {
            this.minRe += amountRe;
            this.maxRe -= amountRe;

            this.minIm += amountIm;
            this.maxIm = this.minIm + (this.maxRe - this.minRe) * window.innerWidth / window.innerHeight;
        }
        else
        {
            this.minRe -= amountRe;
            this.maxRe += amountRe;

            this.minIm -= amountIm;
            this.maxIm = this.minIm + (this.maxRe - this.minRe) * window.innerWidth / window.innerHeight;
        }

    },

    onMouseMove : function(dx, dy)
    {
        var dir = new vec2(dx, dy);
        var len = dir.length();
        dir.normalize();

        dx /= window.innerWidth;
        dy /= window.innerHeight;


        var distRe = (this.maxRe - this.minRe);
        var distIm = (this.maxIm - this.minIm);

        var amountRe = distRe * dx;
        var amountIm = distIm * dy;

        this.minRe -= amountRe;
        this.maxRe -= amountRe;

        this.minIm += amountIm;
        this.maxIm += amountIm;

    }
};