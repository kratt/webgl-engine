Pixel.Core.Geometry.MeshVertex = function()
{
    this.position = new vec3();
    this.normal = new vec3();
    this.color = new vec3();
    this.texCoords = new vec2();
}

// Shortcut
Pixel.MeshVertex = Pixel.Core.Geometry.MeshVertex;
MeshVertex = Pixel.Core.Geometry.MeshVertex;
