/**
 * @author Julian Kratt
 *
 * RayMarching implementation.
 *
 */


Pixel.Core.Renderer.RayMarching = function(openGLContext)
{
   this.gl = openGLContext;

   this.shader  = null;
   this.vboQuad = null;

   this.width  = window.innerWidth;
   this.height = window.innerHeight;
   this.aspect = this.width / this.height;

   this.startTime = (new Date).getTime();

    // ray marching parameters
    this.animationSpeed = 0.3;
    this.modifier = 3.0;
    this.numIterations = 4.0;
    this.isAnimated = true;

    this.updateTime = 1.0;
    this.curAnimationTime = 0.0;

   this.init();
}

// Shortcut
Pixel.RayMarching = Pixel.Core.Renderer.RayMarching;
RayMarching =  Pixel.Core.Renderer.RayMarching;


Pixel.Core.Renderer.RayMarching.prototype =
{
    init : function()
    {
        this.createShaders();
        this.createVBOScreenSizeQuad();
    },

    createShaders : function()
    {
        this.shader  = new Pixel.Core.OpenGL.Shader(this.gl, 'ray_marching_simple_scene');
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

    render : function(camera, fps)
    {
        if(fps > 0 && this.isAnimated)
            this.curAnimationTime += this.updateTime / fps * this.animationSpeed;

        if(this.curAnimationTime > 1.0)
            this.curAnimationTime = 0.0;


        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.gl.viewport(0, 0, this.width, this.height);

        this.gl.disable(this.gl.BLEND);

        var time = new Date().getTime() - this.startTime;

        var translate = new mat4().translateByVector(new vec3(0.0, 0.0, cam.zoom));
        var rot_x = new mat4().rotateX(cam.rotate.x);
        var rot_y = new mat4().rotateY(cam.rotate.y);

        var camView = rot_y.multiply(rot_x.multiply(translate));
        this.shader.bind();
        this.shader.setMatrix("matCamView", camView, false);

        this.shader.setf("windowWidth",  window.innerWidth);
        this.shader.setf("windowHeight", window.innerHeight);
        this.shader.setf("curAnimationTime", this.curAnimationTime);
        this.shader.setf("modifier", this.modifier);
        this.shader.setf("numIterations", this.numIterations);
        this.shader.seti("isAnimated", this.isAnimated);

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
    },

    onMouseMove : function(dx, dy)
    {

    }
};