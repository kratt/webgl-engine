/**
 * Particle system.
 *
 * @author Julian Kratt
 */

/**
 * Constructor.
 * @constructor
 */


Pixel.Core.Renderer.ParticleSystemImage = function(openGLContext, img)
{
    this.gl = openGLContext;
    this.img = img;

    console.log(this.img.width + " " + this.img.height);

    // set number of particles to number of pixels
    this.numParticles  = this.img.width * this.img.height;
    this.buffer_width  = this.img.width;
    this.buffer_height = this.img.height;

    console.log("Particle System Buffer width: " + this.buffer_width + " height: " + this.buffer_height);

    this.texSprite = this.loadTexture("webgl_engine/Data/Textures/particle - Copy.png");

    this.cam = new Camera(new vec2(1, 1), 45.0, 1.0, 1000.0);
    this.cam.setRotation(new vec3(0, 0.0, 0.0));
    this.cam.setZoom(-500);

    this.vboParticles = null;
    this.vboQuad      = null;

    this.fbo1 = null;
    this.fbo2 = null;

    this.texPos = null;
    this.texColor = null;

    this.shaderParticles      = null;
    this.shaderUpdateParticles = null;

    this.initRender = true;
    this.flipFlop = 1;

    this.resetTime = 0.0;

    this.updateTime = 0.1;
    this.curAnimationTime = 0.0;
    this.animationSpeed = 1.0;

    this.center = new vec3(0.0, 0.0, 0.0); //-25.0);

    this.init();
}

// Shortcut
Pixel.ParticleSystemImage = Pixel.Core.Renderer.ParticleSystemImage;
ParticleSystemImage = Pixel.Core.Renderer.ParticleSystemImage;

Pixel.Core.Renderer.ParticleSystemImage.prototype = {

    init : function()
    {
        this.createFBOs();
        this.createVBOParticles();
        this.createVBOScreenSizeQuad();
        this.createTextures();
        this.createShaders();
    },

    createShaders : function()
    {
        this.shaderParticles       = new Pixel.Core.OpenGL.Shader(this.gl, "webgl_engine/Data/Shader/ParticleSystem/ParticlesImage.vert.glsl", "webgl_engine/Data/Shader/ParticleSystem/ParticlesImage.frag.glsl");
        this.shaderUpdateParticles = new Pixel.Core.OpenGL.Shader(this.gl, "webgl_engine/Data/Shader/ParticleSystem/ParticlesImageUpdate.vert.glsl", "webgl_engine/Data/Shader/ParticleSystem/ParticlesImageUpdate.frag.glsl");
    },

    createFBOs : function()
    {
        this.fbo1 = new Pixel.FrameBufferObject(this.gl, this.buffer_width, this.buffer_height, 1, 0, this.gl.FALSE, this.gl.NEAREST);
        this.fbo2 = new Pixel.FrameBufferObject(this.gl, this.buffer_width, this.buffer_height, 1, 0, this.gl.FALSE, this.gl.NEAREST);
    },

    createTextures : function()
    {
        // init positions of particles
        var posData = new Float32Array(this.buffer_width * this.buffer_height * 4);

        var scale = 2.25;
        for(var y=0; y<this.buffer_height; ++y)
        {
            for(var x=0; x<this.buffer_width; ++x)
            {
                var i = 4 * (y*this.buffer_width + x);

                posData[i]   = scale*(x - 0.5*this.buffer_width);
                posData[i+1] = scale*(y - 0.5*this.buffer_height);
                posData[i+2] = 0.0;
                posData[i+3] = 1.0;
            }
        }

        // build position texture
        this.texPos = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texPos);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.buffer_width, this.buffer_height, 0, this.gl.RGBA, this.gl.FLOAT, posData);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
