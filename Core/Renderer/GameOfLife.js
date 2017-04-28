/**
 * Game of Life
 *
 * @author Julian Kratt
 */

/**
 * Constructor.
 * @constructor
 */

Pixel.Core.Renderer.GameOfLife = function(openGLContext, windowWidth, windowHeight)
{
  this.gl = openGLContext;
  this.windowWidth  = windowWidth;
  this.windowHeight = windowHeight;

  console.log("Game of Life. Screen dims: " + this.windowWidth + " " + this.windowHeight);

  this.vboQuad = null;

  this.fbo1 = null;
  this.fbo2 = null;
  this.texGrid = null;

  this.shaderGrid       = null;
  this.shaderGridUpdate = null;
  this.shaderInteraction = null;

  this.initRender = true;
  this.flipFlop = 1;

  this.mousePos = new vec2(0.0,  0.0);
  this.curInteractionRadius = 0.0;
  this.maxInteractionradius = 100.0;
  this.applyInteraction = false;


  this.updateTime = 10.01;
  this.curUpdateGridTime = 0.0;
  this.curUpdateInteractionTime = 0.0;

  this.init();
}

// Shortcut
Pixel.GameOfLife = Pixel.Core.Renderer.GameOfLife;
GameOfLife = Pixel.Core.Renderer.GameOfLife;

