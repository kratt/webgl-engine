/**
 * Represents a vertex buffer object. Used to render the mesh of an object.
 *
 * @author Julian Kratt
 */

var VERTEX_POSITION  = 0;
var VERTEX_NORMAL    = 1;
var VERTEX_COLOR     = 2;
var VERTEX_TEXTURE   = 3;

Pixel.Core.OpenGL.DATA = function()
{
    var vx, vy, vz, vw;
    var nx, ny, nz, nw;
    var cx, cy, cz, cw;
    var tx, ty, tz, tw;
}

 Pixel.Core.OpenGL.VertexBufferObject = function(gl)
 {
     this.gl = gl;

     this.nrVertices    = 0;
     this.nrIndices     = 0;
     this.bufferId      = 0;
     this.indexBufferId = 0;
     this.sizeAsStride  = 0;
     this.nrDynamicIndices = 0;
     this.primitiveMode = this.gl.POINTS;
     this.usage = this.gl.STATIC_DRAW;

     this.dynamicRender  = false;
     this.useIndexBuffer = false;

     this.attribLocations = new Array();
 };


// Shortcut
Pixel.VBO = Pixel.Core.OpenGL.VertexBufferObject;

Pixel.Core.OpenGL.VertexBufferObject.prototype = {

    create : function(target, data, usage)
    {
       /* var dataArray = new Array();
        // prepare data
        for(var i=0; i<data.length; ++i)
        {
            var tmp = data[i].array();
            dataArray = dataArray.concat(tmp);
        }
            */
        var vbo = this.gl.createBuffer();
        this.gl.bindBuffer(target, vbo);
        this.gl.bufferData(target, new Float32Array(data), usage);

        for(var i=0; i<this.attribLocations.length; ++i)
        {
            var attribLoc = this.attribLocations[i];
            this.gl.enableVertexAttribArray(attribLoc);
        }


        this.gl.bindBuffer(target, null);

        return vbo;
    },


    setData : function(data, usage, nrVertices, primitiveMode)
    {
        //this.sizeAsStride = 4);
        //this.sizeBytesVertices = m_sizeAsStride * nrVertices;
        this.primitiveMode = primitiveMode;
        this.usage = usage;
        this.nrVertices = nrVertices;
        this.nrDynamicVertices = nrVertices;

        this.bufferId = this.create(this.gl.ARRAY_BUFFER, data, usage);

        this.tmp();
    },


    addAttrib : function(attrib)
    {
      this.attribLocations.push(attrib);
    },

   bindAttribs : function()
   {
       this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferId);

       for(var i=0; i<this.attribLocations.length; ++i)
       {
           var attribLoc = this.attribLocations[i];
           this.gl.vertexAttribPointer(attribLoc, 4, this.gl.FLOAT, false, 64, 16 * i);
       }

       this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
   },

    tmp : function()
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferId);

        for(var i=0; i<this.attribLocations.length; ++i)
        {
            var attribLoc = this.attribLocations[i];
            this.gl.vertexAttribPointer(attribLoc, 4, this.gl.FLOAT, false, 64, 16 * i);
        }

        for(var i=0; i<this.attribLocations.length; ++i)
        {
            var attribLoc = this.attribLocations[i];
            this.gl.enableVertexAttribArray(attribLoc);
        }
    },

    render : function()
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.bufferId);


        for(var i=0; i<this.attribLocations.length; ++i)
        {
            var attribLoc = this.attribLocations[i];
            this.gl.vertexAttribPointer(attribLoc, 4, this.gl.FLOAT, false, 64, 16 * i);
        }

        for(var i=0; i<this.attribLocations.length; ++i)
        {
            var attribLoc = this.attribLocations[i];
            this.gl.enableVertexAttribArray(attribLoc);
        }

        this.gl.drawArrays(this.primitiveMode, 0, this.nrVertices);
    }

};

