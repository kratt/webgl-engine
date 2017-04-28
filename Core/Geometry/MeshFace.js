Pixel.Core.Geometry.MeshFace = function(va, vb, vc)
{
    if(Pixel.Core.Geometry.MeshFace.arguments.length < 3)
    {
        this.va = new MeshVertex();
        this.vb = new MeshVertex();
        this.vc = new MeshVertex();
    }
    else
    {
        this.va = va;
        this.vb = vb;
        this.vc = vc;
    }

    return this;
}

// Shortcut
Pixel.Vertex = Pixel.Core.Geometry.MeshFace;
MeshFace = Pixel.Core.Geometry.MeshFace;
