

ObjMaterial = function()
{
    this.name = "default";
    this.Ns = 0.0;
    this.Ka = new vec3();
    this.Kd = new vec3();
    this.Ks = new vec3();
    this.map_Ka = null;
    this.map_Kd = null;
    this.map_Ks = null;
}

ObjMesh = function()
{
    this.faces = new Array();
    this.matName = "default";
}

Pixel.Core.Geometry.ObjLoader = function(fileName)
{
    var tmpFileName = fileName.split('/');
    var lastSize = tmpFileName[tmpFileName.length-1].length;
    this.path = fileName.substring(0, fileName.length - lastSize);

    this.meshes = [];
    this.materialCache = [];

    this.loadObjData(fileName);

    // create default material of no mtl file was found
    if(this.materialCache.length == 0)
        this.materialCache.push(new ObjMaterial());

    /*
    for(var i=0; i<this.materialCache.length; ++i)
    {
        var mat = this.materialCache[i];
        console.log("Material: " + mat.name);
        console.log("Ns: " + mat.Ns);
        console.log("Ka: " + mat.Ka);
        console.log("Kd: " + mat.Kd);
        console.log("Ks: " + mat.Ks);
        console.log("map_Ka: " + mat.map_Ka);
        console.log("map_Kd: " + mat.map_Kd);
        console.log("map_Ks: " + mat.map_Ks);
        console.log("\n");
    }
*/
    console.log("Obj loaded: " + fileName);
}

// Shortcut
Pixel.ObjLoader = Pixel.Core.Geometry.ObjLoader;
ObjLoader = Pixel.Core.Geometry.ObjLoader;