Pixel.Core.Renderer.GameOfLife.prototype = {

    init : function()
    {
        this.createFBOs();
        this.createVBOScreenSizeQuad();
        this.createTexture();
        this.createShaders();
    },

    createShaders : function()
    {
        this.shaderGrid        = new Pixel.Core.OpenGL.Shader(this.gl, 'game_of_life_grid');
        this.shaderGridUpdate  = new Pixel.Core.OpenGL.Shader(this.gl, 'game_of_life_grid_update');
        this.shaderInteraction = new Pixel.Core.OpenGL.Shader(this.gl, 'game_of_life_interaction');
    },

    createFBOs : function()
    {
        this.fbo1 = new Pixel.FrameBufferObject(this.gl, this.windowWidth, this.windowHeight, 1, 0, this.gl.FALSE, this.gl.NEAREST);
        this.fbo2 = new Pixel.FrameBufferObject(this.gl, this.windowWidth, this.windowHeight, 1, 0, this.gl.FALSE, this.gl.NEAREST);
    },

    createTexture : function()
    {
        // init positions of particles
        var grid = new Float32Array(this.windowWidth * this.windowHeight * 4);

        for(var y=0; y<this.windowHeight; ++y)
        {
            for(var x=0; x<this.windowWidth; ++x)
            {
                var i = 4 * (y*this.windowWidth + x);

                var val_r = Math.random() < 0.3 ? 0.0 : 1.0;
                var val_g = Math.random() < 0.3 ? 0.0 : 1.0;
                var val_b = Math.random() < 0.3 ? 0.0 : 1.0;

                grid[i]   = val_r;
                grid[i+1] = val_g;
                grid[i+2] = val_b;
                grid[i+3] =  1.0;
            }
        }

        // build position texture
        this.texGrid = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texGrid);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.windowWidth, this.windowHeight, 0, this.gl.RGBA, this.gl.FLOAT, grid);

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    },

    createVBOScreenSizeQuad : function()
    {
        var mi = new vec3(0.0, 0.0, 0.0);
        var ma = new vec3(this.windowWidth, this.windowHeight, 0.0);

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

    updateGrid : function(renderParams)
    {
        if(this.flipFlop == 1)
            this.fbo1.bind();

        if(this.flipFlop == 2)
            this.fbo2.bind();

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.windowWidth, this.windowHeight);

        this.gl.disable(this.gl.BLEND);


         var model      = new mat4().translateByVector(new vec3(0, 0, 0));
         var view       = new mat4().translateByVector(new vec3 (0, 0, -1));
         var projection = new mat4().orthographic(0, this.windowWidth, this.windowHeight, 0, -1, 1);


         this.shaderGridUpdate.bind();

         this.shaderGridUpdate.setMatrix("matProjection", projection, false);
         this.shaderGridUpdate.setMatrix("matView", view, false);
         this.shaderGridUpdate.setMatrix("matModel", model, false);


        if(this.flipFlop == 1)
        {
            if(this.initRender)
            {
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.texGrid); // init game of life grid
            }
            else
            {
                this.gl.activeTexture(this.gl.TEXTURE0);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo2.texAtt0);
            }
        }
        else if(this.flipFlop == 2)
        {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo1.texAtt0);
        }

        this.shaderGridUpdate.seti("texGrid", 0);
        this.shaderGridUpdate.setf("windowWidth", this.windowWidth);
        this.shaderGridUpdate.setf("windowHeight", this.windowHeight);
        this.shaderGridUpdate.seti("applyInteraction", this.applyInteraction);
        this.shaderGridUpdate.setf("curInteractionRadius", this.curInteractionRadius);
        this.shaderGridUpdate.set2f("mousePos", this.mousePos.x, this.mousePos.y);

            this.vboQuad.render();

         this.shaderGridUpdate.release();


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

    updateInteraction : function()
    {
        var model      = new mat4().translateByVector(new vec3(0, 0, 0));
        var view       = new mat4().translateByVector(new vec3 (0, 0, -1));
        var projection = new mat4().orthographic(0, this.windowWidth, this.windowHeight, 0, -1, 1);


        if(this.flipFlop == 1)
        {
            this.fbo2.bind();
        }
        else if(this.flipFlop == 2)
        {
            this.fbo1.bind();
        }


        this.shaderInteraction.bind();

        this.shaderInteraction.setMatrix("matProjection", projection, false);
        this.shaderInteraction.setMatrix("matView", view, false);
        this.shaderInteraction.setMatrix("matModel", model, false);


        this.shaderInteraction.setf("windowWidth", this.windowWidth);
        this.shaderInteraction.setf("windowHeight", this.windowHeight);
        this.shaderInteraction.seti("applyInteraction", this.applyInteraction);
        this.shaderInteraction.setf("curInteractionRadius", this.curInteractionRadius);
        this.shaderInteraction.set2f("mousePos", this.mousePos.x, this.mousePos.y);

        this.vboQuad.render();

        this.shaderInteraction.release();

        if(this.flipFlop == 1)
        {
            this.fbo2.release();
        }
        else if(this.flipFlop == 2)
        {
            this.fbo1.release();
        }
    },

    update : function(renderParams)
    {
        if(renderParams.fps > 0)
            this.curUpdateGridTime += this.updateTime / renderParams.fps;

        //console.log( this.curUpdateTime);
        if(this.curUpdateGridTime > 1.0)
        {
            this.updateGrid(renderParams);
            this.curUpdateGridTime = 0.0;
        }

        if(this.applyInteraction)
        {
            if(this.curInteractionRadius < this.maxInteractionradius)
            {
                this.curInteractionRadius += 1;
                this.updateInteraction();
            }
            else
            {
                this.applyInteraction = false;
            }
        }
    },

    render : function(renderParams)
    {
        this.update(renderParams);

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.windowWidth, this.windowHeight);

        var model      = new mat4().translateByVector(new vec3(0, 0, 0));
        var view       = new mat4().translateByVector(new vec3 (0, 0, -1));
        var projection = new mat4().orthographic(0, this.windowWidth, this.windowHeight, 0, -1, 1);

        this.shaderGrid.bind();

        if(this.flipFlop == 1){
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo1.texAtt0);
        }
        else{
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.fbo2.texAtt0);
        }

        this.shaderGrid.seti("texGrid", 0);
        this.shaderGrid.setf("windowWidth", this.windowWidth);
        this.shaderGrid.setf("windowHeight", this.windowHeight);

        this.shaderGrid.setMatrix("matProjection", projection, false);
        this.shaderGrid.setMatrix("matView", view, false);
        this.shaderGrid.setMatrix("matModel", model, false);

            this.vboQuad.render();

        this.shaderGrid.release();
    },

    setMousePos : function(xPos, yPos)
    {
        this.mousePos = new vec2(xPos, yPos);
        this.applyInteraction = true;
        this.curInteractionRadius = 0.0;
        console.log("Mouse pos: " + this.mousePos.toString());
    }
};

