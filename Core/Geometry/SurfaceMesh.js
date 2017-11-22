
Pixel.Core.Geometry.SurfaceMesh = function(glContext)
{
    this.gl = glContext;
    this.vbos = new Array();
    this.textures = new Array();

    this.shader = new Pixel.Core.OpenGL.Shader(this.gl, "webgl_engine/Data/Shader/SurfaceMesh/SimplePhong.vert.glsl", "webgl_engine/Data/Shader/SurfaceMesh/SimplePhong.frag.glsl");

}

// Shortcut
Pixel.Vertex = Pixel.Core.Geometry.SurfaceMesh;
SurfaceMesh = Pixel.Core.Geometry.SurfaceMesh;

function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
};

Pixel.Core.Geometry.SurfaceMesh.prototype = {

    loadObj : function(fileName)
    {
        var obj = new ObjLoader(fileName);
        console.log("num meshes: " + obj.meshes.length);

        // init material textures (kd only for now)
        for(var material in obj.materialCache) {
            if(obj.materialCache[material].map_Kd != null)
            {
                var fileName = obj.path + obj.materialCache[material].map_Kd;
               this.textures[material] = this.loadTexture(fileName);
            }
        }

        for(var material in obj.meshes) {
            console.log("Process all meshes with material " + material);

            // build one vbo per material
            var buffer = new Array();

            this.vbos[material] = new Array();
            for (var i = 0; i < obj.meshes[material].length; ++i) {
                /*
                 var mat = obj.getMatByName(obj.meshes[i].name);

                 console.log("Material: " + mat.name);
                 console.log("Ns: " + mat.Ns);
                 console.log("Ka: " + mat.Ka);
                 console.log("Kd: " + mat.Kd);
                 console.log("Ks: " + mat.Ks);
                 console.log("map_Ka: " + mat.map_Ka);
                 console.log("map_Kd: " + mat.map_Kd);
                 console.log("map_Ks: " + mat.map_Ks);
                 console.log("\n");
                 */

                var faces = obj.meshes[material][i];
                for (var j = 0; j < faces.length; ++j) {
                    var face = faces[j];

                    // vertex a
                    buffer.push(face.va.position.x); // vx
                    buffer.push(face.va.position.y); // vy
                    buffer.push(face.va.position.z); // vz
                    buffer.push(1.0);                // vw

                    buffer.push(face.va.normal.x);   // nx
                    buffer.push(face.va.normal.y);   // ny
                    buffer.push(face.va.normal.z);   // nz
                    buffer.push(1.0);                // nw

                    buffer.push(face.va.color.x);     // cx
                    buffer.push(face.va.color.y);     // cy
                    buffer.push(face.va.color.z);     // cz
                    buffer.push(1.0);                 // cw

                    buffer.push(face.va.texCoords.x); // tx
                    buffer.push(face.va.texCoords.y); // ty
                    buffer.push(0.0);                 // tz
                    buffer.push(0.0);                 // tw

                    // vertex b
                    buffer.push(face.vb.position.x); // vx
                    buffer.push(face.vb.position.y); // vy
                    buffer.push(face.vb.position.z); // vz
                    buffer.push(1.0);                // vw

                    buffer.push(face.vb.normal.x);   // nx
                    buffer.push(face.vb.normal.y);   // ny
                    buffer.push(face.vb.normal.z);   // nz
                    buffer.push(1.0);                // nw

                    buffer.push(face.vb.color.x);     // cx
                    buffer.push(face.vb.color.y);     // cy
                    buffer.push(face.vb.color.z);     // cz
                    buffer.push(1.0);                 // cw

                    buffer.push(face.vb.texCoords.x); // tx
                    buffer.push(face.vb.texCoords.y); // ty
                    buffer.push(0.0);                 // tz
                    buffer.push(0.0);                 // tw

                    // vertex c
                    buffer.push(face.vc.position.x); // vx
                    buffer.push(face.vc.position.y); // vy
                    buffer.push(face.vc.position.z); // vz
                    buffer.push(1.0);                // vw

                    buffer.push(face.vc.normal.x);   // nx
                    buffer.push(face.vc.normal.y);   // ny
                    buffer.push(face.vc.normal.z);   // nz
                    buffer.push(1.0);                // nw

                    buffer.push(face.vc.color.x);     // cx
                    buffer.push(face.vc.color.y);     // cy
                    buffer.push(face.vc.color.z);     // cz
                    buffer.push(1.0);                 // cw

                    buffer.push(face.vc.texCoords.x); // tx
                    buffer.push(face.vc.texCoords.y); // ty
                    buffer.push(0.0);                 // tz
                    buffer.push(0.0);                 // twc
                }
            }

            var numVertices = buffer.length / 16;

            var vbo = new Pixel.Core.OpenGL.VertexBufferObject(this.gl);

            vbo.setData(buffer, this.gl.STATIC_DRAW, numVertices, this.gl.TRIANGLES);
            vbo.addAttrib(VERTEX_POSITION);
            vbo.addAttrib(VERTEX_NORMAL);
            vbo.addAttrib(VERTEX_COLOR);
            vbo.addAttrib(VERTEX_TEXTURE);
            vbo.bindAttribs();

            this.vbos[material].push(vbo);
        }
    },


    loadTexture : function(src)
    {
        var tex = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 0, 255])); // red

        var self = this;
        var img = new Image();
        img.src = src;
        img.onload = function() {
            self.gl.bindTexture( self.gl.TEXTURE_2D, tex);
            self.gl.texImage2D( self.gl.TEXTURE_2D, 0,  self.gl.RGBA,  self.gl.RGBA,  self.gl.UNSIGNED_BYTE, img);

            self.gl.texParameteri( self.gl.TEXTURE_2D,  self.gl.TEXTURE_WRAP_S,  self.gl.CLAMP_TO_EDGE);
            self.gl.texParameteri( self.gl.TEXTURE_2D,  self.gl.TEXTURE_WRAP_T,  self.gl.CLAMP_TO_EDGE);
            self.gl.texParameteri( self.gl.TEXTURE_2D,  self.gl.TEXTURE_MIN_FILTER,  self.gl.LINEAR);
        }


        return tex;
    },

    render : function(camera, renderParams)
    {
        var trans = camera.currentPerspective();
        var model =  new mat4().setToIdentity(); //.translateByVector(this.center);

        this.gl.viewport(0, 0, camera.viewPort.x, camera.viewPort.y);
        this.gl.enable(this.gl.CULL_FACE)
        this.gl.cullFace(this.gl.BACK);
        this.gl.disable(this.gl.BLEND);

        this.shader.bind();
        this.shader.setMatrix("matProjection", trans.projection, false);
        this.shader.setMatrix("matView", trans.view, false);
        this.shader.setMatrix("matModel", model, false);

        for(var material in this.vbos)
        {
            // do we have a texture
            if(this.textures[material] != null)
            {
                this.gl.activeTexture(this.gl.TEXTURE1);
                this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[material]);
              //  this.gl.bindTexture(this.gl.TEXTURE_2D, this.textTexture);
                this.shader.seti("texKd", 1);
              //  console.log(this.textures[material]);
            }

            for(var i=0; i<this.vbos[material].length; ++i)
                this.vbos[material][i].render();

        }

        for(var i=0; i<this.vbos.length; ++i)


        this.shader.release();
    }

}
