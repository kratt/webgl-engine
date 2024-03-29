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
   this.coloring = 0;

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

        this.shader.bind();

        this.shader.setf("windowWidth",  this.width);
        this.shader.setf("windowHeight", this.height);

        this.shader.setf("minRe", this.minRe);
        this.shader.setf("maxRe", this.maxRe);
        this.shader.setf("minIm", this.minIm);
        this.shader.setf("maxIm", this.maxIm);

        this.shader.setf("scaleX", this.aspect);
        this.shader.setf("scaleY", (this.maxRe - this.minRe) / (this.maxIm - this.minIm));

        this.shader.seti("coloring", this.coloring);

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

        var focusRe = mouseX * (this.maxRe - this.minRe) + this.minRe;
        var focusIm = mouseY * (this.maxIm - this.minIm) + this.minIm;
        var zoomAmount = 0.05;

        //console.log(focusRe + " " + focusIm);

        if(delta < 0)
        {
            this.minRe = this.minRe + zoomAmount * (focusRe - this.minRe);
            this.maxRe = this.maxRe - zoomAmount * (this.maxRe - focusRe);

            this.minIm = this.minIm + zoomAmount * (focusIm - this.minIm);
            this.maxIm = this.maxIm - zoomAmount * (this.maxIm - focusIm);
        }
        else
        {
            this.minRe = this.minRe - zoomAmount * (focusRe - this.minRe);
            this.maxRe = this.maxRe + zoomAmount * (this.maxRe - focusRe);

            this.minIm = this.minIm - zoomAmount * (focusIm - this.minIm);
            this.maxIm = this.maxIm + zoomAmount * (this.maxIm - focusIm);
        }
    },

    onMouseMove : function(dx, dy)
    {
        dx /= this.width;
        dy /= this.height;

        var distRe = (this.maxRe - this.minRe);
        var distIm = (this.maxIm - this.minIm);

        var amountRe = distRe * dx;
        var amountIm = distIm * dy;

        this.minRe -= amountRe;
        this.maxRe -= amountRe;

        this.minIm += amountIm;
        this.maxIm += amountIm;
    },


    anmiate : function()
    {
        return;
        // disable automatic zooming

        var focusRe = -0.6340429702092076;
        var focusIm =  0.0000011354700868633244;

        var zoomAmount = 0.005;

        this.minRe = this.minRe + zoomAmount * (focusRe - this.minRe);
        this.maxRe = this.maxRe - zoomAmount * (this.maxRe - focusRe);

        this.minIm = this.minIm + zoomAmount * (focusIm - this.minIm);
        this.maxIm = this.maxIm - zoomAmount * (this.maxIm - focusIm);
    }
};