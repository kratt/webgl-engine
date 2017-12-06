/**
 * Shader class.
 *
 * @author Julian Kratt
 */

Pixel.Core.OpenGL.Shader = function(openGLContext, vShaderPath, fShaderPath)
{
    var vShaderCode = this.loadShaderSrc(vShaderPath);
    var fShaderCode = this.loadShaderSrc(fShaderPath);

    /*
    if(file == 'default')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/default/Default.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/default/Default.frag.glsl");
    }

    if(file == 'meshsurface_simple_phong')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/SurfaceMesh/SimplePhong.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/SurfaceMesh/SimplePhong.frag.glsl");
    }

    if(file == 'particles')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/ParticleSystem/Particles.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/ParticleSystem/Particles.frag.glsl");
    }

    if(file == 'particles_euler_lorenz')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/ParticleSystem/EulerLorenz.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/ParticleSystem/EulerLorenz.frag.glsl");
    }

    if(file == 'particles_attractor')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/ParticleSystem/UpdateParticlesAttractor.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/ParticleSystem/UpdateParticlesAttractor.frag.glsl");
    }

    if(file == 'fractal_mandelbrot')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/webgl_engine/Data/Shader/Fractals/Mandelbrot.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/webgl_engine/Data/Shader/Fractals/Mandelbrot.frag.glsl");
    }

    if(file == 'ray_marching_simple_scene')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/RayMarching/RMSimpleScene.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/RayMarching/RMSimpleScene.frag.glsl");
    }

    if(file == 'game_of_life_grid')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/GameOfLife/GoLGrid.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/GameOfLife/GoLGrid.frag.glsl");
    }

    if(file == 'game_of_life_grid_update')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/GameOfLife/GoLGridUpdate.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/GameOfLife/GoLGridUpdate.frag.glsl");
    }

    if(file == 'game_of_life_interaction')
    {
        vShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/GameOfLife/GoLInteraction.vert.glsl");
        fShaderCode = this.loadShaderSrc("webgl_engine/Data/Shader/GameOfLife/GoLInteraction.frag.glsl");
    }
    */
    this.gl = openGLContext;
    this.webGLProgramObject = this.gl.createProgram();


    // create vertex shader
    var vShader = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vShader, vShaderCode);
    this.gl.compileShader(vShader);
    this.gl.attachShader(this.webGLProgramObject, vShader);


    // create fragment shader
    var fShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fShader, fShaderCode);
    this.gl.compileShader(fShader);
    this.gl.attachShader(this.webGLProgramObject, fShader);

    this.bindAttribLocations();
    this.gl.linkProgram(this.webGLProgramObject);
    // link shader

    console.log("SHADER::Attrib: Position " + this.gl.getAttribLocation(this.webGLProgramObject, "Position"));
    console.log("SHADER::Attrib: Normal "   + this.gl.getAttribLocation(this.webGLProgramObject, "Normal"));
    console.log("SHADER::Attrib: Color "    + this.gl.getAttribLocation(this.webGLProgramObject, "Color"));
    console.log("SHADER::Attrib: Texture "  + this.gl.getAttribLocation(this.webGLProgramObject, "Texture"));

    // check errors
   if (!this.gl.getShaderParameter(vShader, this.gl.COMPILE_STATUS))
       alert(this.gl.getShaderInfoLog(vShader));

    if (!this.gl.getShaderParameter(fShader, this.gl.COMPILE_STATUS))
        console.log(this.gl.getShaderInfoLog(fShader));

    if (!this.gl.getProgramParameter(this.webGLProgramObject, this.gl.LINK_STATUS))
        console.log(this.gl.getProgramInfoLog(this.webGLProgramObject));
};


Pixel.Core.OpenGL.Shader.prototype = {

    bind : function()
    {
        this.gl.useProgram(this.webGLProgramObject);
    },

    release : function()
    {
       this.gl.useProgram(null);
    },

    id : function()
    {
        return this.webGLProgramObject;
    },

    bindAttribLocation : function(label, attribID)
    {
        this.gl.bindAttribLocation(this.webGLProgramObject, attribID, label);
    },

    // bind locations before linking!!
    bindAttribLocations : function()
    {
        this.bindAttribLocation("Position", VERTEX_POSITION);
        this.bindAttribLocation("Normal",   VERTEX_NORMAL);
        this.bindAttribLocation("Color",    VERTEX_COLOR);
        this.bindAttribLocation("Texture",  VERTEX_TEXTURE);
    },

   seti : function(label, arg)
   {
     this.gl.uniform1i(this.gl.getUniformLocation(this.id(), label), arg);
   },

    setf : function(label, arg)
    {
        this.gl.uniform1f(this.gl.getUniformLocation(this.id(), label), arg);
    },

    set2f : function(label, arg1, arg2)
    {
        this.gl.uniform2f(this.gl.getUniformLocation(this.id(), label), arg1, arg2);
    },

    set3f : function(label, v)
    {
        this.gl.uniform3f(this.gl.getUniformLocation(this.id(), label), v.x, v.y, v.z);
    },

    setMatrix : function(label, mat, transpose)
    {
        var data = mat.toArray();
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.id(), label), false, new Float32Array(data));
        //console.log("Shader::setMatrix location: " +this.gl.getUniformLocation(this.id(), label));
    },

   loadShaderSrc : function(fileUrl)
    {
        var http = new XMLHttpRequest();
        http.open("GET", fileUrl+'?'+(new Date()).getTime(), false) // force reload
        http.send(null);
        return http.responseText;
    }
}