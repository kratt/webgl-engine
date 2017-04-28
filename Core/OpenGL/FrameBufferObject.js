/**
 * Framebuffer Object.
 *
 * @author Julian Kratt
 */


Pixel.Core.OpenGL.FrameBufferObject = function(gl, width, height, nrTexAtt, nrBufferAtt, attachDepthTex, filter)
{
    this.gl = gl;
    this.height = height;
    this.width = width;
    this.nrTexAtt = nrTexAtt;
    this.nrBufferAtt = nrBufferAtt;
    this.attachDepthTex = attachDepthTex;
    this.filter = filter;

    this.texAtt0 = -1;

    this.fboID = -1;

    if ( !gl.getExtension( 'OES_texture_float' ) ) alert( 'Float textures not supported' );

    this.init();
};


// Shortcut
Pixel.FrameBufferObject = Pixel.Core.OpenGL.FrameBufferObject;

Pixel.Core.OpenGL.FrameBufferObject.prototype = {

    init : function()
    {
        this.fboID = this.gl.createFramebuffer();

        for(var i=0; i<this.nrTexAtt; ++i)
        {
            this.createTexAttachment(this.gl.COLOR_ATTACHMENT0 + i, this.gl.RGBA, this.gl.RGBA, this.gl.FLOAT);
        }
    },

    createTexAttachment : function(attachment, iFormat, format, type)
    {
        var texID = this.emptyTexture(this.width, this.height, iFormat, format, type);

        this.texAtt0 = texID;

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fboID);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, attachment, this.gl.TEXTURE_2D, texID, 0);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    },

    emptyTexture : function(width, height, iformat, format, type)
    {
        var ret = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, ret);
        this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, 1);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, iformat, width, height, 0, format, type, this.randomData());

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.filter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.filter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        return ret;
    },

    bind : function()
    {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fboID);
    },

    release : function()
    {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    },

    randomData : function()
    {
      var data = new Float32Array(this.width * this.height * 4);

      var maxSize = this.width * this.height * 4;

        var min = -500.0;
        var max =  500.0;

        for(var y=0; y<this.height; ++y)
        {
            for(var x=0; x<this.width; ++x)
            {
                var i = 4 * (y*this.width + x);

                data[i]   = (Math.random() * (max - min)) + min;;
                data[i+1] = (Math.random() * (max - min)) + min;;
                data[i+2] = (Math.random() * (max - min)) + min;;
                data[i+3] = 1.0;
            }
        }
       return data;
    }

};