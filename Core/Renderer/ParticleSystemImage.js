/**
 * Particle system.
 *
 * @author Julian Kratt
 */

/**
 * Constructor.
 * @constructor
 */

Pixel.Core.Renderer.ParticleSystemImage = function(openGLContext)
{
  this.gl = openGLContext;
    this.imgData = null;

    var img = new Image();
    img.src = "webgl_engine/Data/Textures/pexels-photo-351773.png";

    this.imgLoaded = false;
    img.onload = function(){
        // get pixel data
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0 );
        this.imgData = context.getImageData(0, 0, img.width, img.height);

        imgLoaded = true;
    }

    this.intVal = setInterval(this.init(), 1000);




}

// Shortcut
Pixel.ParticleSystemImage = Pixel.Core.Renderer.ParticleSystemImage;
ParticleSystemImage = Pixel.Core.Renderer.ParticleSystemImage;

Pixel.Core.Renderer.ParticleSystemImage.prototype = {

    init : function()
    {
        if(!this.imgLoaded)
        return;

        this.intVal = null;

        this.numParticles  = this.imgData.width * this.imgData.height;
        this.buffer_width  = this.imgData.width;
        this.buffer_height = this.imgData.height;


        console.log("Particle System Buffer width: " + this.buffer_width + " height: " + this.buffer_height);

        this.cam = new Camera(new vec2(1, 1), 45.0, 1.0, 1000);
        this.cam.setRotation(new vec3(-17.0, -83.0, 0.0));
        this.cam.setZoom(-55);

        this.texSprite = this.loadTexture("webgl_engine/Data/Textures/particle.png");

        this.vboParticles = null;
        this.vboQuad      = null;

        this.fbo1 = null;
        this.fbo2 = null;

        this.texPos      = null;
        this.texLifeTime = null;

        this.shaderParticles      = null;
        this.shaderUpdateParticles = null;

        this.initRender = true;
        this.flipFlop = 1;

        this.resetTime = 0.0;

        this.center = new vec3(0.0, 0.0, 0.0); //-25.0);

        // lorenz system parameters
        this.Beta = 8.0/3.0;
        this.Rho = 28.0;
        this.Sigma = 10.0;
        this.Delta = 0.001;

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

        var scale = 0.25;

        for(var y=0; y<this.buffer_height; ++y)
        {
            for(var x=0; x<this.buffer_width; ++x)
            {
                var i = 4 * (y*this.buffer_width + x);

                posData[i]   = scale*(x - 0.5*this.buffer_width);
                posData[i+1] = scale*(y - 0.5*this.buffer_height);
                posData[i+2] = 0.0;
                posData[i+3] = 0.0; // lifetime of particle
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


        // life time of particles
        var lifeTimeData = new Float32Array(this.buffer_width * this.buffer_height * 4);

        min =  0.2;
        max =  1.0;

        for(var y=0; y<this.buffer_height; ++y)
        {
            for(var x=0; x<this.buffer_width; ++x)
            {
                var i = 4 * (y*this.buffer_width + x);

                lifeTimeData[i]   = (Math.random() * (max - min)) + min;
                lifeTimeData[i+1] = 0.0;
                lifeTimeData[i+2] = 0.0;
                lifeTimeData[i+3] = 0.0;
            }
        }

        // build life time texture
        this.texLifeTime = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texLifeTime);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.buffer_width, this.buffer_height, 0, this.gl.RGBA, this.gl.FLOAT, lifeTimeData);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

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

    updateBuffers : function()
    {
        this.buffer_width  = Math.floor(Math.sqrt(this.numParticles));
        this.buffer_height = Math.floor(Math.sqrt(this.numParticles));

        console.log("Particle System Buffer width: " + this.buffer_width + " height: " + this.buffer_height);

        // delete previous buffers and textures
        this.gl.deleteFramebuffer(this.fbo1.fboID);
        this.gl.deleteFramebuffer(this.fbo2.fboID);
        this.gl.deleteTexture(this.texPos);
        this.gl.deleteTexture(this.texLifeTime);

        this.gl.deleteBuffer(this.vboParticles.bufferId);
        this.gl.deleteBuffer(this.vboQuad.bufferId);
        // init buffers and textures with new size
        this.createFBOs();
        this.createVBOParticles();
        this.createVBOScreenSizeQuad();
        this.createTextures();

        this.initRender = true;
        this.flipFlop = 1;
    },

    updateParticles : function(renderParams)
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

        // static life time of particles
        this.gl.activeTexture(this.gl.TEXTURE5);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texLifeTime);
        this.shaderUpdateParticles.seti("texLifeTime", 5);

        // initial particle positions
        this.gl.activeTexture(this.gl.TEXTURE6);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texPos);
        this.shaderUpdateParticles.seti("texInitPos", 6);

        this.shaderUpdateParticles.setf("Sigma", this.Sigma);
        this.shaderUpdateParticles.setf("Beta",  this.Beta);
        this.shaderUpdateParticles.setf("Rho",   this.Rho);
        this.shaderUpdateParticles.setf("Delta", this.Delta);

        // reset particles ?
        if(this.resetTime > 0)
        {
           this.resetTime -=  0.01;
        }

        this.shaderUpdateParticles.setf("resetTime", this.resetTime);

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

    render : function(renderParams)
    {
        this.updateParticles(renderParams);

        var trans = this.cam.currentPerspective();
        var model =  new mat4().translateByVector(this.center);

        this.gl.viewport(0, 0, this.cam.viewPort.x, this.cam.viewPort.y);
        this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);


        this.gl.enable(this.gl.BLEND);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
      //  this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);


        this.shaderParticles.bind();

        if(this.flipFlop == 1){
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo1.texAtt0);
        }
        else{
            this.gl.activeTexture(this.gl.TEXTURE1);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo1.texAtt0);
        }

        this.shaderParticles.seti("texPos", 1);

        this.gl.activeTexture(this.gl.TEXTURE2);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texSprite);
        this.shaderParticles.seti("texSprite", 2);


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

    getImageData : function(src)
    {


        /*
        var rgb = new Array();
        for(var y=0; y<img.height; ++y)
        {
            for(var x=0; x<img.width; ++x)
            {
                var idx = 4*(img.width*y + x);
                var r = data[idx];
                var g = data[idx+1]
                var b = data[idx+2];

                rgb.push(new vec3(r, g, b));

            }
        }
        */
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