Pixel.Core.Geometry.ObjLoader.prototype = {

    loadMtlData : function(fileName)
    {
        var matData = this.loadFile(fileName);
        var lines = matData.split('\n');

        for(var i=0; i<lines.length; ++i)
        {
            var curLine = lines[i].trim();

            // skip white space and comments
            if(curLine.length == 0 || /#/.test(curLine)){
                //  console.log(curLine);
                continue;
            }
            var entries = curLine.split(/\s+/);

            // start new material
            if(/^newmtl\s/.test(curLine))
            {
                this.materialCache.push(new ObjMaterial());
                this.materialCache[this.materialCache.length - 1].name = entries[1];
            }
            else if(/^Ns\s/.test(curLine))
            {
                this.materialCache[this.materialCache.length - 1].Ns = entries[1];
            }
            else if(/Ka\s/.test(curLine))
            {
                this.materialCache[this.materialCache.length - 1].Ka = new vec3(entries[1], entries[2], entries[3]);
            }
            else if(/^Kd\s/.test(curLine))
            {
                this.materialCache[this.materialCache.length - 1].Kd = new vec3(entries[1], entries[2], entries[3]);
            }
            else if(/^Ks\s/.test(curLine))
            {
                this.materialCache[this.materialCache.length - 1].Ks = new vec3(entries[1], entries[2], entries[3]);
            }
            else if(/^map_Ka\s/.test(curLine))
            {
                this.materialCache[this.materialCache.length - 1].map_Ka = entries[1];
            }
            else if(/^map_Kd\s/.test(curLine))
            {
                this.materialCache[this.materialCache.length - 1].map_Kd = entries[1];
            }
            else if(/^map_Ks\s/.test(curLine))
            {
                this.materialCache[this.materialCache.length - 1].map_Ks = entries[1];
            }
        }
    },


    loadObjData : function(fileName)
    {
        var vertices   = new Array();
        var normals    = new Array();
        var texCoords  = new Array();

        var objData = this.loadFile(fileName);

        var curMatName = "default";
        var startNewMesh = false;

        var lines = objData.split('\n');
        for(var i=0; i<lines.length; ++i)
        {
            var curLine = lines[i].trim();

            // skip white space and comments
            if(curLine.length == 0 || /#/.test(curLine)){
                continue;
            }

            var entries = curLine.split(/\s+/);
            entries.shift();

            if(/^mtllib\s/.test(curLine)){
                console.log(entries[0]);
                this.loadMtlData(this.path + entries[0]);
            }

            if(/^usemtl\s/.test(curLine)) {
                curMatName =  entries[0];
            }

            if(/^v\s/.test(curLine)){
                vertices.push.apply(vertices, entries);
                startNewMesh = true;
            }
            else if(/^vn\s/.test(curLine))
                normals.push.apply(normals, entries);
            else if(/^vt\s/.test(curLine))
                texCoords.push.apply(texCoords, entries);
            else if(/^f\s/.test(curLine)){

                // start new face array
                if(startNewMesh){
                    if(this.meshes[curMatName] == null)
                        this.meshes[curMatName] = new Array();

                    // start new empty mesh array
                    this.meshes[curMatName].push(new Array());

                    startNewMesh = false;
                }

                // triangle
                if(entries.length == 3)
                {
                    var ids_a = entries[0].split('/');
                    var ids_b = entries[1].split('/');
                    var ids_c = entries[2].split('/');

                    var vert_a = new MeshVertex();
                    var vert_b = new MeshVertex();
                    var vert_c = new MeshVertex();

                    // set data positions
                    vert_a.position = new vec3(vertices[3 * (ids_a[0]-1)],
                        vertices[3 * (ids_a[0]-1) + 1],
                        vertices[3 * (ids_a[0]-1) + 2]);

                    vert_b.position = new vec3(vertices[3 * (ids_b[0]-1)],
                        vertices[3 * (ids_b[0]-1) + 1],
                        vertices[3 * (ids_b[0]-1) + 2]);

                    vert_c.position = new vec3(vertices[3 * (ids_c[0]-1)],
                        vertices[3 * (ids_c[0]-1) + 1],
                        vertices[3 * (ids_c[0]-1) + 2]);


                    // do we have normals?
                    if(normals.length) {
                        vert_a.normal = new vec3(normals[3 * (ids_a[2]-1)],
                            normals[3 * (ids_a[2]-1) + 1],
                            normals[3 * (ids_a[2]-1) + 2]);

                        vert_b.normal = new vec3(normals[3 * (ids_b[2]-1)],
                            normals[3 * (ids_b[2]-1) + 1],
                            normals[3 * (ids_b[2]-1) + 2]);

                        vert_c.normal = new vec3(normals[3 * (ids_c[2]-1)],
                            normals[3 * (ids_c[2]-1) + 1],
                            normals[3 * (ids_c[2]-1) + 2]);
                    }

                    // do we have texture coordinates?
                    if(texCoords.length) {
                        vert_a.texCoords = new vec2(texCoords[2 * (ids_a[1]-1)],
                            texCoords[2 * (ids_a[1]-1) + 1]);

                        vert_b.texCoords = new vec2(texCoords[2 * (ids_b[1]-1)],
                            texCoords[2 * (ids_b[1]-1) + 1]);

                        vert_c.texCoords = new vec2(texCoords[2 * (ids_c[1]-1)],
                            texCoords[2 * (ids_c[1]-1) + 1]);
                    }

                    if(this.meshes[curMatName] == null) {
                        this.meshes[curMatName] = new Array();
                        this.meshes[curMatName].push(new Array());
                    }


                    var lastIdx = this.meshes[curMatName].length - 1;
                    this.meshes[curMatName][lastIdx].push(new MeshFace(vert_a, vert_b, vert_c));
                }
                // quad
                else if(entries.length == 4) {

                    var ids_a = entries[0].split('/');
                    var ids_b = entries[1].split('/');
                    var ids_c = entries[2].split('/');
                    var ids_d = entries[3].split('/');

                    var vert_a = new MeshVertex();
                    var vert_b = new MeshVertex();
                    var vert_c = new MeshVertex();
                    var vert_d = new MeshVertex();

                    // set data positions
                    vert_a.position = new vec3(vertices[3 * (ids_a[0]-1)],
                        vertices[3 * (ids_a[0]-1) + 1],
                        vertices[3 * (ids_a[0]-1) + 2]);

                    vert_b.position = new vec3(vertices[3 * (ids_b[0]-1)],
                        vertices[3 * (ids_b[0]-1) + 1],
                        vertices[3 * (ids_b[0]-1) + 2]);

                    vert_c.position = new vec3(vertices[3 * (ids_c[0]-1)],
                        vertices[3 * (ids_c[0]-1) + 1],
                        vertices[3 * (ids_c[0]-1) + 2]);

                    vert_d.position = new vec3(vertices[3 * (ids_d[0]-1)],
                        vertices[3 * (ids_d[0]-1) + 1],
                        vertices[3 * (ids_d[0]-1) + 2]);


                    // do we have normals?
                    if(normals.length) {
                        vert_a.normal = new vec3(normals[3 * (ids_a[2]-1)],
                            normals[3 * (ids_a[2]-1) + 1],
                            normals[3 * (ids_a[2]-1) + 2]);

                        vert_b.normal = new vec3(normals[3 * (ids_b[2]-1)],
                            normals[3 * (ids_b[2]-1) + 1],
                            normals[3 * (ids_b[2]-1) + 2]);

                        vert_c.normal = new vec3(normals[3 * (ids_c[2]-1)],
                            normals[3 * (ids_c[2]-1) + 1],
                            normals[3 * (ids_c[2]-1) + 2]);

                        vert_d.normal = new vec3(normals[3 * (ids_d[2]-1)],
                            normals[3 * (ids_d[2]-1) + 1],
                            normals[3 * (ids_d[2]-1) + 2]);
                    }

                    // do we have texture coordinates?
                    if(texCoords.length) {
                        vert_a.texCoords = new vec2(texCoords[2 * (ids_a[1]-1)],
                            texCoords[2 * (ids_a[1]-1) + 1]);

                        vert_b.texCoords = new vec2(texCoords[2 * (ids_b[1]-1)],
                            texCoords[2 * (ids_b[1]-1) + 1]);

                        vert_c.texCoords = new vec2(texCoords[2 * (ids_c[1]-1)],
                            texCoords[2 * (ids_c[1]-1) + 1]);

                        vert_d.texCoords = new vec2(texCoords[2 * (ids_d[1]-1)],
                            texCoords[2 * (ids_d[1]-1) + 1]);
                    }

                    if(this.meshes[curMatName] == null) {
                        this.meshes[curMatName] = new Array();
                        this.meshes[curMatName].push(new Array());
                    }

                    var lastIdx = this.meshes[curMatName].length - 1;
                    this.meshes[curMatName][lastIdx].push(new MeshFace(vert_a, vert_b, vert_c));
                    this.meshes[curMatName][lastIdx].push(new MeshFace(vert_a, vert_c, vert_d));
                }
            }
        }
    },

    loadFile : function (fileUrl) {
        var http = new XMLHttpRequest();
        var fileContent;
        http.open("GET", fileUrl, false);
        http.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded");
        http.send(null);
        fileContent = http.responseText;

        return fileContent;
    },

    getMeshes : function()
    {
      return this.meshes;
    },

    getMatByName : function(matName)
    {
        /*
        for(var i=0; i<this.materialCache.length; ++i)
        {
            if(this.materialCache[i].name == matName)
            return this.materialCache[i];
        }
        return null;
        */
    }
}