/*
        var numRed = 0;
        var colData = new Float32Array(this.buffer_width * this.buffer_height * 4);
        for(var y=0; y<this.buffer_height; ++y)
        {
            for(var x=0; x<this.buffer_width; ++x)
            {
                var i = 4 * (y*this.buffer_width + x);

                if(x < 2) {
                    colData[i] = 1.0;
                    colData[i + 1] = 0.0;
                    colData[i + 2] = 0.0;
                    colData[i + 3] = 1.0;
                    numRed++;
                }
                else
                {
                    colData[i] = 0.0;
                    colData[i + 1] = 1.0;
                    colData[i + 2] = 0.0;
                    colData[i + 3] = 1.0;
                }
            }
        }
*/
      //  console.log(this.img);
        this.texColor = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texColor);
        this.gl.texImage2D( this.gl.TEXTURE_2D, 0,  this.gl.RGBA,  this.gl.RGBA,  this.gl.UNSIGNED_BYTE, this.img);
        //this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.buffer_width, this.buffer_height, 0, this.gl.RGBA, this.gl.FLOAT, colData);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
       // this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
      //  this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    },

    createVBOParticles : function()
    {
        var unitX = 1.0/this.buffer_width;
        var unitY = 1.0/this.buffer_height;

        var nrVertices = this.buffer_width * this.buffer_height;

        console.log("Particle System Nr. Vertices: " + nrVertices);

        var attrData = new Array();

        var idxX = unitX / 2.0;
        var idxY = unitY / 2.0;

        for(var i=0; i<nrVertices; ++i)
        {
            if(idxX > 1.0)
            {
                idxX = unitX / 2.0;
                idxY += unitY;
            }

            var tx = idxX;
            var ty = idxY;

           //console.log(tx + " " + ty);
            attrData.push(0.0); // vx
            attrData.push(0.0); // vy
            attrData.push(0.0); // vz
            attrData.push(0.0); // vw

            attrData.push(0.0); // nx
            attrData.push(0.0); // ny
            attrData.push(0.0); // nz
            attrData.push(0.0); // nw

            attrData.push(0.0); // cx
            attrData.push(0.0); // cy
            attrData.push(0.0); // cz
            attrData.push(0.0); // cw

            attrData.push(tx);  // tx
            attrData.push(ty);  // ty
            attrData.push(0.0); // tz
            attrData.push(0.0); // tw

            idxX += unitX;
        }

        this.vboParticles = new Pixel.Core.OpenGL.VertexBufferObject(this.gl);

        this.vboParticles.setData(attrData, this.gl.STATIC_DRAW,  nrVertices, this.gl.POINTS);
        this.vboParticles.addAttrib(VERTEX_POSITION);
        this.vboParticles.addAttrib(VERTEX_NORMAL);
        this.vboParticles.addAttrib(VERTEX_COLOR);
        this.vboParticles.addAttrib(VERTEX_TEXTURE);
        this.vboParticles.bindAttribs();
    },

    createVBOScreenSizeQuad : function()
    {
        var mi = new vec3(0.0, 0.0, 0.0);
        var ma = new vec3(this.buffer_width, this.buffer_height, 0.0);

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

    updateParticles : function()
    {
        if(this.flipFlop == 1)
            this.fbo1.bind();

        if(this.flipFlop == 2)
            this.fbo2.bind();

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.buffer_width, this.buffer_height);

        this.gl.disable(this.gl.BLEND);

         var model      = new mat4().translateByVector(new vec3(0, 0, 0));
         var view       = new mat4().translateByVector(new vec3 (0, 0, -1));
         var projection = new mat4().orthographic(0, this.buffer_width, this.buffer_height, 0, -1, 1);

         this.shaderUpdateParticles.bind();

         this.shaderUpdateParticles.setMatrix("matProjection", projection, false);
         this.shaderUpdateParticles.setMatrix("matView", view, false);
         this.shaderUpdateParticles.setMatrix("matModel", model, false);

        if(this.flipFlop == 1)
        {
            if(this.initRender)
            {
                this.gl.activeTexture(this.gl.TEXTURE4);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.texPos); //position 1 // first 4 coordinates
            }
            else
            {
                this.gl.activeTexture(this.gl.TEXTURE4);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo2.texAtt0); //position 1 // first 4 coordinates
            }
        }
        else if(this.flipFlop == 2)
        {
            this.gl.activeTexture(this.gl.TEXTURE4);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo1.texAtt0); //position 1 // first 4 coordinates
        }

        this.shaderUpdateParticles.seti("texPos", 4);

        this.gl.activeTexture(this.gl.TEXTURE5);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texColor);
        this.shaderUpdateParticles.seti("texColor", 5);

        this.shaderUpdateParticles.setf("curAnimationTime", this.curAnimationTime);

            this.vboQuad.render();

        this.shaderUpdateParticles.release();

        if(this.flipFlop == 1)
        {
            this.fbo1.release();
            this.flipFlop = 2;
        }
        else if(this.flipFlop == 2)
        {
            this.fbo2.release();
            this.flipFlop = 1;
        }

        if(this.initRender)
            this.initRender = false;
    },

    render : function(fps)
    {
        if(fps > 0) {
            var delta = this.updateTime / fps * this.animationSpeed
            this.curAnimationTime += delta;
        }

        this.updateParticles();

        var trans = this.cam.currentPerspective();
        var model =  new mat4().translateByVector(this.center);

        this.gl.viewport(0, 0, this.cam.viewPort.x, this.cam.viewPort.y);
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        this.gl.disable(this.gl.BLEND);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);


        this.shaderParticles.bind();

        if(this.flipFlop == 2){
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo1.texAtt0);
        }
        else{
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo2.texAtt0);
        }

        this.shaderParticles.seti("texPos", 1);

        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texColor);
        this.shaderParticles.seti("texColor", 2);


        this.shaderParticles.setMatrix("matProjection", trans.projection, false);
        this.shaderParticles.setMatrix("matView", trans.view, false);
        this.shaderParticles.setMatrix("matModel", model, false);

            this.vboParticles.render();

        this.shaderParticles.release();
    },

    resetParticlePos : function()
    {
        this.resetTime = 1.0;
    },

    loadTexture : function(src)
    {
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        var tmpGl = this.gl;
        var image = new Image();
        image.src = src;
        image.onload = function() {
            tmpGl.bindTexture(tmpGl.TEXTURE_2D, texture);
            tmpGl.texImage2D(tmpGl.TEXTURE_2D, 0, tmpGl.RGBA, tmpGl.RGBA, tmpGl.UNSIGNED_BYTE,
                image);
             };
        return texture;
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
};

