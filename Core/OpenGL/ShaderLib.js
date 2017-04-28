/**
 * Predefined shaders.
 * @author Julian Kratt
 * @constructor
 */







Pixel.Core.OpenGL.ShaderLib = function()
{
    this.vShaderCode = function()
    {
       return 'attribute vec4 Position; \n\
               attribute vec4 Normal; \n\
               attribute vec4 Color; \n\
               attribute vec4 Texture; \n\
               \
               varying vec4 vNormal; \n\
               varying vec4 vColor; \n\
               varying vec4 vTexture; \n\
               \
               uniform mat4 matProjection; \n\
               uniform mat4 matModel; \n\
               uniform mat4 matView; \n\
               \
               void main() \n\
               { \n\
                 gl_Position = matProjection * matView * matModel * vec4(Position.xyz, 1.0); \n\
                 gl_PointSize = 5.0; \n\
                 vNormal  = Normal; \n\
                 vColor   = Color; \n\
                 vTexture = Texture; \n\
               } \n';
    }

    this.fShaderCode = function()
    {
        return     'precision mediump float;\n\
                    varying vec4 vNormal; \n\
                    varying vec4 vColor; \n\
                    varying vec4 vTexture; \n\
                    \
                    void main()  \n\
                    {     \n\
                        gl_FragColor = vec4(vColor.xyz, 1.0);\n\
                    } \n';
    }
}


Pixel.DefaultShader = Pixel.Core.OpenGL.DefaultShader;